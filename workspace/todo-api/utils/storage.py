from models.todo import TodoModel
from config import Config


class StorageService:
    """数据存储服务类"""
    
    def __init__(self):
        self.model = TodoModel(Config.DATA_FILE)
    
    def get_all_todos(self):
        """获取所有待办事项"""
        return self.model.get_all()
    
    def get_todo(self, todo_id):
        """根据 ID 获取待办事项"""
        return self.model.get_one(todo_id)
    
    def create_todo(self, title, description='', completed=False):
        """创建新待办事项"""
        if not title:
            raise ValueError("Title is required")
        return self.model.create(title, description, completed)
    
    def update_todo(self, todo_id, **kwargs):
        """更新待办事项"""
        if 'title' in kwargs and not kwargs['title']:
            raise ValueError("Title is required")
        return self.model.update(todo_id, **kwargs)
    
    def delete_todo(self, todo_id):
        """删除待办事项"""
        return self.model.delete(todo_id)
    
    def toggle_todo(self, todo_id):
        """切换待办事项完成状态"""
        return self.model.toggle_complete(todo_id)
