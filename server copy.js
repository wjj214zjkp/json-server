// const express = require('express');
// const cors = require('cors');
// const bodyParser = require('body-parser');
// const jwt = require('jsonwebtoken');
// const fs = require('fs');
// const path = require('path');
// const { Client } = require('pg'); // 引入 pg 库

// const app = express();
// const PORT = process.env.PORT || 3000;  // 优先使用 Render 分配的端口
// const SECRET_KEY = 'my_secret_key_123'; // JWT 加密密钥

// // 读取 db.json 文件
// const dbPath = path.join(__dirname, 'db.json');
// const getDB = () => JSON.parse(fs.readFileSync(dbPath, 'utf-8'));
// const saveDB = (db) => fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));

// // 获取用户列表
// const getUsers = () => {
//     try {
//         const db = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));
//         // 如果 users 不存在或不是数组，返回空数组
//         return Array.isArray(db.users) ? db.users : [];
//     } catch (err) {
//         // 如果文件损坏或不存在，返回空数组
//         return [];
//     }
// };

// // 保存用户到 db.json
// const saveUsers = (users) => {
//     const db = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));
//     db.users = users;
//     fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
// };

// // 保存articleList到 db.json
// const saveAritcleList = (articleList) => {
//     const db = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));
//     db.articleList = articleList;
//     fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
// }

// /** 获取面经列表 */
// const getArticles = () => {
//     try {
//         const db = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));
//         // 如果 articleList 不存在或不是数组，返回空数组
//         return Array.isArray(db.articleList) ? db.articleList : [];
//     } catch (err) {
//         // 如果文件损坏或不存在，返回空数组
//         return [];
//     }
// };

// // 获取收藏列表
// const getFavorites = () => {
//     try {
//         const db = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));
//         // 如果 articleList 不存在或不是数组，返回空数组
//         return Array.isArray(db.favorites) ? db.favorites : [];
//     } catch (err) {
//         // 如果文件损坏或不存在，返回空数组
//         return [];
//     }
// };

// // 保存收藏列表到 db.json
// const saveFavoriteList = (favoriteList) => {
//     const db = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));
//     db.favorites = favoriteList;
//     fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
// }


// app.use(cors()); // 解决跨域
// app.use(bodyParser.json());

// // 1 注册接口
// app.post('/register', (req, res) => {
//     console.log('注册接口收到的请求体:', req.body); // 👈 添加这一行
//     const { username, password } = req.body;
//     if (!username || !password) {
//         return res.status(400).json({ message: '邮箱和密码不能为空' });
//     }

//     let users = getUsers();
//     // 检查是否已注册
//     if (users.find(u => u.username === username)) {
//         return res.status(400).json({ message: '该邮箱已被注册' });
//     }

//     // 创建新用户（随便什么邮箱密码都行）
//     const newUser = {
//         id: Date.now().toString(), // 用时间戳当ID，简单粗暴
//         username,
//         password // 明文存储（仅做演示，正式项目记得用 bcrypt 加密）
//     };
//     users.push(newUser);
//     saveUsers(users);

//     // 生成 token expiresIn 为令牌有效期 => 1h 表示1小时 7d 表示7天
//     const accessToken = jwt.sign({ username, id: newUser.id }, SECRET_KEY, { expiresIn: '7d' });
//     res.status(201).json({ accessToken, user: { username, id: newUser.id } });
// });

// // 2 登录接口
// app.post('/login', (req, res) => {
//     console.log('登录接口收到的请求体:', req.body); // 👈 添加这一行
//     const { username, password } = req.body;
//     const users = getUsers();
//     const user = users.find(u => u.username === username && u.password === password);

//     if (!user) {
//         return res.status(401).json({ message: '邮箱或密码错误' });
//     }

//     /** expiresIn 为令牌有效期 => 1h 表示1小时 7d 表示7天*/
//     const accessToken = jwt.sign({ username, id: user.id }, SECRET_KEY, { expiresIn: '7d' });
//     res.json({ accessToken, user: { username, password, id: user.id } });
// });

// // 🔒 鉴权中间件（用于测试受保护路由）
// const authenticate = (req, res, next) => {
//     const authHeader = req.headers.authorization;
//     if (!authHeader) return res.status(401).json({ message: '未授权' });
//     const token = authHeader.split(' ')[1];
//     try {
//         const decoded = jwt.verify(token.trim(), SECRET_KEY);
//         // 把用户 ID 挂载到 req 对象上，供后续接口使用
//         req.user = {
//             id: decoded.id,
//             username: decoded.username
//         };
//         next();
//     } catch (err) {
//         console.error('鉴权失败具体原因：', err.name); // 这里会显示 TokenExpiredError 或 invalid signature
//         return res.status(403).json({ message: '无效 Token' });
//     }
// };

