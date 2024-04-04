import os

# Dados de autenticação
SECRET = os.getenv('SECRET_KEY')
MASTER_KEY = os.getenv('MASTER_KEY')
TOKEN_HOUR_EXPIRATION = os.getenv('TOKEN_HOUR_EXPIRATION', 6)

class DatabaseSettings:
    def __init__(self, env='production') -> None:
        if env == 'development':
            self.HOST = 'localhost'
            self.PORT = 5432
        elif env == 'production':
            self.HOST = os.getenv('POSTGRES_HOST', 'localhost')
            self.PORT = os.getenv('POSTGRES_PORT', 5432)

        self.NAME = os.getenv('POSTGRES_NAME', 'meuspacientes')
        self.USER = os.getenv('POSTGRES_USER', 'postgres')
        self.PASSWORD = os.getenv('POSTGRES_PASS', 'postgres')
        self.URL = f'postgresql+psycopg://{self.USER}:{self.PASSWORD}@{self.HOST}:{self.PORT}/{self.NAME}'