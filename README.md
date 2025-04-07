# Meus Pacientes

Esse projeto mudou um pouco de rumos nos últimos meses, tendo em vista o desenvolvimento de relatórios mais precisos do PEC e o desenvolvimento do Painel, mais recentemente, tentando dar mais controle ao gestor da ponta. A versão anterior e inacabada pode ser acessível sempre na branch `release/v1`. 

Apesar desses esforços, receio que ainda temos muitas lacunas restantes e passando pelo Brasil pude notar que muitas pessoas se valem de planilhas para controle de seus pacientes. Dessa formaesse projeto se tornou um conjunto de dados mínimos estruturadospara interoperabilidade na atenção básica e, em vez de trabalhar com aplicação completa, se tornou uma **API** apenas para documentação, com a possibilidade e criar produtos que integram nelecomo typebot, appsmith, dentre outros.

Talvez eu possa adicionar alguns produtos de minha autoria aqui dessas plataformas opensource que integram com a API em questão.

## Ambiente de desenvolvimento, configurações iniciais

```sh
cd api
rm -rf instance
flask db upgrade
flask seed
python shell.py create-institution
```

Lint python

```sh
cd api
ruff check --fix
ruff format
```

# Roadmap

- [ ] Criação de MVP com criação de items da lista em graphql playground evisualização com tabelas do [DataTable](https://primereact.org/datatable/)
- [ ] Criação do sistema de usuários que os TACS possam registrar os exames que chegaram. Aqui também devemos criar:
    - [ ] Módulo da Gestante, para mostrar a lista de nossas gestantes. Podendo ser acessada pelo hospital, co usuário específico dele. Integra com calc para verificar exames e épocas, bem como datas de eventos, integra com docs para fazer o cartão da gestante online e solicitar exames, integra com meuexa.me para ter acesso aos exames realizados. Criar documento solicitando permissão de uso para melhor controle dos dados pela paciente.
- [ ] Lista de Comorbidades (Integração com eSUS Plugin - Adicionar na lista de comorbidades - via url, precisa estar logado) - Com opção também de atualizar lista de comorbidade. Atualiza data de última consulta via API. Plugin deve configurar chave para integrar. Como chave de identidade, para que possa ver qual a instituição que está usando. UserInstitutionKey
- [ ] Adicionar na lista de Busca Ativa (Integração com eSUS Plugin)
- [ ] Lista de Ticket Retorno (Integração com eSUS Plugin) - Quando expira ele sai da lista. Urgente expira com 60 dias, exames expira com 80 dias
- [ ] Demanda de grupo. Anotações para resolução nas reuniões de equipe e acompanhamento das demandas criadas para dar continuidade ao discutido. Quem tiver `capability` de `can_mark_issue_as_read` pode marcar um caso como concluído.
- [ ] Canal de informativos da Unidade (Quando será o próximo grupo, mutirão, agendamento...)

## Testes

Utilizar o ambiente de desenvolvimento devcontainer no VSCode.

```sh
pytest -s -k Flow
```