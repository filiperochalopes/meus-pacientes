import React from "react";
import LYTSimplePage from "components/LYT_SimplePage";
import Input from "components/Input";
import Button from "components/Button";
import { useFormik } from "formik";
import { GET_LAB_TEST_ARRIVAL } from "graphql/queries";
import { useLazyQuery, useQuery } from "@apollo/client";
import { useEffect } from "react";

const LabTestForm = () => {
  const [getLabTestArrival, { data, loading }] =
      useLazyQuery(GET_LAB_TEST_ARRIVAL),
    formik = useFormik({
      initialValues: {
        patientCpf: "",
      },
      onSubmit: async (values) => {
        getLabTestArrival({
          variables: { cpf: values.patientCpf },
        });
      },
    });

  useEffect(() => {
    console.log(data);
  }, [data]);

  return (
    <LYTSimplePage title="Cadastro de Exames" showMenu={false}>
      <p>
        Olá paciente, para verificar se seus exames chegaram na SEDE 2, digite
        abaixo o seu CPF
      </p>

      <form onSubmit={formik.handleSubmit}>
        <Input
          type="text"
          name="patientCpf"
          placeholder="CPF do Paciente"
          formik={formik}
        />
        <Button type="submit">Pesquisar</Button>
        {/* <pre>{JSON.stringify(formik, null, 2)}</pre> */}
      </form>
      <br />
      <br />
      <center>
        <big>
          <strong>
            {loading && (
              <p>
                <span role="img" aria-label="emoji loading">
                  ⏳
                </span>
                Carregando...
              </p>
            )}
            {!data?.getLabTestArrival?.length && <p>Não temos exames seu no momento</p>}
            {data?.getLabTestArrival?.length && <p>
              <span role="img" aria-label="emoji check">
                ✅
              </span>{" "}
              Seu exame chegou no dia! Temos ({data.getLabTestArrival.length}) exame(s)! Pode vir buscar!
            </p>}
          </strong>
        </big>
      </center>
    </LYTSimplePage>
  );
};

export default LabTestForm;
