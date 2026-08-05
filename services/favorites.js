// ====== 收藏数据操作 ====== // 
const { pool } = require('./db');

/** 添加收藏记录 */
async function addTOFavorites(data) {
    const query = `INSERT INTO favorites (username, "collectId", type, "createdAt") 
                   VALUES ($1, $2, $3, NOW()) ON CONFLICT DO NOTHING RETURNING *`;
    const res = await pool.query(query, [data.username, data.collectId, data.type]);
    return res.rows.length > 0 ? { success: true, message: '收藏成功' } : { success: false, message: '已存在' };
}

/** 删除收藏记录 */
async function delFromFavorites(data) {
    const res = await pool.query('DELETE FROM favorites WHERE username = $1 AND "collectId" = $2 RETURNING *', [data.username, data.collectId]);
    return res.rows.length > 0 ? { success: true, message: '取消成功' } : { success: true, message: '未找到' };
}

/** 查询单条收藏记录 */
async function getFavorite(username, collectId) {
    const res = await pool.query('SELECT * FROM favorites WHERE username = $1 AND "collectId" = $2', [username, collectId]);
    return res.rows[0];
}

/** 查询单用户所属的收藏记录 */
async function getFavoritesByUsername(username) {
    const res = await pool.query('SELECT * FROM favorites WHERE username = $1', [username]);
    return res.rows;
}

module.exports = { addTOFavorites, delFromFavorites, getFavorite, getFavoritesByUsername };
