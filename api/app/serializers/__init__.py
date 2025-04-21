from pydantic import BaseModel
from typing import List, Optional

class TelecomInput(BaseModel):
    system: str
    value: str

class ContactInput(BaseModel):
    name: str
    relationship: str

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
