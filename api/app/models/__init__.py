import enum
import bcrypt
import requests

from sqlalchemy import ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import Table, MetaData
from sqlalchemy.ext.hybrid import hybrid_property

from app.services.utils import calculate_age

metadata = MetaData()


class SexEnum(enum.Enum):
    male = "Masculino"
    fema = "Feminino"


db = SQLAlchemy()


class BaseModel(db.Model):
    __abstract__ = True


class Role(BaseModel):
    __tablename__ = "roles"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String)


class RiskLevel(BaseModel):
    __tablename__ = "risk_levels"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String)
    description = db.Column(db.String)


class Institution(BaseModel):
    __tablename__ = "institutions"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String)
    cnes = db.Column(db.String)


class User(BaseModel):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String, unique=True, nullable=True)
    password_hash = db.Column(db.String(128), nullable=False)
    name = db.Column(db.String, nullable=False)
    cpf = db.Column(db.String, unique=True, nullable=False)
    cns = db.Column(db.String, unique=True, nullable=True)
    dob = db.Column(db.Date, nullable=False)
    phone = db.Column(db.String, nullable=True)

    institution_roles = relationship(
        "UserInstitutionRole", back_populates="user", uselist=True
    )

    # timestamps
    created_at = db.Column(db.DateTime(timezone=True), server_default=func.now())
    updated_at = db.Column(db.DateTime(timezone=True), onupdate=func.now())

    @property
    def password(self):
        raise AttributeError("Senha não é um atributo capaz de ser lido")

    @password.setter
    def password(self, password):
        self.password_hash = bcrypt.hashpw(password, bcrypt.gensalt()).decode()

    @staticmethod
    def generate_password(password: str):
        return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode()

    def verify_password(self, password):
        return bcrypt.checkpw(password, self.password_hash)

    def get_id(self):
        return self.id

    def is_authenticated(self):
        return not (self.is_annonymous())

    def is_annonymous(self):
        return not (self.is_authenticated())


class UserInstitutionRole(BaseModel):
    __tablename__ = "_user_institution_roles"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, ForeignKey("users.id"))
    institution_id = db.Column(db.Integer, ForeignKey("institutions.id"))
    role_id = db.Column(db.Integer, ForeignKey("roles.id"))

    institution = relationship("Institution")
    role = relationship("Role")
    user = relationship("User", back_populates="institution_roles")


class Cid10(BaseModel):
    __tablename__ = "cid10"

    code = db.Column(db.String, primary_key=True)
    description = db.Column(db.String)


patient_comorbidity = Table(
    "_patient_comorbidity",
    db.Model.metadata,
    db.Column("patient_id", db.Integer, db.ForeignKey("patients.id")),
    db.Column("comorbidity_id", db.Integer, db.ForeignKey("comorbidities.id")),
)


class PregnancyLabTest(BaseModel):
    __tablename__ = "pregnancy_lab_tests"

    id = db.Column(db.Integer, primary_key=True)
    pregnancy_id = db.Column(db.Integer, ForeignKey("pregnancies.id"))
    lab_test_id = db.Column(db.Integer, ForeignKey("lab_tests.id"))
    pregnancy = relationship("Pregnancy")
    lab_test = relationship("LabTest")
    value = db.Column(db.String)


class Patient(BaseModel):
    __tablename__ = "patients"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)
    mother_name = db.Column(db.String, nullable=True)
    sex = db.Column(db.Enum(SexEnum), nullable=True)
    dob = db.Column(db.Date, nullable=True)
    cpf = db.Column(db.String, unique=True, nullable=True)
    cns = db.Column(db.String, unique=True, nullable=True)
    rg = db.Column(db.String, unique=True, nullable=True)
    weight_kg = db.Column(db.Float, nullable=True)
    phone = db.Column(db.String, nullable=True)
    lab_tests = relationship("PatientLabTest", back_populates="patient")
    comorbidities = relationship("Comorbidity", secondary=patient_comorbidity)

    # relationships
    institution_id = db.Column(db.Integer, ForeignKey("institutions.id"))

    # agente comunitário de saúde
    community_health_agent_id = db.Column(db.Integer, ForeignKey("users.id"))
    community_health_agent = relationship("User")

    # timestamps
    created_at = db.Column(db.DateTime(timezone=True), server_default=func.now())
    updated_at = db.Column(db.DateTime(timezone=True), onupdate=func.now())

    @hybrid_property
    def age(self):
        return calculate_age(self.dob)