// /** 面经 articleList */
// // 3 面经列表查询接口 公开，无需登录,
// // app.get('/articles', (req, res) => {
// //     console.log('面经列表接口收到的请求头:', req.header); // 👈 添加这一行
// //     const articles = getArticles();
// //     res.json(articles)
// // });

// // =============================================
// // 自定义分页接口：GET /api/articles
// // =============================================
// app.get('/articles', (req, res) => {
//     // 1. 获取请求参数
//     const {
//         page = 1,
//         pageSize = 10,
//         keyword = '',
//         category = '',
//         status = '',
//         author = '',
//         sortBy = 'createdAt',
//         order = 'desc'
//     } = req.query;

//     // 2. 参数转换
//     const pageNum = parseInt(page, 10) || 1;
//     const size = Math.min(parseInt(pageSize, 10) || 10, 50);

//     // 3. 从 db.json 中获取所有文章
//     let articles = getArticles(); // 获取数据库实例

//     // 4. 条件筛选
//     // 关键词搜索（标题或内容）
//     if (keyword) {
//         const kw = keyword.toLowerCase();
//         articles = articles.filter(item =>
//             item.title.toLowerCase().includes(kw) ||
//             (item.content && item.content.toLowerCase().includes(kw))
//         );
//     }

//     // 分类筛选
//     if (category) {
//         articles = articles.filter(item => item.category === category);
//     }

//     // 状态筛选
//     if (status) {
//         articles = articles.filter(item => item.status === status);
//     }

//     // 作者模糊搜索
//     if (author) {
//         const auth = author.toLowerCase();
//         articles = articles.filter(item =>
//             item.author && item.author.toLowerCase().includes(auth)
//         );
//     }

//     // 5. 排序
//     if (sortBy) {
//         const sortOrder = order === 'createdAt' ? 1 : -1;
//         articles = articles.sort((a, b) => {
//             const valA = a[sortBy] || '';
//             const valB = b[sortBy] || '';
//             if (typeof valA === 'string') {
//                 return valA.localeCompare(valB) * sortOrder;
//             }
//             return (valA - valB) * sortOrder;
//         });
//     }

//     // 6. 计算总数
//     const total = articles.length;
//     const totalPages = Math.ceil(total / size);

//     // 7. 分页切片
//     const start = (pageNum - 1) * size;
//     const end = start + size;
//     const list = articles.slice(start, end);

//     // 8. 返回标准格式
//     res.json({
//         code: 200,
//         message: 'success',
//         data: {
//             current: pageNum,
//             pageSize: size,
//             total: total,
//             totalPages: totalPages,
//             list: list
//         }
//     });
// });


// // 4 面经单条记录查询接口 公开，无需登录
// app.get('/article/:id', (req, res) => {
//     const articles = getArticles();
//     console.log('面经单条记录接口收到的请求头:', req.header); // 👈 添加这一行
//     const product = articles.find(p => Number(p.id) === Number(req.params.id));
//     if (!product) {
//         return res.status(404).json({ message: '商品不存在' });
//     }
//     res.json(product);
// });

// // 5 面经单条记录修改接口 需要鉴权/登录
// app.put('/article/:id', authenticate, (req, res) => {
//     const articles = getArticles();
//     const id = req.params.id;
//     const index = articles.findIndex(a => a.id === id);
//     if (index === -1) {
//         return res.status(404).json({ message: '文章不存在' });
//     }
//     const currUser = req.user;

//     /** 判断用户修改了哪些具体的数据 */
//     const oldArticle = articles[index];
//     const newArticle = req.body;

//     // 两对象比较方法 旧(obj1) 新(obj2)  即同一id记录更新与旧记录的比较方法
//     function compareKeys(obj1, obj2, keys) {
//         const diff = {};
//         keys.forEach(key => {
//             if (obj1[key] !== obj2[key]) {
//                 diff[key] = { old: obj1[key], new: obj2[key] };
//             }
//         });
//         return diff;
//     }

//     // 打印变化的数据
//     const diffValue = JSON.stringify(compareKeys(oldArticle, newArticle, ['likeCount', 'views', 'stepOn']))
//     console.log(currUser.username + ' 用户修改了 id 为 ' + id + ' 的记录，变化的数据有：' + diffValue);
//     const currDate = new Date().toISOString()
//     articles[index] = {
//         ...articles[index],
//         ...req.body,
//         id: req.params.id, // 防止 ID 被覆盖
//         createdAt: currDate
//     };
//     console.log(currDate)
//     const article = articles[index];
//     saveAritcleList(articles);
//     res.json({ article, user: currUser });
// });

