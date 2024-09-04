import { kv } from '@vercel/kv';

const BANNED_WORDS = process.env.BANNED_WORDS ? JSON.parse(process.env.BANNED_WORDS) : [];

export default async function handler(req: any, res: any) {
  if (req.method === 'POST') {
    const wish = req.body.wish;

    // 使用環境變量中的違禁詞列表
    const containsBannedWord = BANNED_WORDS.some((word: string) => wish.includes(word));

    if (!containsBannedWord) {
      const wishes = await kv.get('wishes') || [];
      if (Array.isArray(wishes)) {
        wishes.push(wish);
        await kv.set('wishes', wishes);
        res.status(200).json({ message: '願望添加成功' });
      } else {
        res.status(500).json({ message: '服務器錯誤：無法獲取願望列表' });
      }
    } else {
      res.status(400).json({ message: '願望包含不適當的內容' });
    }
  } else if (req.method === 'GET') {
    const wishes = await kv.get('wishes') || [];
    res.status(200).json(wishes);
  } else {
    res.status(405).json({ message: '方法不允許' });
  }
}