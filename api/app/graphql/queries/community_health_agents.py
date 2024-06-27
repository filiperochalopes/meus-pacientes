from app.models import db, User, UserInstitutionRole
from app.serializers import UserSchema
from ariadne import convert_kwargs_to_snake_case
from app.graphql import query


@query.field("communityHealthAgents")
@convert_kwargs_to_snake_case
def get_community_health_agents(*_):
    result = (
        db.session.query(User)
        .join(UserInstitutionRole, User.id == UserInstitutionRole.user_id)
        .filter(UserInstitutionRole.role.has(name="tacs"))
        .all()
    )
    print(result)
    schema = UserSchema(many=True)
    return schema.dump(result)
