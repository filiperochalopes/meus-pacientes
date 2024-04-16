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
       "Retorna lista de prescricoes de repetição"
       getPrescriptionList: [PrescriptionListItem]
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
        """
        Cria um item na lista de prescricoes de repetição
        """
        createPrescriptionListItem(
            item: PrescriptionListItemInput!
        ): PrescriptionListItem
        """
        Edita um item na lista de prescrições de repetição
        """
        editPrescriptionListItem(
            id: Int!,
            item: PrescriptionListItemInput!
        ): PrescriptionListItem
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

    input PrescriptionListItemInput{
        "Origem da prescricao, pode ser vindo do CAPES, de uso prolongado de BENZO ou medicações que tem livre passagem por ser de uso controlado e prolongado em doença crônica"
        origin:OriginEnum,
        "Dose da prescricao"
        dosage:String,
        "Motivo da prescricao"
        reason:String,
        "Observação da prescricao"
        observations:String,
        "Tentativa de retirada da prescricao"
        withdrawalAttempt:String,
        "Tempo de uso da prescricao"
        usageTime:String,
        "Data da ultima renovação da prescricao"
        lastRenovation:String
        "Paciente, ao colocar o ID, CPF ou CNS já vincula ao usuário existente, preencher dados diferentes dos já existente para poder criar novo paciente"
        patient: PatientInput
        "Id da insituição onde a lista pertence, geralmente é a mesma instituição em que está o paciente"
        institutionId: Int
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

    type PrescriptionListItem {
        id: ID!
        origin: String
        dosage: String
        reason: String
        observations: String
        withdrawalAttempt: String
        usageTime: String
        lastRenovation: String
        patient: Patient
        istitution: Institution
    }

    enum OriginEnum {
        capes
        benzo
        freepass   
    }

    enum SexEnum {
        male
        fema
    }

    type Patient {
        id: ID!
        name: String
        motherName: String
        sex: String
        birthdate: String
        age: String
        cpf: String
        cns: String
        weightKg: Float
        phone: String
    }

    type Institution {
        id: ID!
        name: String
        cnes: String
    }

    input PatientInput {
        id: ID
        name: String
        motherName: String
        sex: SexEnum
        birthdate: String
        cpf: String
        cns: String
        weightKg: Float
        phone: String
    }
''')

# Initialize query
query = ObjectType("Query")
# Initialize mutations
mutation = ObjectType("Mutation")

import app.graphql.resolvers