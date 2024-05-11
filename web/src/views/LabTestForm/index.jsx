import React, { useEffect } from "react";
import LYTSimplePage from "components/LYT_SimplePage";
import Input from "components/Input";
import Button from "components/Button";
import { useFormik } from "formik";
import { CREATE_OR_UPDATE_LAB_TEST_ARRIVAL } from "graphql/mutations";
import { useMutation } from "@apollo/client";
import { enqueueSnackbar } from "notistack";
import validationSchema from "./validationSchema";

const LabTestForm = () => {
  const [createLabTestArrival, { data, loading }] = useMutation(
      CREATE_OR_UPDATE_LAB_TEST_ARRIVAL
    ),
    initialValues = {
      arrivalDate: new Date().toISOString().slice(0, 10),
      labTestDate: "",
      patientName: "",
      patientDob: "",
      patientCpf: "",
      patientPhone: "",
    },
    formik = useFormik({
      initialValues,
      initialTouched: {},
      validationSchema,
      onSubmit: async (values, { resetForm }) => {
        await createLabTestArrival({
          variables: {
            item: {
              arrivalDate: values.arrivalDate,
              labTestDate: values.labTestDate,
              patient: {
                name: values.patientName,
                cpf: values.patientCpf,
                dob: values.patientDob,
                phone: values.patientPhone,
              },
            },
          },
        });
        resetForm({ values: initialValues });
        enqueueSnackbar("Cadastrado com sucesso!", { variant: "success" });
      },
    });

  return (
    <LYTSimplePage title="Cadastro de Exames" showMenu={true}>
      <p>
        Chegaram exames de laboratório e você precisa cadastrar? Preencha o
        formulário abaixo e os pacientes e TACS saberão que o exame chegou
      </p>{" "}
      <p>
        Esse formulário deve ser acessado por TACS ou profissionais da Recepção
        e gerência.
      </p>
      <form onSubmit={formik.handleSubmit}>
        <Input
          formik={formik}
          type="text"
          name="patientCpf"
          placeholder="CPF do Paciente"
        />
        <Input
          formik={formik}
          type="text"
          name="patientName"
          placeholder="Nome do paciente"
          required
        />
        <Input
          formik={formik}
          type="date"
          name="patientDob"
          placeholder="Data de nascimento do paciente"
          required
        />
        <Input
          formik={formik}
          type="text"
          name="patientPhone"
          placeholder="Telefone do paciente"
        />
        <Input
          formik={formik}
          type="date"
          name="labTestDate"
          placeholder="Data do Exame"
          description="Data em que o exame foi realizado, fica registrado na frente do documento"
          required
        />
        <Input
          formik={formik}
          type="date"
          name="arrivalDate"
          placeholder="Data de chegada"
          description="Data em que o exame chegou à unidade de saúde"
          required
        />
        {/* <pre>{JSON.stringify(formik, null, 2)}</pre> */}
        <Button
          type="submit"
          disabled={loading || Object.keys(formik.errors).length !== 0}
        >
          {loading
            ? "Carregando..."
            : Object.keys(formik.errors).length === 0
            ? "Enviar"
            : "Verifique o Erro"}
        </Button>
      </form>
    </LYTSimplePage>
  );
};

export default LabTestForm;
