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
      const wishes = await kv.get('wishes');
      if (!wishes || !Array.isArray(wishes)) {
        res.status(200).json([]);
      } else {
        res.status(200).json(wishes);
      }
    } catch (error) {
      console.error('獲取願望時出錯:', error);
      res.status(500).json({ code: 500, message: '服務器錯誤：無法獲取願望列表' });
    }
  } else {
    console.log('不支持的方法:', req.method);
    res.status(405).json({ code: 405, message: '方法不允許' });
  }
}