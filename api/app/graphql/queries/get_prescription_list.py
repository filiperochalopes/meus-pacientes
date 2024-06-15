from app.models import db, ContinuousPrescription, Patient
from app.serializers import ContinuousPrescriptionSchema
from ariadne import convert_kwargs_to_snake_case
from app.graphql import query
import sys

@query.field('getPrescriptionList')
@convert_kwargs_to_snake_case
def get_prescription_list(*_):
    print("result", file=sys.stderr)
    result =  db.session.query(ContinuousPrescription).join(Patient, ContinuousPrescription.patient_id == Patient.id).filter(Patient.institution_id == 1).all()
    schema = ContinuousPrescriptionSchema(many=True)
    return schema.dump(result)