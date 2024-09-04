import { kv } from '@vercel/kv';

const BANNED_WORDS = process.env.BANNED_WORDS ? JSON.parse(process.env.BANNED_WORDS) : [];

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
        res.status(200).json({ message: '願望添加成功' });
      } else {
        res.status(500).json({ message: '服務器錯誤：無法獲取願望列表' });
      }
    } else {
      res.status(400).json({ message: '願望包含不適當的內容' });
    }
  } else if (req.method === 'GET') {
    try {
      const wishes = await kv.get('wishes');
      if (!wishes || !Array.isArray(wishes)) {
        res.status(200).json([]);
      } else {
        res.status(200).json(wishes);
      }
    } catch (error) {
      console.error('獲取願望時出錯:', error);
      res.status(500).json({ message: '服務器錯誤：無法獲取願望列表' });
    }
  } else {
    console.log('不支持的方法:', req.method);
    res.status(405).json({ message: '方法不允許' });
  }
}