import os

# Dados de autenticação
SECRET = os.getenv("SECRET_KEY")
MASTER_KEY = os.getenv("MASTER_KEY")
TOKEN_HOUR_EXPIRATION = os.getenv("TOKEN_HOUR_EXPIRATION", 6)

GRAPHQL_MUTATION_QUERY_URL = os.getenv(
    "GRAPHQL_MUTATION_QUERY_URL", "http://localhost:5000/api/v1/graphql"
)

QUERIES_DIRECTORY = os.path.join(os.path.dirname(__file__), "tests/queries")
