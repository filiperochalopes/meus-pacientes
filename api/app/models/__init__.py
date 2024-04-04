import enum
import bcrypt

from sqlalchemy import ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import Table, MetaData
from sqlalchemy.ext.hybrid import hybrid_property

from app.services.utils import calculate_age

metadata = MetaData()

class SexEnum(enum.Enum):
    male = 'Masculino'
    fema = 'Feminino'

class RiskEnum(enum.Enum):
    active = 'Busca Ativa'
    high = 'Alto Risco'
    low = 'Baixo Risco'
    vhigh = 'Muito Alto Risco'
    vlow = 'Muito Baixo Risco'
    no = 'Sem Risco'

class OriginEnum(enum.Enum):
    capes = 'Prescrições do CAPES'
    benzo = 'Benzodiazepínicos'
    freepass = 'Renovação Livre'

db = SQLAlchemy()

class BaseModel(db.Model):
    __abstract__ = True

class Role(BaseModel):
    __tablename__ = 'roles'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String)

class Institution(BaseModel):
    __tablename__ = 'institutions'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String)
    cnes = db.Column(db.String)

patient_user = Table('_patient_user', db.Model.metadata,
    db.Column('patient_id', db.Integer, db.ForeignKey('patients.id')),
    db.Column('user_id', db.Integer, db.ForeignKey('users.id'))
)

class User(BaseModel):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String, unique=True, nullable=True)
    password_hash = db.Column(db.String(128), nullable=False)
    name = db.Column(db.String, nullable=False)
    cpf = db.Column(db.String, unique=True, nullable=True)
    cns = db.Column(db.String, unique=True, nullable=True)
    birthdate = db.Column(db.Date, nullable=False)
    phone = db.Column(db.String, nullable=True)

    institution_roles = relationship('UserInstitutionRole')
    patients = relationship('Patient', secondary=patient_user, backref
    ='professionals')
    
    # timestamps
    created_at = db.Column(db.DateTime(timezone=True),
                           server_default=func.now())
    updated_at = db.Column(db.DateTime(timezone=True), onupdate=func.now())

    @property
    def password(self):
        raise AttributeError('Senha não é um atributo capaz de ser lido')

    @password.setter
    def password(self, password):
        self.password_hash = bcrypt.hashpw(password, bcrypt.gensalt()).decode()
    
    @staticmethod
    def generate_password(password:str):
        return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode()

    def verify_password(self, password):
        return bcrypt.checkpw(password, self.password_hash)

    def get_id(self):
        return self.id

    def is_authenticated(self):
        return not(self.is_annonymous())

    def is_annonymous(self):
        return not(self.is_authenticated())

class UserInstitutionRole(BaseModel):
    __tablename__ = '_user_institution_roles'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, ForeignKey('users.id'))
    institution_id = db.Column(db.Integer, ForeignKey('institutions.id'))
    role_id = db.Column(db.Integer, ForeignKey('roles.id'))

    institution = relationship('Institution')
    role = relationship('Role')

class Cid10(BaseModel):
    __tablename__ = 'cid10'

    code = db.Column(db.String, primary_key=True)
    description = db.Column(db.String)

patient_comorbidity = Table('_patient_comorbidity', db.Model.metadata,
    db.Column('patient_id', db.Integer, db.ForeignKey('patients.id')),
    db.Column('comorbidity_id', db.Integer, db.ForeignKey('comorbidities.id'))
)

class Patient(BaseModel):
    __tablename__ = 'patients'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)
    mother_name = db.Column(db.String, nullable=True)
    sex = db.Column(db.Enum(SexEnum), nullable=True)
    birthdate = db.Column(db.Date, nullable=True)
    cpf = db.Column(db.String, unique=True, nullable=True)
    cns = db.Column(db.String, unique=True, nullable=True)
    rg = db.Column(db.String, unique=True, nullable=True)
    weight_kg = db.Column(db.Float, nullable=True)
    phone = db.Column(db.String, nullable=True)
    comorbidities = relationship('Comorbidity', secondary=patient_comorbidity)

    # relationships
    institution_id = db.Column(db.Integer, ForeignKey('institutions.id'))

    # timestamps
    created_at = db.Column(db.DateTime(timezone=True),
                           server_default=func.now())
    updated_at = db.Column(db.DateTime(timezone=True), onupdate=func.now())

    @hybrid_property
    def age(self):
        return calculate_age(self.birthdate)

class Comorbidity(BaseModel):
    __tablename__ = 'comorbidities'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)
    abbreviation = db.Column(db.String, nullable=True)
    description = db.Column(db.String)

class ComorbiditiesList(BaseModel):
    __tablename__ = 'comorbidities_list'

    id = db.Column(db.Integer, primary_key=True)
    patient_id = db.Column(db.Integer, ForeignKey('patients.id'))
    risk = db.Column(db.Enum(RiskEnum), nullable=False)
    last_visit = db.Column(db.Date, nullable=True)
    observations = db.Column(db.String)

class PrescriptionList(BaseModel):
    __tablename__ = 'prescriptions_list'

    id = db.Column(db.Integer, primary_key=True)
    origin = db.Column(db.Enum(OriginEnum), nullable=False)
    dosage = db.Column(db.String)
    reason = db.Column(db.String)
    observations = db.Column(db.String)
    withdrawal_attempt = db.Column(db.String)
    usage_time = db.Column(db.String)
    last_renovation = db.Column(db.Date)
    patient_id = db.Column(db.Integer, ForeignKey('patients.id'))

class HomeCareList(BaseModel):
    __tablename__ = 'home_care_list'

    id = db.Column(db.Integer, primary_key=True)
    patient_id = db.Column(db.Integer, ForeignKey('patients.id'))
    last_visit = db.Column(db.Date, nullable=True)

