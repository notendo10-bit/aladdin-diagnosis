export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  return res.status(200).json({ text: '{"type":"socrates","second":"plato","reason":"テスト","match":"テスト","score":"high"}' });
}
