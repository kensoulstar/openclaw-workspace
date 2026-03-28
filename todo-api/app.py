from flask import Flask, request, jsonify
from utils.storage import StorageService
from config import Config

# 创建 Flask 应用
app = Flask(__name__)
app.config.from_object(Config)

# 初始化存储服务
storage = StorageService()


@app.route('/')
def index():
    """API 首页"""
    return jsonify({
        'name': 'Todo API',
        'version': '1.0.0',
        'description': 'RESTful 待办事项管理 API',
        'endpoints': {
            'POST /todos': '创建新待办事项',
            'GET /todos': '获取所有待办事项',
            'GET /todos/<id>': '获取指定待办事项',
            'PUT /todos/<id>': '更新待办事项',
            'DELETE /todos/<id>': '删除待办事项',
            'PATCH /todos/<id>/toggle': '切换待办事项完成状态'
        }
    })


@app.route('/todos', methods=['POST'])
def create_todo():
    """创建新待办事项"""
    data = request.get_json()
    
    if not data or 'title' not in data:
        return jsonify({'error': 'Title is required'}), 400
    
    todo = storage.create_todo(
        title=data['title'],
        description=data.get('description', ''),
        completed=data.get('completed', False)
    )
    
    return jsonify({'message': 'Todo created successfully', 'data': todo}), 201


@app.route('/todos', methods=['GET'])
def get_todos():
    """获取所有待办事项"""
    todos = storage.get_all_todos()
    
    # 支持查询参数过滤
    completed = request.args.get('completed')
    if completed is not None:
        completed = completed.lower() == 'true'
        todos = [todo for todo in todos if todo['completed'] == completed]
    
    return jsonify({
        'count': len(todos),
        'data': todos
    }), 200


@app.route('/todos/<int:todo_id>', methods=['GET'])
def get_todo(todo_id):
    """根据 ID 获取待办事项"""
    todo = storage.get_todo(todo_id)
    
    if todo is None:
        return jsonify({'error': 'Todo not found'}), 404
    
    return jsonify({'data': todo}), 200


@app.route('/todos/<int:todo_id>', methods=['PUT'])
def update_todo(todo_id):
    """更新待办事项"""
    data = request.get_json()
    
    if not data:
        return jsonify({'error': 'Invalid request body'}), 400
    
    todo = storage.get_todo(todo_id)
    if todo is None:
        return jsonify({'error': 'Todo not found'}), 404
    
    # 允许更新标题、描述、完成状态
    if 'title' in data:
        if not data['title']:
            return jsonify({'error': 'Title is required'}), 400
    if 'description' in data:
        pass  # 允许为空
    if 'completed' in data:
        pass  # 允许 bool 值
    
    updated = storage.update_todo(
        todo_id,
        title=data.get('title', todo['title']),
        description=data.get('description', todo['description']),
        completed=data.get('completed', todo['completed'])
    )
    
    return jsonify({'message': 'Todo updated successfully', 'data': updated}), 200


@app.route('/todos/<int:todo_id>', methods=['DELETE'])
def delete_todo(todo_id):
    """删除待办事项"""
    if storage.delete_todo(todo_id):
        return jsonify({'message': 'Todo deleted successfully'}), 200
    
    return jsonify({'error': 'Todo not found'}), 404


@app.route('/todos/<int:todo_id>/toggle', methods=['PATCH'])
def toggle_todo(todo_id):
    """切换待办事项完成状态"""
    todo = storage.get_todo(todo_id)
    if todo is None:
        return jsonify({'error': 'Todo not found'}), 404
    
    updated = storage.toggle_todo(todo_id)
    
    return jsonify({'message': 'Todo toggled', 'data': updated}), 200


# 错误处理
@app.errorhandler(404)
def not_found(error):
    return jsonify({'error': 'Not found'}), 404


@app.errorhandler(500)
def internal_error(error):
    return jsonify({'error': 'Internal server error'}), 500


if __name__ == '__main__':
    app.run(
        host=Config.API_HOST,
        port=Config.API_PORT,
        debug=Config.DEBUG
    )
