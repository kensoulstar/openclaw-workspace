import json
import os
from datetime import datetime
from config import Config

class TodoModel:
    """待办事项模型"""
    
    def __init__(self, data_file=None):
        self.data_file = data_file or Config.DATA_FILE
        self._ensure_file_exists()
        self._load_data()
    
    def _ensure_file_exists(self):
        """确保数据文件存在"""
        if not os.path.exists(self.data_file):
            self.save_all([])
    
    def _load_data(self):
        """从文件加载数据"""
        try:
            if os.path.exists(self.data_file):
                with open(self.data_file, 'r', encoding='utf-8') as f:
                    self.todos = json.load(f)
            else:
                self.todos = []
        except json.JSONDecodeError:
            self.todos = []
    
    def save_all(self, todos):
        """保存所有待办事项到文件"""
        self.todos = todos
        with open(self.data_file, 'w', encoding='utf-8') as f:
            json.dump(self.todos, f, indent=2, ensure_ascii=False)
    
    def generate_id(self):
        """生成唯一的 ID"""
        if not self.todos:
            return 1
        return max(todo['id'] for todo in self.todos) + 1
    
    def create(self, title, description='', completed=False):
        """创建新待办事项"""
        todo = {
            'id': self.generate_id(),
            'title': title,
            'description': description,
            'completed': completed,
            'created_at': datetime.now().isoformat(),
            'updated_at': datetime.now().isoformat()
        }
        self.todos.append(todo)
        self.save_all(self.todos)
        return todo
    
    def get_all(self):
        """获取所有待办事项"""
        return self.todos.copy()
    
    def get_one(self, todo_id):
        """根据 ID 获取待办事项"""
        for todo in self.todos:
            if todo['id'] == todo_id:
                return todo.copy()
        return None
    
    def update(self, todo_id, **kwargs):
        """更新待办事项"""
        for todo in self.todos:
            if todo['id'] == todo_id:
                if 'title' in kwargs:
                    todo['title'] = kwargs['title']
                if 'description' in kwargs:
                    todo['description'] = kwargs['description']
                if 'completed' in kwargs:
                    todo['completed'] = kwargs['completed']
                todo['updated_at'] = datetime.now().isoformat()
                self.save_all(self.todos)
                return todo.copy()
        return None
    
    def delete(self, todo_id):
        """删除待办事项"""
        initial_length = len(self.todos)
        self.todos = [todo for todo in self.todos if todo['id'] != todo_id]
        if len(self.todos) < initial_length:
            self.save_all(self.todos)
            return True
        return False
    
    def toggle_complete(self, todo_id):
        """切换待办事项完成状态"""
        return self.update(todo_id, completed=not self.get_one(todo_id)['completed'])
