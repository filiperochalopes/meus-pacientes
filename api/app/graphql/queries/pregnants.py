from app.models import db, Pregnancy
from app.serializers import PregnancySchema
from ariadne import convert_kwargs_to_snake_case
from app.graphql import query


@query.field("pregnants")
@convert_kwargs_to_snake_case
def get_pregnants(*_):
    result = db.session.query(Pregnancy).all()
    schema = PregnancySchema(many=True)
    return schema.dump(result)
