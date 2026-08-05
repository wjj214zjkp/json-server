const express = require('express');
const cors = require('cors');
const path = require('path');
const history = require('connect-history-api-fallback');
const authRouter = require('./routes/auth');
const articleRouter = require('./routes/articles');
const favRouter = require('./routes/favorites');

const app = express(); // express 实例
app.use(cors()); // 跨域
app.use(express.json());

// ✅ 路由挂载 (必须在 static 之前)
app.use('/api/auth', authRouter);
app.use('/api/articles', articleRouter);
app.use('/api/favorites', favRouter);

app.use(express.static(path.join(__dirname, 'dist')));
app.use(history());

app.listen(3000, () => {
    console.log(`✅ 自定义服务器运行在 http://localhost:3000`);
    console.log(`📝 注册: POST http://localhost:3000/register`);
    console.log(`🔐 登录: POST http://localhost:3000/login`);
});
