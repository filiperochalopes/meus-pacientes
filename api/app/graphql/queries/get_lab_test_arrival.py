from app.models import db, LabTestArrival, Patient
from app.serializers import LabTestArrivalSchema
from ariadne import convert_kwargs_to_snake_case
from app.graphql import query


@query.field("getLabTestArrival")
@convert_kwargs_to_snake_case
def get_lab_test_arrival(*_, cpf: str = None):
    if cpf:
        result = (
            db.session.query(LabTestArrival)
            .join(Patient, LabTestArrival.patient_id == Patient.id)
            .filter(Patient.cpf == cpf)
            .filter(LabTestArrival.pick_date == None)
            .all()
        )
    else:
        result = (
            db.session.query(LabTestArrival)
            .filter(LabTestArrival.pick_date == None)
            .all()
        )

    schema = LabTestArrivalSchema(many=True)
    return schema.dump(result)
