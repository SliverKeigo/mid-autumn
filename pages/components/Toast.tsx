import {ToastType} from '@/types/ToastType';
import {AlertCircle, CheckCircle, Info, LucideIcon} from 'lucide-react'
import {useEffect, useState} from "react";

interface ToastProps {
  message: string
  type: ToastType
}

const IconMap = {
  success: CheckCircle,
  error: AlertCircle,
  info: Info
}

const Toast = ({ message, type }: ToastProps) => {
  const bgColor = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    info: 'bg-blue-500'
  }[type]

  const [Icon, setIcon] = useState<React.ComponentType<any> | null>(null)

  useEffect(() => {
    const loadIcon = async () => {
      const icons = await import('lucide-react')
      const iconName = type.charAt(0).toUpperCase() + type.slice(1)
      setIcon(() => (icons as any)[iconName] as LucideIcon)
    }
    loadIcon()
  }, [type])

  return (
    <div className={`fixed top-4 right-4 flex items-center ${bgColor} text-white px-4 py-2 rounded-lg shadow-lg animate-toast`}>
      {Icon && <Icon className="w-5 h-5 mr-2"/>}
      <span className="font-medium">{message}</span>
    </div>
  )
}

export default Toast
