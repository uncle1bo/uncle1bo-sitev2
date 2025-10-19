import reactLogo from "../../../assets/react.svg";
import viteLogo from "../../../../../public/vite.svg";
import cloudflareLogo from "../../../assets/Cloudflare_Logo.svg";
import honoLogo from "../../../assets/hono.svg";
import "./index.css";

function App() {
  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank" rel="noopener noreferrer">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank" rel="noopener noreferrer">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
        <a href="https://hono.dev/" target="_blank" rel="noopener noreferrer">
          <img src={honoLogo} className="logo cloudflare" alt="Hono logo" />
        </a>
        <a href="https://workers.cloudflare.com/" target="_blank" rel="noopener noreferrer">
          <img
            src={cloudflareLogo}
            className="logo cloudflare"
            alt="Cloudflare logo"
          />
        </a>
      </div>
      <h1>本网站由 Vite + React + Hono + Cloudflare 鼎力驱动</h1>
      <p className="read-the-docs">点击对应logo了解更多知识</p>
    </>
  );
}

export default App;