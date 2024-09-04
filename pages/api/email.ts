import { kv } from '@vercel/kv'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const emails = await kv.get('emails') || []
      res.status(200).json(emails)
    } catch (error) {
      console.error('获取邮箱列表时出错:', error)
      res.status(500).json({ message: '服务器错误' })
    }
  } else if (req.method === 'POST') {
    try {
      const { email } = req.body
      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return res.status(400).json({ message: '无效的邮箱地址' })
      }

      const emails: string[] = await kv.get('emails') || []

      if (emails.includes(email)) {
        return res.status(409).json({ message: '该邮箱已存在' })
      }

      emails.push(email)
      await kv.set('emails', emails)
      
      res.status(200).json({ message: '邮箱添加成功' })
    } catch (error) {
      console.error('添加邮箱时出错:', error)
      res.status(500).json({ message: '服务器错误' })
    }
  } else {
    res.status(405).json({ message: '不支持的请求方法' })
  }
}