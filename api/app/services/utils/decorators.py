from functools import wraps

from flask import request, jsonify, g
from functools import wraps

def token_required(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        api_key = request.headers.get("Api-Key")
        if not api_key:
            return jsonify({"error": "Unauthorized, Api-Key header missing"}), 401

        token_setting = g.db.generalsetting.find_first(
            where={"property": "APIKey", "value": api_key}
        )
        if not token_setting:
            return jsonify({"error": "Unauthorized, invalid Api-Key"}), 401

        return func(*args, **kwargs)
    return wrapper
