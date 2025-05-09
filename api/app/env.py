import os
from prisma import Prisma

db = Prisma()

SECRET = os.getenv("SECRET_KEY")
MASTER_KEY = os.getenv("MASTER_KEY")
TOKEN_HOUR_EXPIRATION = os.getenv("TOKEN_HOUR_EXPIRATION", 6)
