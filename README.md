# json-server

##  Project Introduction
本地搭建 JSON Server 创建 json-server 会自动生成标准的 RESTful API 接口。

### Building Steps
1. 安装依赖 npm install json-server jsonwebtoken cors body-parser express
2. 创建 db.json 并添加数据 {"users":[], ...}
3. 创建 json-server 编写程序 生成标准的 RESTful API 接口。

### gitee 0197ea9a9316238c7d7e79ed1de6a600

### Compiles and hot-reloads for development
```
"server": "json-server --watch db.json --port 3000"  或
node server.js
```