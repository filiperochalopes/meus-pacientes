from flask_openapi3 import Tag, APIBlueprint
from app.env import db
from app.services.utils.decorators import token_required
from app.serializers import AppointmentCreate

appointment_tag = Tag(name="Appointment", description="Agendamentos de pacientes")

appointment_bp = APIBlueprint("Appointment", __name__, url_prefix="/appointments", abp_tags=[appointment_tag])

@appointment_bp.post("/", security=[{"api_key": []}])
@token_required
async def create_appointment(body: AppointmentCreate) -> dict:
    """
    Cria um novo agendamento de paciente.

    Essa rota é acessada com o verbo POST e exige um token de acesso.
    O corpo da requisi o deve conter um objeto ``AppointmentCreate`` com as informa es do agendamento.

    Retorna um dicion rio com uma mensagem de sucesso e o objeto ``Appointment`` criado.
    """
    data = body.dict()

    appointment = await db.appointment.create(data=data)

    return {"message": "Agendamento criado com sucesso", "appointment": appointment}