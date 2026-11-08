// ブラウザから直接CSVを取れないときだけ使う中継。Googleのドメイン以外は通しません。
module.exports = async (req, res) => {
  let u;
  try { u = new URL(String(req.query.url || '')); } catch (e) { return res.status(400).send('URLが正しくありません'); }
  const allowed = u.protocol === 'https:' && (u.hostname === 'docs.google.com' || u.hostname.endsWith('.googleusercontent.com'));
  if (!allowed) return res.status(400).send('GoogleスプレッドシートのURLだけ使えます');
  try {
    const r = await fetch(u.toString(), { redirect: 'follow' });
    const text = await r.text();
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Cache-Control', 'no-store');
    res.status(r.status).send(text);
  } catch (e) {
    res.status(502).send('取得に失敗しました：' + e.message);
  }
};
