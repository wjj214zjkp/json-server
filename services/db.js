// ====== 数据库连接 ====== // 
const { Pool } = require('pg');
const pool = new Pool({
    user: 'postgres', host: 'localhost', database: 'mydb',
    password: 'wz..2005829', port: 5432,
});
module.exports = { pool };
