import { kv } from '@vercel/kv';

const BANNED_WORDS = process.env.BANNED_WORDS ? JSON.parse(process.env.BANNED_WORDS) : [];
// 判斷違禁詞是否為空
if (BANNED_WORDS.length === 0) {
  console.error('違禁詞列表為空，請設置違禁詞列表');
}else{
  console.log('違禁詞列表:', BANNED_WORDS);
}

export default async function handler(req: any, res: any) {
  console.log('收到請求:', req.method, req.url);

  if (req.method === 'POST') {
    console.log('POST 請求體:', req.body);
    const wish = req.body.wish;

    // 使用環境變量中的違禁詞列表
    const containsBannedWord = BANNED_WORDS.some((word: string) => wish.includes(word));

    if (!containsBannedWord) {
      const wishes = await kv.get('wishes') || [];
      if (Array.isArray(wishes)) {
        wishes.push(wish);
        await kv.set('wishes', wishes);
        res.status(200).json({ code: 200, message: '願望添加成功' });
      } else {
        res.status(500).json({ code: 500, message: '服務器錯誤：無法獲取願望列表' });
      }
    } else {
      res.status(400).json({ code: 400, message: '願望包含不適當的內容' });
    }
  } else if (req.method === 'GET') {
    try {
      console.log('開始處理 GET 請求');
      const wishes = await kv.get('wishes');
      console.log('從 KV 獲取的願望:', wishes);

      if (!wishes) {
        console.log('沒有找到願望，返回空數組');
        return res.status(200).json({ code: 200, data: [] });
      }

      if (typeof wishes === 'string') {
        console.error('從 KV 存儲獲取的願望是字符串:', wishes);
        try {
          const parsedWishes = JSON.parse(wishes);
          if (Array.isArray(parsedWishes)) {
            console.log('成功解析願望列表，數量:', parsedWishes.length);
            return res.status(200).json({ code: 200, data: parsedWishes });
          }
        } catch (parseError) {
          console.error('解析願望字符串時出錯:', parseError);
        }
        return res.status(200).json({ code: 200, data: [] });
      }

      if (!Array.isArray(wishes)) {
        console.error('從 KV 存儲獲取的願望不是數組:', wishes);
        return res.status(200).json({ code: 200, data: [] });
      }

      console.log('成功獲取願望列表，數量:', wishes.length);
      return res.status(200).json({ code: 200, data: wishes });

    } catch (error) {
      console.error('獲取願望時出錯:', error);
      return res.status(500).json({ code: 500, message: '服務器錯誤：無法獲取願望列表', error: String(error) });
    }
  } else {
    console.log('不支持的方法:', req.method);
    res.status(405).json({ code: 405, message: '方法不允許' });
  }
}