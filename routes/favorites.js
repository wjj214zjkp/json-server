const express = require('express');
const router = express.Router();
const favService = require('../services/favorites');
const jwt = require('jsonwebtoken');
const SECRET_KEY = 'my_secret_key_123';

// 简单的认证中间件
function authenticate(req, res, next) {
    const authHeader = req.headers.authorization;

    // 1. 检查头部是否存在
    if (!authHeader) {
        console.log('req头部不存在')
        return res.status(401).json({ message: '未提供 Token' });
    }

    // 2. 分割字符串
    const parts = authHeader.split(' ');
    // 3. 检查格式是否正确 (必须是两部分，且第一部分是 Bearer)
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
        return res.status(401).json({ message: 'Token 格式错误' });
    }

    const token = parts[1];

    // 4. 再次确保 token 是字符串
    if (typeof token !== 'string') {
        console.log('再次确保 token 是字符串：', token)
        return res.status(401).json({ message: 'Token 无效' });
    }

    // 5. 验证 Token
    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        req.user = decoded;
        console.log('JWT 验证通过');
        next();
    } catch (err) {
        console.error('JWT 验证错误:', err.message);
        return res.status(401).json({ message: 'Token 无效或已过期' });
    }
}

// 收藏记录记录查询接口
router.get('/:username', async (req, res) => {
    const { username } = req.params;
    try {
        const result = await favService.getFavoritesByUsername(username);
        return res.json(result);
    } catch (err) {
        return res.status(500).json({ message: '服务器错误' });
    }
});

// 收藏单条记录查询接口
router.get('/:username/:collectId', async (req, res) => {
    const { username, collectId } = req.params;
    try {
        const result = await favService.getFavorite(username, collectId);
        return res.json(result);
    } catch (err) {
        return res.status(500).json({ message: '服务器错误' });
    }
});

// 添加收藏记录
router.put('/add', authenticate, async (req, res) => {
    const body = { ...req.body, username: req.user.username };
    try {
        const result = await favService.addTOFavorites(body)
        return res.json(result);
    } catch (err) {
        console.log('添加或删除收藏记录:', err)
        return res.status(500).json({ message: '服务器错误' });
    }
});

// 删除收藏记录
router.put('/del', authenticate, async (req, res) => {
    const body = { ...req.body, username: req.user.username };
    try {
        const result = await favService.delFromFavorites(body)
        return res.json(result);
    } catch (err) {
        console.log('添加或删除收藏记录错误:', err)
        return res.status(500).json({ message: '服务器错误' });
    }
});

module.exports = router;
