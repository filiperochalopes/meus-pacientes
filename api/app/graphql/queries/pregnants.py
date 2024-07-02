from app.models import db, Pregnancy
from app.serializers import PregnancySchema
from ariadne import convert_kwargs_to_snake_case
from datetime import date
from app.graphql import query
import requests
from pprint import pprint as pp


@query.field("pregnants")
@convert_kwargs_to_snake_case
def get_pregnants(*_):
    result = db.session.query(Pregnancy).all()

    for p in result:
        r = requests.post(
            "https://calc.filipelopes.med.br/api/v1/marcos-gravidez",
            json={
                "dum": date.strftime(p.last_menstrual_period, "%Y-%m-%d")
            },
        )
        pp(r.json())
        p.gestational_age_lmp = r.json()["resultado"]["idade_gestacional"]
        # p.gestational_age_first_usg = r.json()["resultado"][
        #     "idade_gestacional_primeiro_usg"
        # ]

    schema = PregnancySchema(many=True)
    return schema.dump(result)