class Comorbidity(BaseModel):
    __tablename__ = "comorbidities"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)
    abbreviation = db.Column(db.String, nullable=True)
    description = db.Column(db.String)


class PatientComorbidity(BaseModel):
    __tablename__ = "patient_comorbidities"

    id = db.Column(db.Integer, primary_key=True)
    patient_id = db.Column(db.Integer, ForeignKey("patients.id"))
    risk_id = db.Column(db.Integer, ForeignKey("risk_levels.id"))
    risk = relationship("RiskLevel")
    last_visit = db.Column(db.Date, nullable=True)
    observations = db.Column(db.String)


class ContinuousPrescription(BaseModel):
    __tablename__ = "continuous_prescriptions"

    id = db.Column(db.Integer, primary_key=True)

    dosage = db.Column(db.String)
    reason = db.Column(db.String)
    withdrawal_attempt = db.Column(db.String)
    usage_time = db.Column(db.String)
    last_renovation = db.Column(db.Date)
    last_prescription_date = db.Column(db.Date)
    patient_id = db.Column(db.Integer, ForeignKey("patients.id"))
    patient = relationship("Patient")
    observations = db.Column(db.String)


class HomeCare(BaseModel):
    __tablename__ = "home_care"

    id = db.Column(db.Integer, primary_key=True)
    patient_id = db.Column(db.Integer, ForeignKey("patients.id"))
    last_visit = db.Column(db.Date, nullable=True)


class Ultrasonography(BaseModel):
    __tablename__ = "ultrasonographies"

    id = db.Column(db.Integer, primary_key=True)
    date = db.Column(db.Date)
    gestational_age_weeks = db.Column(db.Integer)
    gestational_age_days = db.Column(db.Integer)
    pregnancy_id = db.Column(db.Integer, ForeignKey("pregnancies.id"))

    @hybrid_property
    def formated_gestational_age(self):
        return f"{self.gestational_age_weeks}s{self.gestational_age_days}d"


class Pregnancy(BaseModel):
    __tablename__ = "pregnancies"

    id = db.Column(db.Integer, primary_key=True)
    patient_id = db.Column(db.Integer, ForeignKey("patients.id"))
    patient = relationship("Patient")
    parity = db.Column(db.String)
    last_menstrual_period = db.Column(db.Date)
    ultrasonographies = relationship("Ultrasonography", uselist=True)
    lab_tests = relationship("PregnancyLabTest", back_populates="pregnancy")
    observations = db.Column(db.String)
    risk_id = db.Column(db.Integer, ForeignKey("risk_levels.id"))
    risk = relationship("RiskLevel", uselist=False)
    date_of_birth = db.Column(db.Date, nullable=True)


class LabTest(BaseModel):
    __tablename__ = "lab_tests"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String)
    abbreviation = db.Column(db.String)


class PatientLabTest(BaseModel):
    __tablename__ = "patient_lab_tests"

    id = db.Column(db.Integer, primary_key=True)
    patient_id = db.Column(db.Integer, ForeignKey("patients.id"))
    lab_test_id = db.Column(db.Integer, ForeignKey("lab_tests.id"))
    patient = relationship("Patient")
    lab_test = relationship("LabTest")
    value = db.Column(db.String)


class ActiveTarget(BaseModel):
    __tablename__ = "active_targets"

    id = db.Column(db.Integer, primary_key=True)
    patient_id = db.Column(db.Integer, ForeignKey("patients.id"))
    reason = db.Column(db.String)
    evolution = db.Column(db.String)
    resolution_date = db.Column(db.Date)


class LabTestArrival(BaseModel):
    __tablename__ = "lab_test_arrivals"

    id = db.Column(db.Integer, primary_key=True)
    patient_id = db.Column(db.Integer, ForeignKey("patients.id"))
    patient = relationship("Patient")
    arrival_date = db.Column(db.Date, nullable=False)
    lab_test_date = db.Column(db.Date, nullable=False)
    pick_date = db.Column(db.Date, nullable=True)
    created_at = db.Column(db.DateTime(timezone=True), server_default=func.now())
    updated_at = db.Column(db.DateTime(timezone=True), onupdate=func.now())
