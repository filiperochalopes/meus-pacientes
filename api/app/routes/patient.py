from flask_openapi3 import Tag, APIBlueprint
from app.env import db
from app.services.utils.decorators import token_required
from app.serializers import PatientCreate

patient_tag = Tag(name="Patient", description="Operações relacionadas a pacientes")

patient_bp = APIBlueprint("Patient", __name__, url_prefix="/patients", abp_tags=[patient_tag])

@patient_bp.post("/", security=[{"api_key": []}])
@token_required
async def create_patient(body: PatientCreate):
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

    # Criação do paciente
    patient = await db.patient.create(data=data)
    patient_id = patient["id"]

    # Criação de meios de contato
    for contact in telecom:
        await db.contactpoint.create(data={**contact, "patientId": patient_id})

    # Criação de identificadores
    for idf in identifier:
        await db.identifier.create(data={**idf, "patientId": patient_id})

    return {"message": "Paciente criado com sucesso", "patient": patient}