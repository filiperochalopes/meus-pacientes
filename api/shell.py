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
    from app.models import Institution, User, Role, UserInstitutionRole, db
    
    with app.app_context():
        institution_cnes = typer.prompt("CNES da instituição")
        # verify if institution with this cnes already exists
        institution_name = typer.prompt("Nome da instituição")
        
        user_cpf = typer.prompt("CPF do usuário")
        # verify if user with this cpf already exists
        existing_user = db.session.query(User).filter(User.cpf == user_cpf).first()
        user_name = typer.prompt("Nome do usuário")
        user_email = typer.prompt("Email do usuário")
        user_phone = typer.prompt("Telefone do usuário")
        user_dob = typer.prompt("Data de aniversário no formato `yyyy-mm-dd`")

        # create institution using Institution model    
        institution = Institution(name=institution_name, cnes=institution_cnes)
        db.session.add(institution)
        db.session.commit()

        # create user using User model
        user = User(name=user_name, email=user_email, cpf=user_cpf, phone=user_phone, dob=user_dob)
        user.password_hash = User.generate_password("passw@rd")
        db.session.add(user)
        db.session.commit()

        role = db.session.query(Role).filter(Role.name=="admin").first()
        institution_role = UserInstitutionRole(user_id=user.id, institution_id=institution.id, role_id=role.id)
        db.session.add(institution_role)
        db.session.commit()

        
    print("Instituição e usuário criados!")

@shell.command()
def create_tacs():
    from app.models import db, Institution, User, Role, UserInstitutionRole

    with app.app_context():
        user_name = typer.prompt("Nome do usuário (TACS)")
        print("Lista de instituições cadastradas: ")
        institutions = db.session.query(Institution).all()
        institution_input_list = {}
        for institution in institutions:
            institution_input_list[institution.id] = institution.name
            print(f"{institution.id} - {institution.name} ({institution.cnes})")
        institution_id = typer.prompt("Digite o número referente a instituição")

        # create user with tacs role
        role = db.session.query(Role).filter(Role.name=="tacs").first()
        user = User(name=user_name, dob="2000-01-01")
        user.password_hash = User.generate_password("passw@rd")
        db.session.add(user)
        db.session.commit()

        institution_role = UserInstitutionRole(user_id=user.id, institution_id=institution_id, role_id=role.id)
        db.session.add(institution_role)
        db.session.commit()

    print("Agente de Saúde adicionado!")


if __name__ == "__main__":
    shell()
