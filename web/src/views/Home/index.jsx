import React from "react";
import Container from "./styles";
import SimplePageLayout from "components/LYT_SimplePage";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <SimplePageLayout>
      <Container>
        <h1>Listas para Atenção Primária</h1>
        <p>
          Em todos lugares que já trabalhei em Unidade Básica de Saúde, Atenção
          Primária e Estratégia de Saúde da Família, se quisermos nos organizar
          para avaliar nossos pacientes de forma mais ativa e eficiente
          precisamos criar listas, que muitas vezes se tornam planilhas pouco
          eficientes e trabalhosas de preencher
        </p>
        <p>
          Saí surgiu a ideia de fazer algo mais automatizado e com recursos de
          relatório simplificado e superior, por hora nós temos a possibilidade
          de:
        </p>
        <ul>
          <li>
            Listar gestantes com calculo automático de idade gestacional, exames
            que precisam ser solicitados e rápida visualizaão de todas as
            gestantes em uma única tela para gestão de risco;
          </li>
          <li>
            Lista de Comorbidades, para acompanhamento de classificação de risco
            hiperdia, ficando mais fácil verificar necessidade de retorno de
            pacientes mais graves e descompensados;
          </li>
          <li>
            Lista de Busca ativa, utilitário para colocar pacientes que precisam
            ficar no radar até solucução do problema, seja ele um caso clínico
            atípico ou problema social a resolver, útil para abordar com agentes
            de saúde em reunião de equipe
          </li>
          <li>
            Lista de Renovação de prescrição. Sabemos que, apesar de ser um
            trabalho chato, renovar prescrições faz parte da rotina,
            principalmente para pacientes que já tentamos desmame e não
            conseguimos de algumas drogas, ou casos que são acompanhados com
            especialista, porém precisam sempre da prescrição em dias como
            epilepsias e afins. Com essa lista podemos lembrar quem realmente
            precisa e quem quer usar da boa vontade do acolhimento para
            conseguir uma prescrição sem passar por uma consulta necessária.
          </li>
        </ul>
        <center>
          <br />
          <Link to="/login">Entrar no sistema</Link>
          <br />
          <br />
        </center>
        <section>
          <p>
            Para fazer uma lista para sua instituição{" "}
            <a
              href="https://wa.me/5571992518950"
              target="_blank"
              rel="noreferrer"
            >
              entre em contato
            </a>{" "}
            ou use o{" "}
            <a
              href="https://github.com/filiperochalopes/meus-pacientes"
              target="_blank"
              rel="noreferrer"
            >
              nosso código aberto
            </a>{" "}
            para instalar o serviço em seu servidor local de forma gratuita.
          </p>
        </section>
      </Container>
    </SimplePageLayout>
  );
};

export default Home;
