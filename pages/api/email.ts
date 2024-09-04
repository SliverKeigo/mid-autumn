import { kv } from '@vercel/kv'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log('收到請求:', req.method, req.url);

  if (req.method === 'GET') {
    try {
      const emails = await kv.get('emails')
      if (!emails || !Array.isArray(emails)) {
        res.status(200).json({ code: 200, data: [] })
      } else {
        res.status(200).json({ code: 200, data: emails })
      }
    } catch (error) {
      console.error('獲取郵箱列表時出錯:', error)
      res.status(500).json({ code: 500, message: '服務器錯誤' })
    }
  } else if (req.method === 'POST') {
    try {
      const { email } = req.body
      console.log('POST 請求體:', req.body);

      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return res.status(400).json({ code: 400, message: '無效的郵箱地址' })
      }

      const emails: string[] = await kv.get('emails') || []

      if (emails.includes(email)) {
        return res.status(409).json({ code: 409, message: '該郵箱已存在' })
      }

      emails.push(email)
      await kv.set('emails', emails)
      res.status(200).json({ code: 200, message: '郵箱添加成功' })
    } catch (error) {
      console.error('添加郵箱時出錯:', error)
      res.status(500).json({ code: 500, message: '服務器錯誤' })
    }
  } else {
    console.log('不支持的方法:', req.method);
    res.status(405).json({ code: 405, message: '不支持的請求方法' })
  }
}