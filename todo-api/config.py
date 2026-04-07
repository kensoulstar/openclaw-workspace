# 配置文件

class Config:
    # 应用配置
    SECRET_KEY = 'your-secret-key-here'  # 生产环境请更改
    DEBUG = True
    
    # 数据库配置
    DATA_FILE = 'todos.json'
    
    # API 配置
    API_PORT = 5000
    API_HOST = '0.0.0.0'
