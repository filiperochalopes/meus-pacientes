from functools import wraps

from app.services.utils.auth import check_token
from flask import request, jsonify
from functools import wraps
from app.env import db


def token_authorization(func):
    """Verifica se o usuário está autenticado para usar a rota"""

    @wraps(func)
    def wrapper(*args, **kwargs):
        if "Authorization" in args[1].context["request"].headers:
            authorization_header = (
                args[1].context["request"].headers["Authorization"].split()
            )
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


async def connect_db():
    global connected
    if not connected:
        await db.connect()
        connected = True


def token_required(func):
    @wraps(func)
    async def wrapper(*args, **kwargs):
        await connect_db()
        api_key = request.headers.get("api_key")
        if not api_key:
            return jsonify({"error": "Unauthorized, api_key header missing"}), 401

        token_setting = await db.generalsetting.find_first(
            where={"property": "APIKey", "value": api_key}
        )
        if not token_setting:
            return jsonify({"error": "Unauthorized, invalid api_key"}), 401

        return await func(*args, **kwargs)

    return wrapper
