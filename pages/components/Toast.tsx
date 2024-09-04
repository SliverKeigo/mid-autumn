import React from 'react'

interface ToastProps {
  message: string
  type: 'success' | 'error'
}

const Toast: React.FC<ToastProps> = ({ message, type }) => {
  const bgColor = type === 'success' ? 'bg-green-500' : 'bg-red-500'

  return (
    <div className={`fixed top-4 right-4 ${bgColor} text-white px-4 py-2 rounded-lg shadow-lg`}>
      {message}
    </div>
  )
}

export default Toast
