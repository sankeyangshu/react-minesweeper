import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import '@unocss/reset/tailwind.css'; //初始化css
import './styles/index.less'; // 全局css
import 'uno.css'; //引入unocss
import 'virtual:svg-icons-register'; // svg-icons注册导入

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