// /** 收藏列表 favorite */
// app.get('/favorites/:username', (req, res) => {
//     console.log('收藏列表接口查询收到的请求头:', req.header); // 👈 添加这一行
//     const favorites = getFavorites();
//     const index = favorites.findIndex(a => a.username === req.params.username);

//     res.json(favorites[index].data.length === 0 ? [] : favorites[index].data)
// });

// // 收藏单条记录查询接口
// app.get('/favorite/:username/:id', (req, res) => {
//     const favorites = getFavorites();
//     const id = req.params.id;
//     const username = req.params.username;
//     const returnMes = { message: '' }
//     console.log('收藏单条记录查询接口收到的请求头:', req.header); // 👈 添加这一行

//     const index = favorites.findIndex(a => a.username === username);
//     if (index === -1) {
//         return res.status(404).json({ message: '用户收藏夹没有创建！' })
//     } else {
//         const childIndex = favorites[index].data.findIndex(a => a.id === id);
//         if (childIndex !== -1) {
//             console.log(username + '用户：' + username + '正在查询ID为' + id + '的记录')
//             returnMes.message = '查询ID为' + id + '的记录成功！'
//             const result = favorites[index].data[childIndex];
//             res.json(result);
//         } else {
//             console.log(username + '用户：该条目之前无收藏，新增至收藏夹！')
//             returnMes.message = '查询到该用户下无此记录！'
//             res.json({});
//         }
//     }
// });

// /** 登录时创建收藏夹 */
// app.put('/favorites/:username', authenticate, (req, res) => {
//     const favorites = getFavorites();
//     const username = req.params.username;
//     const flag = favorites.findIndex(a => a.username === username);
//     const state = { message: '' }
//     if (flag === -1) {
//         favorites.push({
//             username: username,
//             data: [],
//             createdAt: new Date()
//         })
//         state.message = username + '用户：创建收藏夹成功！'
//         console.log('favorites', favorites)
//         saveFavoriteList(favorites);
//     } else {
//         state.message = username + '用户：收藏夹已存在，无需创建！'
//     }
//     console.log(state.message)
//     res.json(state);
// })

// /** 根据 收藏记录id 和用户名称 username 来添加删除收藏列表数据 */
// app.put('/favorites/:username/:id', authenticate, (req, res) => {
//     const favorites = getFavorites();
//     const id = req.params.id;
//     const username = req.params.username;
//     const body = req.body;
//     const index = favorites.findIndex(a => a.username === username);
//     const returnMes = { message: '' }
//     if (index === -1) {
//         console.log(username + '用户：该用户还未创建收藏夹！')
//     } else {
//         const childIndex = favorites[index].data.findIndex(a => a.id === id);
//         if (childIndex !== -1) {
//             console.log(username + '用户：该条目之前有收藏，从收藏夹删除！')
//             returnMes.message = '该记录已删除！'
//             favorites[index].data.splice(childIndex, 1)
//         } else {
//             console.log(username + '用户：该条目之前无收藏，新增至收藏夹！')
//             returnMes.message = '该记录已添加！'
//             favorites[index].data.unshift(body)
//         }
//         saveFavoriteList(favorites);
//     }
//     res.json({ message: returnMes.message })

// });

// // 6 测试接口：获取个人信息（需要带 Token）
// app.get('/profile', authenticate, (req, res) => {
//     console.log('收到的请求体:', req.user);
//     res.json({ message: '访问成功', user: req.user });
// });

// // 从环境变量获取连接串，这是 Railway 自动注入的
// const client = new Client({
//   connectionString: process.env.DATABASE_URL,
//   ssl: { rejectUnauthorized: false } // Railway 通常需要开启 SSL
// });

// // 在启动服务器前连接数据库
// app.listen(PORT, '0.0.0.0', async () => {
//     await client.connect();
//     console.log(`✅ 服务器启动，已连接到数据库`);
// });

// // 启动服务器
// app.listen(PORT, '0.0.0.0', () => {
//     console.log(`✅ 自定义服务器运行在 http://localhost:${PORT}`);
//     console.log(`📝 注册: POST http://localhost:${PORT}/register`);
//     console.log(`🔐 登录: POST http://localhost:${PORT}/login`);
// });