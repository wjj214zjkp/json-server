// ====== 文章数据操作 ====== // 
const { pool } = require('./db');

// 查询文章列表
async function getArticles() {
    const res = await pool.query('SELECT * FROM articles ORDER BY "createdAt" DESC');
    return res.rows;
}

// 根据文章 id 查询文章
async function getArticle(id) {
    const res = await pool.query('SELECT * FROM articles WHERE id= $1', [id]);
    return res.rows[0];
}

// 根据文章 id 更新文章记录
async function updateArticle(updates) {
    console.log(updates);
    const fields = Object.keys(updates);
    if (fields.length === 0) return null;
    const setClause = fields.map((f, i) => `"${f}" = $${i + 1}`).join(', ');
    const values = [...fields.map(f => updates[f]), updates.id];
    const query = `UPDATE articles SET ${setClause} WHERE id = $${values.length} RETURNING *`;
    const res = await pool.query(query, values);
    return res.rows || null;
}

module.exports = { getArticle, getArticles, updateArticle };
