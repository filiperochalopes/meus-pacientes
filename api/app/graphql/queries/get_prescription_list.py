from app.models import db, PrescriptionList, Patient
from app.serializers import PrescriptionListSchema
from ariadne import convert_kwargs_to_snake_case
from app.graphql import query
import sys

@query.field('getPrescriptionList')
@convert_kwargs_to_snake_case
def get_prescription_list(*_):
    print("result", file=sys.stderr)
    result =  db.session.query(PrescriptionList).join(Patient, PrescriptionList.patient_id == Patient.id).filter(Patient.institution_id == 1).all()
    schema = PrescriptionListSchema(many=True)
    return schema.dump(result)