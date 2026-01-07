import React from 'react';
import ColourfulButton from './ColourfulButton';
import './ColourfulButtonDemo.css';

/**
 * ColourfulButton 组件演示页面
 * 展示不同变体和用法
 */
const ColourfulButtonDemo = () => {
  const handleClick = () => {
    alert('按钮被点击了!');
  };

  return (
    <div className="button-demo-container">
      <h1>ColourfulButton 组件演示</h1>

      <section className="demo-section">
        <h2>默认样式 (青蓝-粉紫渐变)</h2>
        <ColourfulButton onClick={handleClick}>
          点击我
        </ColourfulButton>
      </section>

      <section className="demo-section">
        <h2>Primary 变体 (蓝紫渐变)</h2>
        <ColourfulButton variant="primary" onClick={handleClick}>
          Primary 按钮
        </ColourfulButton>
      </section>

      <section className="demo-section">
        <h2>Secondary 变体 (粉紫渐变)</h2>
        <ColourfulButton variant="secondary" onClick={handleClick}>
          Secondary 按钮
        </ColourfulButton>
      </section>

      <section className="demo-section">
        <h2>不同尺寸</h2>
        <div className="button-group">
          <ColourfulButton className="small" onClick={handleClick}>
            小号按钮
          </ColourfulButton>
          <ColourfulButton className="medium" onClick={handleClick}>
            中号按钮
          </ColourfulButton>
          <ColourfulButton className="large" onClick={handleClick}>
            大号按钮
          </ColourfulButton>
        </div>
      </section>

      <section className="demo-section">
        <h2>带图标</h2>
        <ColourfulButton onClick={handleClick}>
          <span className="button-text">开始探索</span>
          <span className="button-arrow">→</span>
        </ColourfulButton>
      </section>

      <section className="demo-section">
        <h2>禁用状态</h2>
        <ColourfulButton disabled onClick={handleClick}>
          禁用按钮
        </ColourfulButton>
      </section>

      <section className="demo-section">
        <h2>使用示例代码</h2>
        <pre className="code-block">
{`import ColourfulButton from './components/ColourfulButton';

// 基本用法
<ColourfulButton onClick={handleClick}>
  点击我
</ColourfulButton>

// Primary 变体
<ColourfulButton variant="primary" onClick={handleClick}>
  Primary 按钮
</ColourfulButton>

// 带图标
<ColourfulButton onClick={handleClick}>
  <span>开始探索</span>
  <span>→</span>
</ColourfulButton>

// 禁用状态
<ColourfulButton disabled onClick={handleClick}>
  禁用按钮
</ColourfulButton>

// 自定义尺寸
<ColourfulButton className="small" onClick={handleClick}>
  小号按钮
</ColourfulButton>`}
        </pre>
      </section>
    </div>
  );
};

export default ColourfulButtonDemo;
