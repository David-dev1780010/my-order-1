from pydantic_settings import BaseSettings
from dotenv import load_dotenv

load_dotenv()

class Settings(BaseSettings):
    # Базовые настройки приложения
    APP_NAME: str = "Telegram Mini App"
    DEBUG: bool = True
    
    # Настройки API
    API_V1_STR: str = "/api/v1"
    
    # Настройки базы данных (добавим позже)
    DATABASE_URL: str = "sqlite:///./app.db"
    
    # Настройки JWT
    SECRET_KEY: str = "your-secret-key"  # В продакшене заменить на безопасный ключ
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    class Config:
        case_sensitive = True

settings = Settings() 