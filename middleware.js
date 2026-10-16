// 사이트 전체 잠금 — 공개할 때는 이 파일을 지우고 다시 배포하면 된다.
// 비밀번호는 Vercel 환경변수 SITE_PASSWORD에만 있다. (아이디는 아무거나)
export default function middleware(request) {
  const pass = process.env.SITE_PASSWORD;
  if (!pass) return; // 비밀번호가 없으면 잠그지 않는다
  const auth = request.headers.get('authorization') || '';
  if (auth.startsWith('Basic ')) {
    let given = '';
    try { given = atob(auth.slice(6)).split(':').slice(1).join(':'); } catch {}
    if (given === pass) return;
  }
  return new Response('준비 중인 사이트입니다.', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="preview", charset="UTF-8"',
      'Content-Type': 'text/plain; charset=utf-8',
      'X-Robots-Tag': 'noindex, nofollow',
    },
  });
}
