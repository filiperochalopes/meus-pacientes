from flask import g
from flask_openapi3 import Tag, APIBlueprint
from app.services.utils.decorators import token_required
from app.serializers import PatientCreate

patient_tag = Tag(name="Patient", description="Operações relacionadas a pacientes")

patient_bp = APIBlueprint("Patient", __name__, url_prefix="/patient", abp_tags=[patient_tag])

@patient_bp.post("/", security=[{"api_key": []}])
@token_required
def create_patient(body: PatientCreate):
    """
    Creates a new patient record along with associated contact points and identifiers.

    This function is an asynchronous endpoint that requires an API key for access.
    It takes a `PatientCreate` object as the request body, extracts the patient data,
    telecom contacts, and identifiers, and stores them in the database. The function
    returns a success message along with the created patient information.

    Args:
        body (PatientCreate): The patient data to be created, including optional telecom
                              contacts and identifiers.

    Returns:
        dict: A dictionary containing a success message and the created patient data.
    """

    data = body.dict()
    telecom = data.pop("telecom", [])
    identifier = data.pop("identifier", [])
    contacts = data.pop("contact", [])

    patient = g.db.patient.create(data=data)
    patient_id = patient.id

    for t in telecom:
        g.db.contactpoint.create(data={**t, "patientId": patient_id})

    for i in identifier:
        g.db.identifier.create(data={**i, "patientId": patient_id})

    for c in contacts:
        g.db.contact.create(data={**c, "patientId": patient_id})

    return {"message": "Paciente criado com sucesso", "patient": patient.dict()}