# Todo API - RESTful 待办事项管理

一个基于 Flask 的轻量级待办事项 API，支持完整的 CRUD 操作。

## 特性

- ✅ RESTful 设计
- ✅ 完整的 CRUD 操作（Create, Read, Update, Delete）
- ✅ JSON 数据格式
- ✅ 错误处理和状态码
- ✅ 简单的数据持久化（JSON 文件）
- ✅ 无依赖安装要求

## 项目结构

```
todo-api/
├── app.py              # 主应用入口
├── models/
│   └── todo.py         # Todo 模型
├── utils/
│   └── storage.py      # 数据存储服务
├── config.py           # 配置文件
├── requirements.txt    # Python 依赖
├── todos.json          # 数据文件
└── README.md           # 本文档
```

## API 端点

| 方法 | 端点 | 描述 |
|------|------|------|
| POST | /todos | 创建新待办事项 |
| GET | /todos | 获取所有待办事项 |
| GET | /todos/<id> | 获取指定待办事项 |
| PUT | /todos/<id> | 更新待办事项 |
| DELETE | /todos/<id> | 删除待办事项 |

## 安装

```bash
pip install -r requirements.txt
```

## 运行

```bash
python app.py
```

访问 `http://localhost:5000` 查看 API。
