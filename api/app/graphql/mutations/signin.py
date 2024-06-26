from ariadne import convert_kwargs_to_snake_case

from app.graphql import mutation
from app.serializers import UserSchema
from app.services.utils.auth import generate_token


@mutation.field("signin")
@convert_kwargs_to_snake_case
def create_user(_, info, email: str, password: str):
    user, token = generate_token(email=email, password=password).values()

    schema = UserSchema()
    return {"user": schema.dump(user), "token": token}
