import typer

import sqlalchemy as sa
from sqlalchemy import create_engine
from app.env import DatabaseSettings
from app import app

shell = typer.Typer()


@shell.command()
def alembicversion():
    engine = create_engine(DatabaseSettings().URL)
    with engine.begin() as conn:
        q = sa.text("SELECT version_num FROM alembic_version")
        resultset = conn.execute(q)
        results_as_dict = resultset.mappings().all()
    print(results_as_dict[0]['version_num'])


@shell.command()
def create_institution():
    institution_name = typer.prompt("Nome da instituição")
    institution_cnes = typer.prompt("CNES da instituição")
    # create institution using Institution model
    from app.models import Institution, db
    with app.app_context():
        institution = Institution(name=institution_name, cnes=institution_cnes)
        db.session.add(institution)
        db.session.commit()
    
    user_name = typer.prompt("Nome do usuário")
    user_email = typer.prompt("Email do usuário")
    user_cpf = typer.prompt("CPF do usuário")
    user_phone = typer.prompt("Telefone do usuário")
    user_birthdate = typer.prompt("Data de aniversário no formato `yyyy-mm-dd`")

    # create user using User model
    with app.app_context():
        from app.models import User
        user = User(name=user_name, email=user_email, cpf=user_cpf, phone=user_phone, birthdate=user_birthdate)
        db.session.add(user)
        db.session.commit()


if __name__ == "__main__":
    shell()
