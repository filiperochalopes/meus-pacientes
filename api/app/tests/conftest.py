from gql import Client, gql
from gql.transport.aiohttp import AIOHTTPTransport
from datetime import datetime, timezone, timedelta
from base64 import b64decode
from app.env import DatabaseSettings
from sqlalchemy import create_engine
from sqlalchemy.orm import Session
from app.models import BaseModel
from app.env import GRAPHQL_MUTATION_QUERY_URL, QUERIES_DIRECTORY
import pytest


@pytest.fixture
def client():
    # Select your transport with ag graphql url endpoint
    transport = AIOHTTPTransport(url=GRAPHQL_MUTATION_QUERY_URL)
    # Create a GraphQL client using the defined transport
    return Client(transport=transport, fetch_schema_from_transport=True)


# @pytest.fixture
# def auth_client(client):
#     '''Cria um cliente de requisições com usuário de teste padrão'''
#     signin_query = gql(get_query_from_txt('signin'))
#     result = client.execute(signin_query)
#     if 'errors' in result:
#         pytest.fail(f"Test setup failed: {result['errors']}")
#     token = result['signin']['token']
#     transport = AIOHTTPTransport(url=GRAPHQL_MUTATION_QUERY_URL, headers={'Authorization': f'Bearer {token}'})
#     # Create a GraphQL client using the defined transport
#     return Client(transport=transport, fetch_schema_from_transport=True)

def get_query_from_txt(filename: str):
    '''Retorna o texto de uma querie armazenada em txt'''
    with open(f'{QUERIES_DIRECTORY}/{filename}.txt', 'r') as file:
        request = file.read()
    return request


@pytest.fixture
def fixture_get_query_from_txt(request):
    query = get_query_from_txt(request.param)
    if not query:
        pytest.fail(f"Query {request.param} not found")