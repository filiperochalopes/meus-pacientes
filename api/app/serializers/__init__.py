import sys
from flask_marshmallow import Marshmallow
from app.models import (
    Patient,
    User,
    Cid10,
    ContinuousPrescription,
    UserInstitutionRole,
    Institution,
    Role,
    LabTestArrival,
    Pregnancy,
    Ultrasonography,
    LabTest,
    PregnancyLabTest,
    RiskLevel
)
from marshmallow import fields
from marshmallow_sqlalchemy import fields as sqa_fields

ma = Marshmallow()


def camelcase(s):
    parts = iter(s.split("_"))
    return next(parts) + "".join(i.title() for i in parts)


class CamelCaseSchema(ma.SQLAlchemyAutoSchema):
    """Schema that uses camel-case for its external representation
    and snake-case for its internal representation.
    """

    def on_bind_field(self, field_name, field_obj):
        field_obj.data_key = camelcase(field_obj.data_key or field_name)


class EnumToNameField(fields.Field):
    def _serialize(self, value, attr, obj, **kwargs):
        if value is None:
            return None
        return value.name


class EnumToValueField(fields.Field):
    def _serialize(self, value, attr, obj, **kwargs):
        if value is None:
            return None
        return value.value


class Cid10Schema(CamelCaseSchema):
    class Meta:
        model = Cid10


class InstitutionSchema(CamelCaseSchema):
    class Meta:
        model = Institution


class RoleSchema(CamelCaseSchema):
    class Meta:
        model = Role


class UserInstitutionRoleSchema(CamelCaseSchema):
    class Meta:
        model = UserInstitutionRole

    institution = sqa_fields.Nested(InstitutionSchema)
    role = sqa_fields.Nested(RoleSchema)


class UserSchema(CamelCaseSchema):
    class Meta:
        model = User

    dob = fields.Date(format="%d-%m-%Y")
    institution_roles = fields.List(sqa_fields.Nested(UserInstitutionRoleSchema))


class PatientSchema(CamelCaseSchema):
    class Meta:
        model = Patient
        include_relationships = True
        include_fk = True

    sex = EnumToNameField(attribute=("sex"))
    age = fields.Str(dump_only=True)
    professionals = fields.List(sqa_fields.Nested(UserSchema))
    community_health_agent = fields.Nested(UserSchema)


class UltrasonographySchema(CamelCaseSchema):
    class Meta:
        model = Ultrasonography
    
    formated_gestational_age = fields.Str(dump_only=True)


class LabTestSchema(CamelCaseSchema):
    class Meta:
        model = LabTest


class PregnancyLabTestSchema(CamelCaseSchema):
    class Meta:
        model = PregnancyLabTest

class RiskLevelSchema(CamelCaseSchema):
    class Meta:
        model = RiskLevel
class PregnancySchema(CamelCaseSchema):
    class Meta:
        model = Pregnancy
        include_relationships = True
        include_fk = True

    patient = sqa_fields.Nested(PatientSchema)
    ultrasonographies = fields.List(sqa_fields.Nested(UltrasonographySchema))
    lab_tests = fields.List(sqa_fields.Nested(PregnancyLabTestSchema))
    risk = sqa_fields.Nested(RiskLevelSchema)
    due_date = fields.Str(dump_only=True)
    gestational_age = fields.Str(dump_only=True)
    gestational_age_lmp = fields.Str(dump_only=True)
    gestational_age_first_usg = fields.Str(dump_only=True)


class ContinuousPrescriptionSchema(CamelCaseSchema):
    class Meta:
        model = ContinuousPrescription
        include_relationships = True
        include_fk = True

    origin = EnumToValueField(attribute=("origin"))
    patient = sqa_fields.Nested(PatientSchema)


class LabTestArrivalSchema(CamelCaseSchema):
    class Meta:
        model = LabTestArrival
        include_relationships = True
        include_fk = True

    patient = sqa_fields.Nested(PatientSchema)
