from ariadne import gql, ObjectType

# Define type definitions (schema) using SDL
type_defs = gql(
    '''
    type Query {
       users: [User]
       cid10(query:String, perPage:Int, page:Int): [Cid10!]
       "Retorna dados de request, útil para teste de conexão com aplicação"
       hello: String
       "Retorna versão de migration do alembic, útil para teste de conexão com banco de dados"
       alembicVersion: AlembicVersion
       "Retorna dados do usuário logado"
       me: User
    }

    type Mutation {
        """
        Cria um usuário com a masterKey de superusuário, cadastrado internamente para fins de MVP, 
        o cadastro será feito via requisição em terminal ou via playground na rota /graphql
        """
        createUser(user: UserInput): User
        """
        Realizar login e receber o token
        """
        signin(email:String!, password:String!): UserToken
        """
        Mutation serve para atualizar dados que são passíveis de atualização do usuário mediante a senha `root` `masterKey`
        """
        updateUser(id: ID!, user: UserInput): User
        """
        Reset de senha direto na requisição para em caso de esquecimento ou perda de senha, a senha será resetada para "senha@123"
        """
        resetPassword(
            "Chave mestra do usuário `root` para poder realizar cadastro de usuários"
            masterKey:String!,
            cns: String!): User
    }

    input UserInput{
        "Nome do usuário/profissional cadastrado"
        name: String!, 
        "Email do usuário cadastrado, será utilizado para realização de login"
        email: String!, 
        "Telefone do usuário, apenas dígitos 75986523256"
        phone: String,
        "Senha de cadastro, poderá ser atualizada depois pelo usuário, default `senha@123" 
        password: String, 
        "Apenas dígitos, para fins de testes pode gerar [nesse link](https://geradornv.com.br/gerador-cpf/)"
        cpf:String, 
        "Apenas dígitos, para fins de testes, pode gerar [nesse link](https://geradornv.com.br/gerador-cns/)"
        cns:String, 
        "Data de aniversário no formato `yyyy-mm-dd`"
        birthdate: String, 
        "Categoria de profissional, um dedstes: `doc` para médicos, `nur` para enfermeira e `tec` para técnico de enfermagem"
        professionalCategory:String, 
        "UF do documento de conselho profissional"
        professionalDocumentUf:String, 
        "Número do documento de conselho profissional"
        professionalDocumentNumber:String
    }

    type AlembicVersion{
        version: String
    }

    type User {
        id: ID!
        email: String
        name: String
        birthdate: String
        professionalCategory: String
        professionalDocumentUf: String
        professionalDocumentNumber: String
    }

    type UserToken {
        user: User
        token: String
    }

    type Cid10 {
        "Cid 10, usando o formato padrao de CID, max:4 min:3 caracteres"
        code: String!
        "Descrição da doença, max:44 min:5 caracteres"
        description: String!
    }
''')

# Initialize query
query = ObjectType("Query")
# Initialize mutations
mutation = ObjectType("Mutation")

import app.graphql.resolvers