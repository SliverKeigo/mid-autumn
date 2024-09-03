import fs from 'fs';
import path from 'path';

export default function handler(req: any, res: any) {
  if (req.method === 'POST') {
    const wish = req.body.wish;
    const bannedWords = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'bannedWords.json'), 'utf8'));

    // 簡單的違禁詞檢查
    const containsBannedWord = bannedWords.some((word: string) => wish.includes(word));

    if (!containsBannedWord) {
      const wishes = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'wishes.json'), 'utf8'));
      wishes.push(wish);
      fs.writeFileSync(path.join(process.cwd(), 'wishes.json'), JSON.stringify(wishes));
      res.status(200).json({ message: 'Wish added successfully' });
    } else {
      res.status(400).json({ message: 'Wish contains inappropriate content' });
    }
  } else if (req.method === 'GET') {
    const wishes = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'wishes.json'), 'utf8'));
    res.status(200).json(wishes);
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}