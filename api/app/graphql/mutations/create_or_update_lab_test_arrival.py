from ariadne import convert_kwargs_to_snake_case
from app.models import db, PrescriptionList, Patient, LabTestArrival
from app.serializers import LabTestArrivalSchema
from app.graphql import mutation
from sqlalchemy import or_

# Mutation to create or update lab test arrival
@mutation.field('createOrUpdateLabTestArrival')
@convert_kwargs_to_snake_case
def create_or_update_lab_test_arrival(_, info, item: dict, id:int=None):
    if id:
        if 'patient' in item:
            del item['patient'] 
        db.session.query(LabTestArrival).filter_by(id=id).update(item)
        lab_test_arrival = db.session.query(LabTestArrival).get(id)
    else:
        # Verifica se o paciente já existe pelo cpf
        patient = Patient.query.filter(Patient.cpf == item['patient']['cpf']).first()
        # caso não exista, cria um novo paciente
        if not patient:
            item['patient']['institution_id'] = 1
            patient = Patient(**item['patient'])
            db.session.add(patient)
            db.session.commit()
        del item['patient']
        # Cria um registro de chegada de exame
        lab_test_arrival = LabTestArrival(**item, patient_id=patient.id)
        db.session.add(lab_test_arrival)

    db.session.commit()


    schema = LabTestArrivalSchema()
    return schema.dump(lab_test_arrival)

