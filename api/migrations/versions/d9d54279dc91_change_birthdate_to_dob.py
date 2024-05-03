"""change birthdate to dob

Revision ID: d9d54279dc91
Revises: 9a536e29fad7
Create Date: 2024-05-02 23:49:00.132375

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'd9d54279dc91'
down_revision = '9a536e29fad7'
branch_labels = None
depends_on = None


def upgrade():
    op.alter_column('patients', 'birthdate', new_column_name='dob')
    op.alter_column('users', 'birthdate', new_column_name='dob')


def downgrade():
    op.alter_column('users', 'dob', new_column_name='birthdate')
    op.alter_column('patients', 'dob', new_column_name='birthdate')

