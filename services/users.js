// ====== 用户数据操作 ====== // 
const { pool } = require('./db');
const bcrypt = require('bcrypt');

async function getUserByUsername(username) {
    const res = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
    return res.rows[0] || null;
}

async function createUser(username, password) {
    // id 让数据库自动生成
    const res = await pool.query(
        'INSERT INTO users (username, password, "createdAt") VALUES ($1, $2, NOW()) RETURNING *',
        [username, password]
    );
    return res.rows;
}

module.exports = { getUserByUsername, createUser };
