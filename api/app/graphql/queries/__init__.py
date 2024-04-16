import sqlalchemy as sa
from sqlalchemy import create_engine
from app.env import DatabaseSettings

from app.graphql import query
import app.graphql.queries.cid10
import app.graphql.queries.me
import app.graphql.queries.get_prescription_list


@query.field("hello")
def resolve_hello(_, info):
    request = info.context["request"]
    user_agent = request.headers.get("User-Agent", "Guest")
    return "Hello, %s!" % user_agent

@query.field("alembicVersion")
def get_alembic_version(*_):
    engine = create_engine(DatabaseSettings().URL)
    with engine.begin() as conn:
        q = sa.text("SELECT version_num FROM alembic_version")
        resultset = conn.execute(q)
        results_as_dict = resultset.mappings().all()
    return {
        "version": results_as_dict[0]['version_num']
    }