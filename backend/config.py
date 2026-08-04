import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv(os.path.join(os.path.dirname(os.path.dirname(__file__)), 'backend', '.env'))

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY', 'foodie-secret-key-1234')
    
    # Database configuration
    DB_USER = os.environ.get('DB_USER', 'root')
    DB_PASSWORD = os.environ.get('DB_PASSWORD', '')
    DB_HOST = os.environ.get('DB_HOST', 'localhost')
    DB_PORT = os.environ.get('DB_PORT', '3306')
    DB_NAME = os.environ.get('DB_NAME', 'foodieai')
    
    import urllib.parse
    DB_PASSWORD_ESC = urllib.parse.quote_plus(DB_PASSWORD)
    SQLALCHEMY_DATABASE_URI = f"mysql+pymysql://{DB_USER}:{DB_PASSWORD_ESC}@{DB_HOST}:{DB_PORT}/{DB_NAME}"
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    # JWT configuration
    JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY', 'jwt-super-secret-key-5678')
    
    # OpenRouter API Configuration
    OPENROUTER_API_KEY = os.environ.get('OPENROUTER_API_KEY', '')
    OPENROUTER_MODEL = os.environ.get('OPENROUTER_MODEL', 'meta-llama/llama-3-8b-instruct:free')
    
    # Upload configurations
    UPLOAD_FOLDER = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'knowledge_base')
    MAX_CONTENT_LENGTH = 16 * 1024 * 1024  # 16 MB limit
