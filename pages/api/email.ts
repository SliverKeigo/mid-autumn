// 写一个接口 接收邮箱 将邮箱存入email.json
import fs from 'fs'
import path from 'path'

export default function handler(req: any, res: any) {
  const { email } = req.body
  const emails = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'email.json'), 'utf8'))
  emails.push(email)
  fs.writeFileSync(path.join(process.cwd(), 'email.json'), JSON.stringify(emails, null, 2))
  res.status(200).json({ message: 'Email added successfully' })
}