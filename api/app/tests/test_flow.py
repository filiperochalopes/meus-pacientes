from gql import gql
from app.tests.conftest import get_query_from_txt


class TestFlow:
    # create_user_query = gql(get_query_from_txt('create_user'))
    hello_query = gql(get_query_from_txt("hello"))
    # signin_query = gql(get_query_from_txt('signin'))
    alembic_version_query = gql(get_query_from_txt("alembic_version"))

    def test_graphql_query(self, client):
        """Verifica se a API está funcional"""
        result = client.execute(self.hello_query)
        assert "Hello" in result["hello"]

    def test_migration(self, client):
        """Verifica se o banco de dados está com algum registro de migração"""
        result = client.execute(self.alembic_version_query)
        assert isinstance(result["alembicVersion"]["version"], str)

    # def test_create_user(self, client):
    #     try:
    #         # Reconectando banco de dados, após exclusão manual que geralmente é feita antes de rodar o script de teste. A primeira execução não funciona, queixa de um erro de desligamento do banco de dados pelo administrador
    #         result = client.execute(self.create_user_query)
    #     except Exception as e:
    #         result = client.execute(self.create_user_query)
    #     assert int(result['createUser']['id']) > 0

    # def test_signin(self, client):
    #     result = client.execute(self.signin_query)
    #     token = result['signin']['token']
    #     decoded_jwt = jwt.decode(token, SECRET, algorithms=["HS256"])
    #     assert isinstance(decoded_jwt, dict)
