from ariadne import convert_kwargs_to_snake_case
from app.models import db, PrescriptionList, Patient
from app.graphql import mutation
from sqlalchemy import or_

# Mutation to create prescription item list
@mutation.field('createPrescriptionListItem')
@convert_kwargs_to_snake_case
def create_prescription_list_item(_, info, item: dict):
    # Cria um item na lista de prescricoes de repetição
    patient_dict = item.pop('patient')
    # Verifica se os dados do paciente já existe no banco de dados algum outro com CNS, CPF ou ID semelhante
    patient = db.session.query(Patient).filter(or_(
        Patient.cns == patient_dict.get('cns'), Patient.cpf == patient_dict.get('cpf'), Patient.id == patient_dict.get('id'))).first()
    if not patient:
        patient_dict['institution_id'] = 1
        patient = Patient(**patient_dict)
        db.session.add(patient)
        db.session.commit()
    item['patient_id'] = patient.id
    prescription_item = PrescriptionList(**item)
    db.session.add(prescription_item)
    db.session.commit()

    return prescription_item


# Mutation to edit prescription item list

