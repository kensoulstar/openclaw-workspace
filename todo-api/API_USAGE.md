# API 使用说明

## 快速开始

```bash
# 1. 安装依赖
pip install -r requirements.txt

# 2. 启动 API
python app.py

# 3. 在浏览器访问或测试
curl http://localhost:5000/
```

## API 端点示例

### 1. 创建待办事项

```bash
curl -X POST http://localhost:5000/todos \
  -H "Content-Type: application/json" \
  -d '{"title": "Buy groceries", "description": "Milk, eggs, bread"}'
```

响应：
```json
{
  "data": {
    "id": 1,
    "title": "Buy groceries",
    "description": "Milk, eggs, bread",
    "completed": false,
    "created_at": "2026-03-14T14:00:00.000000",
    "updated_at": "2026-03-14T14:00:00.000000"
  },
  "message": "Todo created successfully"
}
```

### 2. 获取所有待办事项

```bash
# 获取全部
curl http://localhost:5000/todos

# 按完成状态过滤
curl "http://localhost:5000/todos?completed=true"
curl "http://localhost:5000/todos?completed=false"
```

响应：
```json
{
  "count": 2,
  "data": [
    {
      "id": 1,
      "title": "Buy groceries",
      "description": "Milk, eggs, bread",
      "completed": false,
      "created_at": "2026-03-14T14:00:00.000000",
      "updated_at": "2026-03-14T14:00:00.000000"
    }
  ]
}
```

### 3. 获取指定待办事项

```bash
curl http://localhost:5000/todos/1
```

### 4. 更新待办事项

```bash
curl -X PUT http://localhost:5000/todos/1 \
  -H "Content-Type: application/json" \
  -d '{"title": "Buy groceries", "completed": true}'
```

### 5. 切换完成状态

```bash
curl -X PATCH http://localhost:5000/todos/1/toggle
```

### 6. 删除待办事项

```bash
curl -X DELETE http://localhost:5000/todos/1
```

## 请求格式

- Content-Type: `application/json`
- Body: JSON 对象

## 响应格式

- Success: `200 OK` 或 `201 Created`
- Error: `400 Bad Request`, `404 Not Found`, `500 Internal Server Error`

## 错误处理

| 状态码 | 描述 |
|--------|------|
| 200 | 成功 |
| 201 | 创建成功 |
| 400 | 请求参数错误 |
| 404 | 资源不存在 |
| 500 | 服务器内部错误 |

## 使用 Postman 测试

1. 打开 Postman
2. 选择方法（GET, POST, PUT, DELETE, PATCH）
3. 输入 URL
4. 在 Body 选项卡中设置 JSON 数据
5. 点击 Send 发送请求

## 数据持久化

所有数据存储在 `todos.json` 文件中，API 重启后数据会保留。
