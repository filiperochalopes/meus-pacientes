import typer
import secrets
from prisma import Prisma

app = typer.Typer()
db = Prisma()
db.connect()

@app.command()
def generate_token():
    token = secrets.token_hex(16)
    # Cria um novo registro em GeneralSetting com property "APIKey"
    new_token = db.generalsetting.create(data={"property": "APIKey", "value": token})
    print("Token generated and saved:", token)

if __name__ == "__main__":
    app()