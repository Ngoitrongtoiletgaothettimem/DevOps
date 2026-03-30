export default function AboutPage() {
  return (
    <section id="center">
      <div>
        <h1>About</h1>
        <div className="card" style={{ textAlign: 'left', width: 'min(760px, 100%)' }}>
          <p>
            Họ tên sinh viên: <strong>Nguyễn Ngọc Gia Hào</strong>
          </p>
          <p>
            Mã số sinh viên: <strong>2251220064</strong>
          </p>
          <p>
            Lớp: <strong>22ct2</strong>
          </p>

          <h2 style={{ marginTop: 18 }}>Tech stack</h2>
          <ul className="plainList">
            <li>
              Frontend: <code>React</code> + <code>Vite</code>
            </li>
            <li>
              Backend: <code>Node.js</code> + <code>Express</code>
            </li>
            <li>
              Database: <code>MySQL</code>
            </li>
            <li>
              Deploy: <code>Docker Compose</code> + <code>Nginx</code>
            </li>
          </ul>
        </div>
      </div>
    </section>
  )
}
