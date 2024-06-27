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
       "Retorna lista de chegada de exames"
       getLabTestArrival(cpf: String): [LabTestArrival]
       "Retorna as pacientes grávidas"
       pregnants: [Pregnancy]
       "Retorna os Agentes de Saúde"
       communityHealthAgents: [User]
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
        """
        Cria ou atualiza uma chegada de exame
        """
        createOrUpdateLabTestArrival(
            id: Int,
            item: LabTestArrivalInput
        ): LabTestArrival
        """
        Cria ou atualiza uma gravidez
        """    
        createOrUpdatePregnancy(
            id: Int,
            item: PregnancyInput
        ): Pregnancy
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
        dob: String, 
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

    input LabTestArrivalInput{
        "Data da chegada do exame no formato `yyyy-mm-dd`"
        arrivalDate: String
        "Paciente, ao colocar o ID, CPF ou CNS será vinculado ao usuário existente, preencher dados diferentes dos já existente para poder criar novo paciente"
        patient: PatientInput
        "Data da realização do exame no formato `yyyy-mm-dd`"
        labTestDate: String
        "Data da retirada do exame pelo paciente no formato `yyyy-mm-dd`"
        pickDate: String
    }

    input PregnancyInput{
        id: Int
        "Paciente, ao colocar o ID, CPF ou CNS será vinculado ao usuário existente, preencher dados diferentes dos também existente para poder criar novo paciente"
        patient: PatientInput
        "Data da última menstruação no formato `yyyy-mm-dd`"
        lastMenstrualPeriod: String
        "Paridade no formato G9P9A0"
        parity: String
        "Data da primeira ultrassonografia"
        pregnancyFirstUsgDate: String
        "Dia na idade gestacional da primeira ultrassonografia"
        pregnancyFirstUsgDay: Int
        "Semana na idade gestacional da primeira ultrassonografia"
        pregnancyFirstUsgWeek: Int
        "Observações"
        observations: String
        "Risco da gestação"
        risk: RiskEnum
    }

    input PatientInput {
        id: ID
        "Nome do paciente"
        name: String
        "Nome da mãe"
        motherName: String
        "Sexo do paciente, pode ser `MASCULINO` ou `FEMININO`"
        sex: SexEnum
        "Data de aniversário no formato `yyyy-mm-dd`"
        dob: String
        "CPF do paciente, apenas dígitos 75986523256"
        cpf: String
        "CNS do paciente, apenas dígitos 75986523256"
        cns: String
        "Peso do paciente"
        weightKg: Float
        "Telefone do paciente"
        phone: String
        "Id do agende de saúde"
        communityHealthAgentId: Int
    }

    type AlembicVersion{
        version: String
    }

    type User {
        id: ID!
        email: String
        name: String
        dob: String
        "Função exercida pelo usuário/profissional"
        institutionRoles: [UserInstitutionRole]
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

    type LabTestArrival{
        id: ID!
        arrivalDate: String
        patient: Patient
        labTestDate: String
        pickDate: String
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

    enum RiskEnum {
        critical
        high
        regular
        low
    }

    type Patient {
        id: ID!
        name: String
        motherName: String
        sex: String
        dob: String
        age: String
        cpf: String
        cns: String
        weightKg: Float
        phone: String
        professionals: [User]
        communityHealthAgent: User
    }

    type LabTest{
        id: ID!
        name: String
        abbreviation: String
    }

    type PregnancyLabTest {
        labTest: LabTest
        value: String
    }

    type Pregnancy {
        id: ID!
        patient: Patient
        lastMenstrualPeriod: String
        parity: String
        gestationalAgeLmp: String
        gestacionalAgeFirstUsg: String
        ultrasonographies: [Ultrasonography]
        labTests: [PregnancyLabTest]
        observations: String
        dayOfBirth: String
        risk: RiskLevel
    }

    type RiskLevel {
        id: ID!
        name: String
        description: String
    }

    type Ultrasonography {
        date: String
        gestationalAgeWeeks: String
        gestationalAgeDays: String
        formatedGestationalAge: String
    }

    type Institution {
        id: ID!
        name: String
        cnes: String
    }

    type UserInstitutionRole{
        id: ID!
        institution: Institution
        role: Role
    }

    type Role {
        id: ID!
        name: String
    }
'''
)

# Initialize query
query = ObjectType("Query")
# Initialize mutations
mutation = ObjectType("Mutation")

import app.graphql.resolvers
