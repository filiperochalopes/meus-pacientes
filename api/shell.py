import typer

import sqlalchemy as sa
from sqlalchemy import create_engine
from app import app
import datetime
from app.services.utils import generate_cpf

shell = typer.Typer()


@shell.command()
def alembicversion():
    engine = create_engine("sqlite:///instance/database.db")
    with engine.begin() as conn:
        q = sa.text("SELECT version_num FROM alembic_version")
        resultset = conn.execute(q)
        results_as_dict = resultset.mappings().all()
    print(results_as_dict[0]["version_num"])


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
        user_dob = datetime.date.fromisoformat(
            typer.prompt("Data de aniversário no formato `yyyy-mm-dd`")
        )

        # create institution using Institution model
        institution = Institution(name=institution_name, cnes=institution_cnes)
        db.session.add(institution)
        db.session.commit()

        # create user using User model
        user = User(
            name=user_name,
            email=user_email,
            cpf=user_cpf,
            phone=user_phone,
            dob=user_dob,
        )
        user.password_hash = User.generate_password("passw@rd")
        db.session.add(user)
        db.session.commit()

        role = db.session.query(Role).filter(Role.name == "admin").first()
        institution_role = UserInstitutionRole(
            user_id=user.id, institution_id=institution.id, role_id=role.id
        )
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
        for institution in institutions:
            print(f"{institution.id} - {institution.name} ({institution.cnes})")
        institution_id = typer.prompt("Digite o número referente a instituição")

        # create user with tacs role
        role = db.session.query(Role).filter(Role.name == "tacs").first()
        user = User(name=user_name, dob="2000-01-01")
        user.password_hash = User.generate_password("passw@rd")
        db.session.add(user)
        db.session.commit()

        institution_role = UserInstitutionRole(
            user_id=user.id, institution_id=institution_id, role_id=role.id
        )
        db.session.add(institution_role)
        db.session.commit()

    print("Agente de Saúde adicionado!")


@shell.command()
def create_tacs_bulk():
    from app.models import User, Institution, UserInstitutionRole, Role, db

    with app.app_context():
        print("Lista de instituições cadastradas: ")
        institutions = db.session.query(Institution).all()
        for institution in institutions:
            print(f"{institution.id} - {institution.name} ({institution.cnes})")
        institution_id = typer.prompt("Digite o número referente a instituição")

        users = [
            User(
                name="José Nilton",
                cpf=generate_cpf(),
                dob=datetime.date.fromisoformat("1995-01-01"),
                password_hash=User.generate_password("senha@123"),
            ),
            User(
                name="Vilma",
                cpf=generate_cpf(),
                dob=datetime.date.fromisoformat("1995-01-01"),
                password_hash=User.generate_password("senha@123"),
            ),
            User(
                name="Edinamar",
                cpf=generate_cpf(),
                dob=datetime.date.fromisoformat("1995-01-01"),
                password_hash=User.generate_password("senha@123"),
            ),
            User(
                name="Elielton",
                cpf=generate_cpf(),
                dob=datetime.date.fromisoformat("1995-01-01"),
                password_hash=User.generate_password("senha@123"),
            ),
            User(
                name="Gérson",
                cpf=generate_cpf(),
                dob=datetime.date.fromisoformat("1995-01-01"),
                password_hash=User.generate_password("senha@123"),
            ),
            User(
                name="Antônio",
                cpf=generate_cpf(),
                dob=datetime.date.fromisoformat("1995-01-01"),
                password_hash=User.generate_password("senha@123"),
            ),
        ]
        db.session.bulk_save_objects(users)
        db.session.flush()

        for user in users:
            user = db.session.query(User).filter(User.cpf == user.cpf).first()
            user_institution_role = UserInstitutionRole(
                user_id=user.id,
                institution_id=institution_id,
                role_id=db.session.query(Role).filter(Role.name == "tacs").first().id,
            )
            db.session.add(user_institution_role)
        db.session.commit()

@shell.command()
def create_user():
    from app.models import db, User, Role, UserInstitutionRole, Institution

    with app.app_context():
        # Seleciona instituição
        institutions = db.session.query(Institution).all()
        for institution in institutions:
            print(f"{institution.id} - {institution.name} ({institution.cnes})")
        institution_id = typer.prompt(
            "Digite o número referente a instituição", type=int
        )

        # Seleciona e cria um papel
        print("Papeis disponíveis: ")
        roles = db.session.query(Role).all()
        for role in roles:
            print(f"{role.id} - {role.name}")
        role_id = typer.prompt("Digite o número referente ao papel")

        # Cria o usuário
        user_name = typer.prompt("Nome do usuário")
        user_email = typer.prompt("Email do usuário")
        user_phone = typer.prompt("Telefone do usuário")
        user_cpf = typer.prompt("CPF do usuário")
        user_dob = datetime.date.fromisoformat(typer.prompt("Data de nascimento do usuário"))
        user = User(
            name=user_name,
            email=user_email,
            cpf=user_cpf,
            phone=user_phone,
            dob=user_dob,
        )
        user.password_hash = User.generate_password("senha@123")
        db.session.add(user)
        db.session.flush()

        # Cria o papel do usuário
        user_institution_role = UserInstitutionRole(
            user_id=user.id,
            institution_id=institution_id,
            role_id=role_id,
        )
        db.session.add(user_institution_role)
        db.session.commit()
        print("Usário adicionado!")

if __name__ == "__main__":
    shell()
