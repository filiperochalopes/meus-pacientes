from app.models import db, Pregnancy
from app.serializers import PregnancySchema
from ariadne import convert_kwargs_to_snake_case
from datetime import date
from app.graphql import query
import requests
from pprint import pprint as pp
import datetime

@query.field("pregnants")
@convert_kwargs_to_snake_case
def get_pregnants(*_):
    result = db.session.query(Pregnancy).filter(Pregnancy.date_of_birth == None).all()
    first_usg_data = {}
    for p in result:
        if len(p.ultrasonographies) > 0:
            first_usg = p.ultrasonographies[0]
            first_usg_data = {
                "data_exame": first_usg.date.strftime("%Y-%m-%d"),
                "ig_exame": {
                    "semana": first_usg.gestational_age_weeks,
                    "dia": first_usg.gestational_age_days,
                },
            }
        r = requests.post(
            "https://calc.filipelopes.med.br/api/v1/marcos-gravidez",
            json={
                "dum": date.strftime(p.last_menstrual_period, "%Y-%m-%d"),
                **first_usg_data,
                "data_ultima_consulta": datetime.date.today().strftime("%Y-%m-%d"),
            },
        )
        # pp(r.json())
        p.gestational_age = r.json()["resultado"]["idade_gestacional_abrev"]
        p.gestational_age_lmp = r.json()["resultado"]["idade_gestacional_dum"]
        p.gestational_age_first_usg = r.json()["resultado"][
            "idade_gestacional_exame"
        ]
        p.due_date = r.json()["resultado"][
            "dpp_40_semanas"
        ]

    schema = PregnancySchema(many=True)
    return schema.dump(result)


@query.field("pregnancy")
@convert_kwargs_to_snake_case
def get_pregnancy_by_id(*_, id:int):
    p = db.session.query(Pregnancy).get(id)
    schema = PregnancySchema()
    return schema.dump(p)