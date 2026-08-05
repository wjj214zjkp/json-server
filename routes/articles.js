const express = require('express');
const router = express.Router();
const articleService = require('../services/aritcles');

/** 按请求的条件，分页查询文章记录 */
router.get('/', async (req, res) => {
    try {
        // 此处可添加分页逻辑
        // 1. 获取请求参数
        const {
            page = 1,
            pageSize = 10,
            keyword = '',
            category = '',
            status = '',
            author = '',
            sortBy = 'createdAt',
            order = 'desc'
        } = req.query;

        // 2. 参数转换
        const pageNum = parseInt(page, 10) || 1;
        const size = Math.min(parseInt(pageSize, 10) || 10, 50);


        // 3. 从 db.json 中获取所有文章
        let articles = await articleService.getArticles(); // 获取数据库实例

        // 4. 条件筛选
        // 关键词搜索（标题或内容）
        if (keyword) {
            const kw = keyword.toLowerCase();
            articles = articles.filter(item =>
                item.title.toLowerCase().includes(kw) ||
                (item.content && item.content.toLowerCase().includes(kw))
            );
        }

        // 分类筛选
        if (category) {
            articles = articles.filter(item => item.category === category);
        }

        // 状态筛选
        if (status) {
            articles = articles.filter(item => item.status === status);
        }

        // 作者模糊搜索
        if (author) {
            const auth = author.toLowerCase();
            articles = articles.filter(item =>
                item.author && item.author.toLowerCase().includes(auth)
            );
        }

        // 5. 排序
        if (sortBy) {
            const sortOrder = order === 'createdAt' ? 1 : -1;
            articles = articles.sort((a, b) => {
                const valA = a[sortBy] || '';
                const valB = b[sortBy] || '';
                if (typeof valA === 'string') {
                    return valA.localeCompare(valB) * sortOrder;
                }
                return (valA - valB) * sortOrder;
            });
        }

        // 6. 计算总数
        const total = articles.length;
        const totalPages = Math.ceil(total / size);


        // 7. 分页切片
        const start = (pageNum - 1) * size;
        const end = start + size;

        const list = articles.slice(start, end);
        // console.log("list", list)

        // 8. 返回标准格式
        return res.json({
            code: 200,
            message: 'success',
            data: {
                current: pageNum,
                pageSize: size,
                total: total,
                totalPages: totalPages,
                list: list
            }
        });
        // return res.json({ code: 200, data: articles });
    } catch (err) { res.status(500).json({ message: '服务器错误' }); }
});

// 根据文章 id 查询文章记录
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await articleService.getArticle(id);
        return res.json(result);
    } catch (err) {
        console.log('文章记录: ', err.message)
        return res.status(500).json({ message: '服务器错误' });
    }
})

// 根据传递过来的文章记录修改字段名为 like， views, stepOn 的值
router.put('/update', async (req, res) => {
    const body = req.body;
    try {
        const result = await articleService.updateArticle(body);
        return res.json(result);
    } catch (err) {
        console.log('文章记录: ', err.message)
        return res.status(500).json({ message: '服务器错误' });
    }
})

module.exports = router;
