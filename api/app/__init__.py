from flask_openapi3 import OpenAPI, Info
from flask import request, jsonify
from pydantic import BaseModel
from typing import List, Optional
from prisma import Prisma
from functools import wraps

# ------------------ Configurações de Segurança ------------------

api_key_scheme = {
    "type": "apiKey",
    "name": "api_key",
    "in": "header"
}
security_schemes = {"api_key": api_key_scheme}

info = Info(title="Patient and Appointment API", version="1.0.0")
app = OpenAPI(__name__, info=info, security_schemes=security_schemes)

# ------------------ Prisma Async ------------------

db = Prisma()
connected = False

async def connect_db():
    global connected
    if not connected:
        await db.connect()
        connected = True

# ------------------ Middleware de Autenticação ------------------

def token_required(func):
    @wraps(func)
    async def wrapper(*args, **kwargs):
        await connect_db()  # Conecta no primeiro acesso
        api_key = request.headers.get("api_key")
        if not api_key:
            return jsonify({"error": "Unauthorized, api_key header missing"}), 401
        
        token_setting = await db.generalsetting.find_first(
            where={"property": "APIKey", "value": api_key}
        )
        if not token_setting:
            return jsonify({"error": "Unauthorized, invalid api_key"}), 401
        
        return await func(*args, **kwargs)
    return wrapper

# ------------------ Modelos Pydantic ------------------

class TelecomInput(BaseModel):
    system: str
    value: str

class IdentifierInput(BaseModel):
    system: str
    value: str

class PatientCreate(BaseModel):
    name: str
    gender: str
    birthDate: str
    telecom: Optional[List[TelecomInput]] = []
    identifier: Optional[List[IdentifierInput]] = []

class AppointmentCreate(BaseModel):
    patientId: int
    start: str
    end: str
    status: str
    appointmentType: str

# ------------------ Endpoints ------------------

@app.get("/")
async def hello():
    return {"message": "Hello, World!"}

@app.get("/patients", security=[{"api_key": []}])
@token_required
async def get_patients():
    patients = await db.patient.find_many(
        include={
            "telecom": True,
            "identifier": True,
            "appointments": True
        }
    )
    return {"patients": patients}

@app.post("/patients", security=[{"api_key": []}])
@token_required
async def create_patient(body: PatientCreate):
    data = body.dict()
    telecom = data.pop("telecom", [])
    identifier = data.pop("identifier", [])
    
    patient = await db.patient.create(data=data)
    
    for cp in telecom:
        await db.contactpoint.create(data={**cp, "patientId": patient["id"]})
    
    for idf in identifier:
        await db.identifier.create(data={**idf, "patientId": patient["id"]})
    
    return {"patient": patient}

@app.get("/appointments", security=[{"api_key": []}])
@token_required
async def get_appointments():
    appointments = await db.appointment.find_many(include={"patient": True})
    return {"appointments": appointments}

@app.post("/appointments", security=[{"api_key": []}])
@token_required
async def create_appointment(body: AppointmentCreate):
    data = body.dict()
    appointment = await db.appointment.create(data=data)
    return {"appointment": appointment}