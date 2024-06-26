from ariadne import convert_kwargs_to_snake_case

from app.graphql import mutation
from app.models import db, User
from app.env import MASTER_KEY
from app.services.utils.decorators import token_authorization
from app.serializers import UserSchema


@mutation.field("resetPassword")
@convert_kwargs_to_snake_case
@token_authorization
def reset_password(_, info, master_key: str, cns: str):
    if master_key == MASTER_KEY:
        user = db.session.query(User).filter(User.cns == cns).one()
        encrypted_password = User.generate_password(user["password"])
        user.password = encrypted_password
        db.session.commit()
    else:
        raise Exception("Chave mestra incorreta")

    schema = UserSchema()
    return schema.dump(user)
