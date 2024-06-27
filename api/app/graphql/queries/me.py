from app.graphql import query
from app.serializers import UserSchema
from app.services.utils.decorators import token_authorization


@query.field("me")
@token_authorization
def me(*_, current_user: dict):
    schema = UserSchema()
    return schema.dump(current_user)
