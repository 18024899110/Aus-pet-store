import React from 'react';
import HeaderCardNav from './HeaderCardNav';
import { Container } from 'react-bootstrap';

/**
 * HeaderCardNav 演示页面
 * 展示如何使用 React Bits Card Nav 导航栏
 */
const HeaderCardNavDemo = () => {
  return (
    <div>
      <HeaderCardNav />

      <Container className="mt-5">
        <h1>React Bits Card Nav 导航栏演示</h1>
        <p className="lead">这是使用 React Bits 的 Card Nav 组件创建的新导航栏</p>

        <div className="mt-4">
          <h2>特性</h2>
          <ul>
            <li>✨ 使用 React Bits Card 和 CardNav 组件</li>
            <li>🎨 渐变背景和现代设计</li>
            <li>🔍 集成搜索功能</li>
            <li>🛒 购物车徽章显示</li>
            <li>📱 完全响应式设计</li>
            <li>🎯 图标增强的导航链接</li>
          </ul>
        </div>

        <div className="mt-4">
          <h2>如何在 App.js 中使用</h2>
          <pre style={{
            background: '#2d2d2d',
            color: '#f8f8f2',
            padding: '20px',
            borderRadius: '10px',
            overflow: 'auto'
          }}>
{`import HeaderCardNav from './components/HeaderCardNav';

function App() {
  return (
    <div className="App">
      {/* 替换原来的 Header 组件 */}
      <HeaderCardNav />

      <Routes>
        {/* 你的路由... */}
      </Routes>
    </div>
  );
}`}
          </pre>
        </div>

        <div className="mt-4 mb-5">
          <h2>组件位置</h2>
          <ul>
            <li><strong>组件文件:</strong> <code>src/components/HeaderCardNav.js</code></li>
            <li><strong>样式文件:</strong> <code>src/components/HeaderCardNav.css</code></li>
          </ul>
        </div>
      </Container>
    </div>
  );
};

export default HeaderCardNavDemo;
