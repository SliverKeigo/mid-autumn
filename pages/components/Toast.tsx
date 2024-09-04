import { useState } from 'react'
import { CheckCircle, AlertCircle, Info } from 'lucide-react'
import { ToastType } from '@/types/ToastType';

interface ToastProps {
  message: string
  type: ToastType
}

const Toast = ({ message, type }: ToastProps) => {
  const bgColor = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    info: 'bg-blue-500'
  }[type]

  const Icon = {
    success: CheckCircle,
    error: AlertCircle,
    info: Info
  }[type]

  return (
    <div className={`fixed top-4 right-4 flex items-center ${bgColor} text-white px-4 py-2 rounded-lg shadow-lg animate-toast`}>
      <Icon className="w-5 h-5 mr-2" />
      <span className="font-medium">{message}</span>
    </div>
  )
}

export default Toast
