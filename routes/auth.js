const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt')
const userService = require('../services/users');
const SECRET_KEY = 'my_secret_key_123';

router.post('/register', async (req, res) => {
  const { username, password } = req.body;

  // 1. 基础参数校验
  if (!username || !password) {
    return res.status(400).json({ message: '用户名和密码不能为空' });
  }

  // 2. 密码强度简单校验（可选，建议至少6位）
  if (password.length < 6) {
    return res.status(400).json({ message: '密码长度不能少于6位' });
  }

  try {
    // 3. 检查用户是否已存在
    const existingUser = await userService.getUserByUsername(username);
    if (existingUser) {
      return res.status(400).json({ message: '该用户名已被注册' });
    }

    // 4. 【核心优化】对密码进行哈希处理
    // saltRounds=10 是平衡安全与性能的常用值
    const hashedPassword = await bcrypt.hash(password, 10);

    // 5. 创建用户，存入的是哈希后的密码
    // ***注意***：
    // 这里传入的是 hashedPassword，而不是原始 password
    // 传入了后，createUser() 中就不需要再哈希了，否则就是二次哈希
    const newUser = await userService.createUser(username, hashedPassword);

    // 6. 生成 Token
    const token = jwt.sign(
      { username: newUser.username, id: newUser.id },
      SECRET_KEY,
      { expiresIn: '7d' }
    );

    // 7. 返回结果（不返回密码哈希值）
    return res.status(201).json({
      message: '注册成功',
      accessToken: token,
      user: { username: newUser.username, id: newUser.id }
    });

  } catch (err) {
    console.error('注册错误详情:', err);
    return res.status(500).json({ message: '服务器内部错误，注册失败' });
  }
});

router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  // 1. 基础参数校验
  if (!username || !password) {
    return res.status(400).json({ message: '用户名和密码不能为空' });
  }

  try {
    // 2. 查询用户
    const user = await userService.getUserByUsername(username);

    // 3. 判断用户是否存在
    if (!user) {
      // 为了安全，提示语通常模糊处理，防止枚举攻击
      return res.status(401).json({ message: '用户名或密码错误' });
    }

    // 4. 比对密码
    // bcrypt.compare 会自动处理哈希值比对，如果 password 不匹配会返回 false
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: '用户名或密码错误' });
    }

    // 5. 生成 Token
    const token = jwt.sign(
      { username: user.username, id: user.id },
      SECRET_KEY,
      { expiresIn: '7d' }
    );

    // 6. 返回成功
    return res.json({
      accessToken: token,
      user: { username: user.username, id: user.id }
    });

  } catch (err) {
    console.error('登录错误详情:', err);
    return res.status(500).json({ message: '服务器内部错误' });
  }
});

module.exports = router;
