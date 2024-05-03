import React from "react";
import LYTSimplePage from "components/LYT_SimplePage";
import Input from "components/Input";
import Button from "components/Button";
import { useFormik } from "formik";

const LabTestForm = () => {
  const formik = useFormik({
    initialvalues: {
      // today date
      arrivalDate: new Date(),
    },
  });
  return (
    <LYTSimplePage title="Cadastro de Exames" showMenu={false}>
      <p>
        Olá paciente, para verificar se seus exames chegaram na SEDE 2, digite
        abaixo o seu CPF
      </p>

      <form>
        <Input type="text" name="cpf" placeholder="CPF do Paciente" />
        <Button type="submit">Pesquisar</Button>
      </form>
      <br />
      <br />
      <center>
        <big>
          <strong>
            <p>
              <span role="img" aria-label="emoji loading">
                ⏳
              </span>
              Carregando...
            </p>
            <p>
              Seu último exame chegou no dia e você pegou no dia, não temos
              novidades
            </p>
            <p>Não temos exames seu no momento</p>
            <p>
              <span role="img" aria-label="emoji check">
                ✅
              </span>
              Seu exame chegou no dia! Pode vir buscar!
            </p>
          </strong>
        </big>
      </center>
    </LYTSimplePage>
  );
};

export default LabTestForm;
