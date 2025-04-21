import typer
import secrets
from prisma import Prisma

app = typer.Typer()

@app.command()
def generate_token():
    """Gera e salva um token de API no banco de dados"""

    db = Prisma()
    db.connect()

    token = secrets.token_hex(16)
    db.generalsetting.create(data={"property": "APIKey", "value": token})

    db.disconnect()
    print(token)

@app.command()
def hello(name: str):
    print(f"Hello {name}")

if __name__ == "__main__":
    app()