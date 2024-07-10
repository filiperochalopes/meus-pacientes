from functools import wraps

from app.services.utils.auth import check_token


def token_authorization(func):
    """Verifica se o usuário está autenticado para usar a rota"""

    @wraps(func)
    def wrapper(*args, **kwargs):
        if "Authorization" in args[1].context["request"].headers:
            authorization_header = args[1].context["request"].headers["Authorization"].split()
            if len(authorization_header) > 1:
                token = authorization_header[1]
            else:
                raise Exception("Necessita realizar login")
            if not token:
                raise Exception("Token ausente ou inválido")
            user, token = check_token(token).values()

            if not user:
                raise Exception("Token inválido")
        else:
            raise Exception(
                "Token ausente. Adicione o Header Authorization: Bearer Token"
            )

        return func(*args, **kwargs, current_user=user)

    return wrapper
