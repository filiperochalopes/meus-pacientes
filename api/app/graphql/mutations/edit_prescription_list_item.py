from ariadne import convert_kwargs_to_snake_case
from app.models import db, ContinuousPrescription
from app.graphql import mutation

@mutation.field('editPrescriptionListItem')
@convert_kwargs_to_snake_case
def edit_prescription_list_item(_, info, id: int, item: dict):
    # Cria um item na lista de prescricoes de repetição
    db.session.query(ContinuousPrescription).filter_by(id=id).update(item)
    db.session.commit()

    return db.session.query(ContinuousPrescription).get(id)