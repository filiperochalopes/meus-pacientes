from ariadne import convert_kwargs_to_snake_case
from app.models import db, Patient, Pregnancy, Ultrasonography, RiskLevel
from app.graphql import mutation
from sqlalchemy import or_, and_
import datetime


# Criar ou atualiza uma gestação
@mutation.field("createOrUpdatePregnancy")
@convert_kwargs_to_snake_case
def create_or_update_pregnancy(_, info, item: dict):
    patient_dict = item.pop("patient")
    patient_dict["dob"] = datetime.date.fromisoformat(patient_dict["dob"])
    item["last_menstrual_period"] = datetime.date.fromisoformat(
        item["last_menstrual_period"]
    )
    # Criando mapeamento da interface em inglês graphql para o registro em portugês do banco de dados.
    risk_map = {
        "low": "baixo",
        "regular": "regular",
        "high": "alto",
        "critical": "critico",
    }
    item["risk_id"] = (
        db.session.query(RiskLevel).filter_by(name=risk_map[item["risk"]]).first().id
    )
    item.pop("risk", None)

    if "id" in item:
        id = item["id"]
        print(f"Gestação encontrada, id: {id}")
        # Atualiza os dados da gestação
        pregnancy = db.session.query(Pregnancy).get(id)
        db.session.query(Patient).filter_by(id=pregnancy.patient_id).update(
            patient_dict
        )
        if len(pregnancy.ultrasonographies) > 0:
            # Atualiza usg existente
            first_ultrasonography = sorted(
                [u for u in pregnancy.ultrasonographies], key=lambda x: x.date
            )[0]
            print(first_ultrasonography)
            if item.get("pregnancy_first_usg_date"):
                first_ultrasonography.date = datetime.date.fromisoformat(
                    item.get("pregnancy_first_usg_date")
                )
            if item.get("pregnancy_first_usg_day"):
                first_ultrasonography.gestational_age_days = item.get(
                    "pregnancy_first_usg_day"
                )
            if item.get("pregnancy_first_usg_week"):
                first_ultrasonography.gestational_age_weeks = item.get(
                    "pregnancy_first_usg_week"
                )
        elif item.get("pregnancy_first_usg_date") and item.get("pregnancy_first_usg_day") and item.get("pregnancy_first_usg_week"):
            # Cria ultrassonografia, caso ela tenha preenchido
            if item.get("pregnancy_first_usg_date"):
                ultrasonography = Ultrasonography(
                    gestational_age_weeks=item.get("pregnancy_first_usg_week"),
                    gestational_age_days=item.get("pregnancy_first_usg_day"),
                    date=datetime.date.fromisoformat(
                        item.get("pregnancy_first_usg_date")
                    ),
                    pregnancy_id=id,
                )
                db.session.add(ultrasonography)
        item.pop("pregnancy_first_usg_date", None)
        item.pop("pregnancy_first_usg_day", None)
        item.pop("pregnancy_first_usg_week", None)
        db.session.query(Pregnancy).filter_by(id=id).update(item)
        db.session.commit()
    else:
        print("Gestação não encontrada, criando uma...")
        # Verifica se os dados do paciente já existe no banco de dados algum outro com CNS, CPF ou ID semelhante
        patient = (
            db.session.query(Patient)
            .filter(
                or_(
                    and_(Patient.cns == patient_dict.get("cns"), patient_dict.get("cns") is not None),
                    and_(Patient.cpf == patient_dict.get("cpf"), patient_dict.get("cpf") is not None),
                    and_(Patient.name == patient_dict.get("name"), Patient.dob == patient_dict.get("dob")),
                    Patient.id == patient_dict.get("id"),
                )
            )
            .first()
        )
        if not patient:
            print("Paciente não encontrado, criando um novo...")
            # Cria paciente caso não exista
            # FIXME: Após implementação de login, capturar a instituição de quem está logado
            patient_dict["institution_id"] = 1
            patient = Patient(**patient_dict)
            db.session.add(patient)
            db.session.commit()

        item["patient_id"] = patient.id

        pregnancy_first_usg_week = item.pop("pregnancy_first_usg_week", None)
        pregnancy_first_usg_day = item.pop("pregnancy_first_usg_day", None)
        pregnancy_first_usg_date = item.pop("pregnancy_first_usg_date", None)
        pregnancy = Pregnancy(**item)
        db.session.add(pregnancy)
        db.session.flush()
        if pregnancy_first_usg_date:
            print("Cadastrando uma ultrassonografia...")
            ultrasonography = Ultrasonography(
                gestational_age_weeks=pregnancy_first_usg_week,
                gestational_age_days=pregnancy_first_usg_day,
                date=datetime.date.fromisoformat(pregnancy_first_usg_date),
                pregnancy_id=pregnancy.id,
            )
            db.session.add(ultrasonography)

        db.session.commit()

    return pregnancy


# Mutation to edit prescription item list
