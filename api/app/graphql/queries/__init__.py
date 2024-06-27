import sqlalchemy as sa
from sqlalchemy import create_engine

from app.graphql import query
import app.graphql.queries.cid10
import app.graphql.queries.me
import app.graphql.queries.get_prescription_list
import app.graphql.queries.get_lab_test_arrival
import app.graphql.queries.pregnants
import app.graphql.queries.community_health_agents


@query.field("hello")
def resolve_hello(_, info):
    request = info.context["request"]
    user_agent = request.headers.get("User-Agent", "Guest")
    return "Hello, %s!" % user_agent


@query.field("alembicVersion")
def get_alembic_version(*_):
    engine = create_engine("sqlite:///database.db", echo=True)
    with engine.begin() as conn:
        q = sa.text("SELECT version_num FROM alembic_version")
        resultset = conn.execute(q)
        results_as_dict = resultset.mappings().all()
    return {"version": results_as_dict[0]["version_num"]}
