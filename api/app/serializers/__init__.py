import sys
from flask_marshmallow import Marshmallow
from app.models import Patient, User, Cid10, PrescriptionList
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


class UserSchema(CamelCaseSchema):
    birthdate = fields.Date(format='%Y-%m-%d')

    class Meta:
        model = User


class PatientSchema(CamelCaseSchema):
    class Meta:
        model = Patient
        include_fk = True

    sex = EnumToNameField(attribute=('sex'))
    age = fields.Str(dump_only=True)

class PrescriptionListSchema(CamelCaseSchema):
    class Meta:
        model = PrescriptionList
        include_relationships = True
        include_fk =True
        
    origin = EnumToValueField(attribute=('origin'))
    patient = sqa_fields.Nested(PatientSchema)

