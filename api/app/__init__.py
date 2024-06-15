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
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.db'
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
from app.models import Role, Comorbidity, RiskLevel, LabTest

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
        Comorbidity(name='epilepsia', abbreviation='EPL', description='Hipertensão Arterial Sistêmica (HAS)'),
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
    db.session.flush()

    # Cadastrando níveis de risco
    risk_levels = [
        RiskLevel(name='baixo', description='Risco Baixo'),
        RiskLevel(name='regular', description='Risco Habitual'),
        RiskLevel(name='alto', description='Risco Alto'),
        RiskLevel(name='critico', description='Risco Crítico'),
    ]
    db.session.bulk_save_objects(risk_levels)

    # Cadastrando nome de testes de laboratório
    lab_tests = [
        LabTest(name='Hemoglobina glicada', abbreviation='HbA1c'),
        LabTest(name='Creatinina', abbreviation='Cr'),
        LabTest(name='Colesterol Total', abbreviation='CT'),
        LabTest(name='Colesterol HDL', abbreviation='HDL'),
        LabTest(name='Triglicerídeos', abbreviation='TG'),
        LabTest(name='Tipo Sanguíneo ABO', abbreviation='ABO'),
        LabTest(name='Tipo Sanguíneo RH (D fraco)', abbreviation='RH'),
        LabTest(name='Coombs Indireto', abbreviation='CUIND'),
        LabTest(name='Eletroforese de Hemoglobina', abbreviation='ELHB'),
        LabTest(name='Anticorpos Rubéola (IgM)', abbreviation='Rubéola IgM'),
        LabTest(name='Anticorpos Rubéola (IgG)', abbreviation='Rubéola IgG'),
        LabTest(name='Anticorpos Citomegalovirus (IgM)', abbreviation='CMV IgM'),
        LabTest(name='Anticorpos Citomegalovirus (IgG)', abbreviation='CMV IgG'),
        LabTest(name='Anticorpos de Toxoplasmose (IgM)', abbreviation='Toxo IgM'),
        LabTest(name='Anticorpos de Toxoplasmose (IgG)', abbreviation='Toxo IgG'),
        LabTest(name='Anticorpos HIV Tipo I/II', abbreviation='Anti-HIV I/II'),
        LabTest(name='Anticorpos HTLV Tipo I/II', abbreviation='Anti-HTLV I/II'),
        LabTest(name='Teste Não treponêmico Sífilis (VDLR)', abbreviation='VDLR'),
        LabTest(name='Anticorpos HBs', abbreviation='Anti-Hbs'),
        LabTest(name='Anticorpos Antígeno HBs', abbreviation='HbsAg'),
        LabTest(name='Anticorpos Hepatite C', abbreviation='Anti-HCV'),
        LabTest(name='Hormônio Estimulador da Tireoide', abbreviation='TSH'),
        LabTest(name='Tiroxina Livre', abbreviation='T4L'),
        LabTest(name='Sumário de Urina', abbreviation='EAS'),
        LabTest(name='Urocultura', abbreviation='URC'),
        LabTest(name='Hemograma', abbreviation='HMG'),
        LabTest(name='Ferritina', abbreviation='Ferritina'),
        LabTest(name='25-Hidroxi-Vitamina D', abbreviation='25-OH-D'),
        LabTest(name='Vitamina B12', abbreviation='B12'),   
        LabTest(name='Glicemia de Jejum', abbreviation='Glic'),   
        LabTest(name='Teste oral tolerância a glicose (75g dextrose 0/60/120)', abbreviation='TOTG'),   
        LabTest(name='Beta HCG Quantitativo', abbreviation='bHCG'),   
        LabTest(name='Parasitológico de Fezes', abbreviation='EPF'),   
        LabTest(name='Citopatológico cervico-vaginal', abbreviation='Papanicolau'),   
        LabTest(name='SWAB Vaginal e Retal para cultura de Estreptococo Grupo B/GBS', abbreviation='Cult Strepto B'),   
    ]
    db.session.bulk_save_objects(lab_tests)
    
    # Enviando informações para o banco
    db.session.commit()
