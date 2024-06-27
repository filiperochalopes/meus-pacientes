from app.models import db, Pregnancy
from app.serializers import PregnancySchema
from ariadne import convert_kwargs_to_snake_case
from app.graphql import query
import requests


@query.field("pregnants")
@convert_kwargs_to_snake_case
def get_pregnants(*_):
    result = db.session.query(Pregnancy).all()
    schema = PregnancySchema(many=True)
    print(schema.dump(result))
    # r = requests.post(
    #         "https://calc.filipelopes.med.br/api/v1/marcos-gravidez",
    #         json={
    #             "dum": self.last_menstrual_period,
    #             "data_exame": self.ultrasonographies[0].date,
    #             "ig_exame": {
    #                 "semana": self.ultrasonographies[0].gestational_age_weeks,
    #                 "dia": self.ultrasonographies[0].gestational_age_days,
    #             },
    #         },
    #     )
    # print(r.json())
    return schema.dump(result)
