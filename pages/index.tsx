import React, { useEffect, useState } from 'react'
import { Clock, Coffee, Mail, Moon, Music, Send } from 'lucide-react'
import Toast from '@/pages/components/Toast';
import { ToastType } from '@/types/ToastType';

const midAutumnFacts = [
  "中秋節是東亞地區重要的傳統節日之一。",
  "月餅是中秋節最具代表性的食品。",
  "賞月是中秋節的重要活動。",
  "在中國，中秋節是法定假日。",
  "中秋節通常在農曆八月十五日慶祝。"
]

const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F', '#BB8FCE', '#82E0AA'];

const getRandomColor = () => colors[Math.floor(Math.random() * colors.length)];

export default function Component() {
  const [moonPhase, setMoonPhase] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [wish, setWish] = useState('')
  const [email, setEmail] = useState('')
  const [emails, setEmails] = useState<string[]>([])
  const [fact, setFact] = useState(midAutumnFacts[0])
  const [wishSent, setWishSent] = useState(false)
  const [wishes, setWishes] = useState<string[]>([])
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null)

  const showToastMessage = (message: string, type: ToastType) => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3000)
  }

  useEffect(() => {
    const moonInterval = setInterval(() => {
      setMoonPhase((prev) => (prev + 1) % 8)
    }, 3000)

    const factInterval = setInterval(() => {
      setFact(midAutumnFacts[Math.floor(Math.random() * midAutumnFacts.length)])
    }, 4000)

    // 獲取願望
    fetchWishes()

    return () => {
      clearInterval(moonInterval)
      clearInterval(factInterval)
    }
  }, [])

  const fetchWishes = async () => {
    try {
      const response = await fetch('/api/wishes')
      const data = await response.json()
      if (data.code != 200) {
        throw new Error('獲取願望失敗')
      }
      setWishes(data.data)
    } catch (error) {
      console.error('獲取願望時出錯:', error)
    }
  }

  const toggleMusic = () => {
    setIsPlaying(!isPlaying)
    // 這裡應該有控制音樂播放的邏輯
    // 由於我們沒有實際的音頻文件，這裡只是切換狀態
  }

  const handleWishChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setWish(e.target.value)
  }

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value)
  }

  const sendWish = async () => {
    if (wish.trim()) {
      try {
        const response = await fetch('/api/wishes', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ wish: wish.trim() }),
        })

        const data = await response.json()
        console.log('發送願望響應:', data)
        if (data.code === 200) {
          setWishSent(true)
          setWish('')
          fetchWishes()  // 重新獲取願望列表
          showToastMessage('您的願望已成功發送！', 'success')
        } else {
          showToastMessage(data.message || '發送願望時出現錯誤，請稍後再試。', 'error')
        }
      } catch (error) {
        console.error('發送願望時出錯:', error)
        showToastMessage('發送願望時出現錯誤，請稍後再試。', 'error')
      }
    }
  }

  const submitEmail = async() => {
    if (email.trim() && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      const response = await fetch('/api/email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: email.trim() }),
      })
      const data = await response.json()
      if (data.code === 200) {
        setEmail('')
        showToastMessage('感謝您的訂閱! Keigo 會在中秋節當天給您發送祝福郵件。', 'success')
      } else {
        showToastMessage('請輸入有效的郵箱地址。', 'error')
      }
    }

    return (
      <div className="min-h-screen bg-gradient-to-b from-indigo-900 to-purple-900 text-white flex flex-col items-center justify-center p-4 sm:p-6 md:p-8 relative">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="absolute text-yellow-100 opacity-50"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animation: `float 20s infinite linear`,
                animationDelay: `${i * -4}s`,
              }}
            >
              🏮
            </div>
          ))}
          <div className="stars absolute inset-0">
            {[...Array(50)].map((_, i) => (
              <div
                key={i}
                className="star"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animation: `twinkle ${Math.random() * 5 + 5}s infinite`,
                }}
              />
            ))}
          </div>
        </div>

        <div className="relative">
          <div className="absolute top-0 left-0 w-full h-32 overflow-hidden pointer-events-none z-50">
            {wishes.map((wish, index) => (
              <div
                key={index}
                className="danmaku"
                style={{
                  top: `${(index % 3) * 33.33}%`,
                  animationDelay: `${index * 3}s`,
                  color: getRandomColor(),
                }}
              >
                {wish}
              </div>
            ))}
          </div>

          <div className="z-10 flex flex-col items-center">
            <div className="relative w-40 h-40 sm:w-52 sm:h-52 md:w-64 md:h-64 bg-yellow-200 rounded-full mb-4 sm:mb-6 md:mb-8 overflow-hidden">
              <div className={`absolute inset-0 bg-yellow-100 rounded-full transition-all duration-1000 ease-in-out`}
                style={{ clipPath: `inset(0 ${moonPhase * 12.5}% 0 0)` }}></div>
              <div className="absolute top-1/4 left-1/4 w-6 h-6 sm:w-8 sm:h-8 bg-yellow-300 rounded-full"></div>
              <div className="absolute top-1/2 right-1/4 w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-yellow-300 rounded-full"></div>
              <div className="absolute bottom-1/4 left-1/3 w-7 h-7 sm:w-9 sm:h-9 md:w-10 md:h-10 bg-yellow-300 rounded-full"></div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8 mb-4 sm:mb-6 md:mb-8">
              <div className="bg-white bg-opacity-20 p-4 sm:p-5 md:p-6 rounded-lg flex flex-col items-center">
                <Moon className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 mb-2 sm:mb-3 md:mb-4 text-yellow-200" />
                <h2 className="text-lg sm:text-xl font-semibold mb-1 sm:mb-2">月下加班</h2>
                <p className="text-center text-sm sm:text-base">中秋佳節人團圓，打工人卻在辦公室賞月</p>
              </div>
              <div className="bg-white bg-opacity-20 p-4 sm:p-5 md:p-6 rounded-lg flex flex-col items-center">
                <Coffee className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 mb-2 sm:mb-3 md:mb-4 text-brown-400" />
                <h2 className="text-lg sm:text-xl font-semibold mb-1 sm:mb-2">咖啡月餅</h2>
                <p className="text-center text-sm sm:text-base">一口月餅，一口咖啡，苦甜交織的中秋味</p>
              </div>
              <div className="bg-white bg-opacity-20 p-4 sm:p-5 md:p-6 rounded-lg flex flex-col items-center">
                <Clock className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 mb-2 sm:mb-3 md:mb-4 text-blue-300" />
                <h2 className="text-lg sm:text-xl font-semibold mb-1 sm:mb-2">倒數放假</h2>
                <p className="text-center text-sm sm:text-base">熬過中秋假期前的最後衝刺，美好假期在望</p>
              </div>
            </div>

            <div className="bg-yellow-800 p-3 sm:p-4 rounded-full animate-bounce mb-4">
              <svg className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="50" cy="50" r="45" fill="#FBBF24" />
                <path d="M30 40 Q50 70 70 40" stroke="#92400E" strokeWidth="3" fill="none" />
                <circle cx="40" cy="35" r="5" fill="#92400E" />
                <circle cx="60" cy="35" r="5" fill="#92400E" />
              </svg>
            </div>

            <div className="mb-4 flex flex-col sm:flex-row items-center">
              <button onClick={toggleMusic} className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded inline-flex items-center mb-2 sm:mb-0 sm:mr-4">
                <Music className="mr-2" />
                {isPlaying ? '暫停音樂' : '播放音樂'}
              </button>
              <div className="flex items-center">
                <input
                  type="text"
                  value={wish}
                  onChange={handleWishChange}
                  placeholder="輸入您的願望"
                  className="bg-white bg-opacity-20 text-white placeholder-gray-300 rounded-l px-4 py-2 focus:outline-none"
                />
                <button onClick={sendWish} className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-r">
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>

            {wishSent && (
              <div className="mb-4 flex flex-col items-center">
                <p className="text-center mb-2">您的願望已發送！請留下您的郵箱，我們會在中秋節當天給您發送祝福。</p>
                <div className="flex items-center">
                  <input
                    type="email"
                    value={email}
                    onChange={handleEmailChange}
                    placeholder="輸入您的郵箱"
                    className="bg-white bg-opacity-20 text-white placeholder-gray-300 rounded-l px-4 py-2 focus:outline-none"
                  />
                  <button onClick={submitEmail} className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-r">
                    <Mail className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}

            <div className="text-center mb-4">
              <h3 className="text-xl font-semibold mb-2">中秋小知识</h3>
              <p>{fact}</p>
            </div>

            <p className="mt-4 sm:mt-6 md:mt-8 text-base sm:text-lg md:text-xl text-center px-4 sm:px-6 md:px-8">願所有打工人都能品嚐到甜美的月餅，欣賞到皎潔的明月！</p>
          </div>
        </div>
        {toast && <Toast message={toast.message} type={toast.type} />}

        <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
        .star {
          position: absolute;
          width: 2px;
          height: 2px;
          background: white;
          border-radius: 50%;
        }
        @keyframes twinkle {
          0%, 100% { opacity: 0; }
          50% { opacity: 1; }
        }
        .danmaku {
          position: absolute;
          white-space: nowrap;
          left: 100%;
          font-size: 18px;
          font-weight: 500;
          text-shadow: 0 0 3px rgba(0, 0, 0, 0.5);
          animation: moveLeft 15s linear infinite;
        }
        @keyframes moveLeft {
          from { left: 100%; }
          to { left: -100%; }
        }
      `}</style>
      </div>
    )
  }
}