from app.env import DatabaseSettings
from .graphql import query, type_defs, mutation
from flask_migrate import Migrate
from app.models import db
from app.models import Cid10
from flask_cors import CORS
from app.serializers import ma

import os

from ariadne import graphql_sync, make_executable_schema
from ariadne.explorer import ExplorerGraphiQL
from flask import Flask, jsonify, request

schema = make_executable_schema(
    [type_defs], [query, mutation])

app = Flask(__name__, static_folder='static')
app.config['SQLALCHEMY_DATABASE_URI'] = DatabaseSettings().URL
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.secret_key = os.getenv('SECRET_KEY')

db.init_app(app)
ma.init_app(app)
CORS(app)

migrate = Migrate(app, db)

# Retrieve HTML for the GraphiQL.
# If explorer implements logic dependant on current request,
# change the html(None) call to the html(request)
# and move this line to the graphql_explorer function.
explorer_html = ExplorerGraphiQL().html(None)


@app.route("/api/v1/graphql", methods=["GET"])
def graphql_explorer():
    # On GET request serve the GraphQL explorer.
    # You don't have to provide the explorer if you don't want to
    # but keep on mind this will not prohibit clients from
    # exploring your API using desktop GraphQL explorer app.
    return explorer_html, 200


@app.route("/api/v1/graphql", methods=["POST"])
def graphql_server():
    # GraphQL queries are always sent as POST
    data = request.get_json()

    # Note: Passing the request to the context is optional.
    # In Flask, the current request is always accessible as flask.request
    success, result = graphql_sync(
        schema,
        data,
        context_value={"request": request},
        debug=app.debug
    )

    status_code = 200 if success else 400
    return jsonify(result), status_code


if __name__ == "__main__":
    app.run(debug=True)


'''
Comandos flask cli
'''
from app.models import Role, Comorbidity

@app.cli.command("seed")
def seed():
    """Seed the database."""
    import csv

    # Cadastrando lista de Cid10
    with open(os.path.join(os.path.dirname(__file__), 'assets', 'CID-10-DATASUS.csv'), 'r', encoding='ISO-8859-1') as file:
        csvreader = csv.reader(file, dialect='excel', delimiter=';')
        next(file)
        for row in csvreader:
            cid10 = Cid10(code=row[0], description=row[4])
            db.session.add(cid10)

    # Adicionando comorbidades
    comorbidities = [
        Comorbidity(name='diabetes', abbreviation='DM', description='Diabetes Mellitus Tipo 1 ou 2 (DM)'),
        Comorbidity(name='hipertensão', abbreviation='HAS', description='Hipertensão Arterial Sistêmica (HAS)'),
    ]
    db.session.bulk_save_objects(comorbidities)

    # Adicionando roles
    roles = [
        Role(name='admin'),
        Role(name='medico'),
        Role(name='tacs'),
        Role(name='gerente'),
        Role(name='recepcao'),
        Role(name='dentista'),
        Role(name='aux dentista'),
        Role(name='farmacia'),
        Role(name='enfermeira'),
        Role(name='tec enfermagem'),
    ]
    db.session.bulk_save_objects(roles)

    # Enviando informações para o banco
    db.session.commit()
