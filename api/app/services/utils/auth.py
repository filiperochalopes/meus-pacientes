import jwt
import bcrypt
import datetime

from app.models import User, db
from app.env import SECRET, TOKEN_HOUR_EXPIRATION

from validate_docbr import CPF, CNS

cpf_validator = CPF()
cns_validator = CNS()


def generate_token(email: str, password: str) -> dict:
    """
    Gera o token de autenticação dado o email e senha do usuário
    """
    try:
        # Verifica se existe o email
        user = db.session.query(User).filter(User.email == email).one()
    except Exception as e:
        raise Exception(f"{e} Não existe usuário com esse email")

    # Cria um usuário em model
    if bcrypt.checkpw(password.encode("utf-8"), user.password_hash.encode("utf-8")):
        # TODO Cria um novo passo em que a pessoa pode selecionar a instituição que ela está no caso de ter uma pessoa em várias intituições
        print(SECRET)
        encoded_jwt = jwt.encode(
            {
                "sub": user.id,
                "exp": datetime.datetime.now(tz=datetime.timezone.utc)
                + datetime.timedelta(hours=TOKEN_HOUR_EXPIRATION),
            },
            SECRET,
            algorithm="HS256",
        )
    else:
        raise Exception("Senha inválida")

    print(encoded_jwt)
    return {"user": user, "token": encoded_jwt}


def check_token(token) -> dict:
    """
    Verifica a validade do token e retorna o usuário que o está utilizando no momento
    """

    decoded_jwt = jwt.decode(token, SECRET, algorithms=["HS256"])
    user = db.session.query(User).get(decoded_jwt["sub"])

    return {"user": user, "token": token}
