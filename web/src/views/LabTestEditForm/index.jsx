import React, { useEffect } from "react";
import LYTSimplePage from "components/LYT_SimplePage";
import Input from "components/Input";
import Button from "components/Button";
import { useFormik } from "formik";
import { CREATE_OR_UPDATE_LAB_TEST_ARRIVAL } from "graphql/mutations";
import { useLazyQuery, useMutation, useQuery } from "@apollo/client";
import { enqueueSnackbar } from "notistack";
import { GET_LAB_TEST_ARRIVAL } from "graphql/queries";
import {BtnListItem} from "./styles";
const LabTestForm = () => {
  const [id, setId] = React.useState(null),
    [createLabTestArrival, { data, loading }] = useMutation(
      CREATE_OR_UPDATE_LAB_TEST_ARRIVAL
    ),
    [getLabTestArrival, { data: labTestArrivalList }] = useLazyQuery(GET_LAB_TEST_ARRIVAL),
    initialValues = {
      id: null,
      arrivalDate: "",
      labTestDate: "",
      pickDate: new Date().toISOString().slice(0, 10),
      patientName: "",
      patientDob: "",
      patientCpf: "",
    },
    formik = useFormik({
      initialValues,
      initialTouched: {},
      onSubmit: async (values, { resetForm }) => {
        await createLabTestArrival({
          variables: {
            id: parseInt(id),
            item: {
              pickDate: values.pickDate,
            },
          },
        });
        resetForm({ values: initialValues });
        enqueueSnackbar("Cadastrado editado com sucesso!", { variant: "success" });
        getLabTestArrival()
        setId(null)
      },
    });
    
    useEffect(() => {
      console.log(labTestArrivalList)
    }, [labTestArrivalList])
    
    useEffect(() => {
      if (id) {
        formik.setValues({
          id,
          arrivalDate: labTestArrivalList.getLabTestArrival.find((e) => e.id === id)?.arrivalDate || "",
          labTestDate: labTestArrivalList.getLabTestArrival.find((e) => e.id === id)?.labTestDate || "",
          patientName: labTestArrivalList.getLabTestArrival.find((e) => e.id === id)?.patient.name || "",
          patientDob: labTestArrivalList.getLabTestArrival.find((e) => e.id === id)?.patient.dob || "",
          patientCpf: labTestArrivalList.getLabTestArrival.find((e) => e.id === id)?.patient.cpf || "",
          pickDate: initialValues.pickDate
        })
        formik.setFieldTouched("pickDate", true)

    }
  }, [id])

  useEffect(() => {
    getLabTestArrival()
  }, [])

  return (
    <LYTSimplePage title="Cadastro de Exames">
      <p>
        O paciente já pegou o exame e precisa ser retirado da lista, selecione
        abaixo o exame que chegou e informe a data em que o paciente levou.
      </p>
      {!id && labTestArrivalList?.getLabTestArrival.map((e) => (
          <BtnListItem key={e.id} onClick={() => setId(e.id)}>
            {e.patient.name} ({e.labTestDate}) Chegou: {e.arrivalDate}
          </BtnListItem>
        ))}
      <div
        styles={{ position: "fixed", top: "20vh", width: "80vw", left: "10vw" }}
      >
      {id && (
         <form onSubmit={formik.handleSubmit}>
         <Input
           formik={formik}
           type="text"
           name="patientCpf"
           placeholder="CPF do Paciente"
           disabled
         />
         <Input
           formik={formik}
           type="text"
           name="patientName"
           placeholder="Nome do paciente"
           required
           disabled
         />
         <Input
           formik={formik}
           type="date"
           name="patientDob"
           placeholder="Data de nascimento do paciente"
           required
           disabled
         />
         <Input
           formik={formik}
           type="date"
           name="labTestDate"
           placeholder="Data do Exame"
           description="Data em que o exame foi realizado, fica registrado na frente do documento"
           disabled
         />
         <Input
           formik={formik}
           type="date"
           name="arrivalDate"
           placeholder="Data de chegada"
           description="Data em que o exame chegou à unidade de saúde"
           disabled
         />
         <Input
           formik={formik}
           type="date"
           name="pickDate"
           placeholder="Data de Entrega"
           description="Data em que o exame chegou à unidade de saúde"
           required
         />
         <pre>{JSON.stringify(formik, null, 2)}</pre>
         <Button
           type="submit"
           disabled={loading || Object.keys(formik.errors).length !== 0}
         >
           {loading
             ? "Carregando..."
             : Object.keys(formik.errors).length === 0
             ? "Marcar como Entregue"
             : "Verifique o Erro"}
         </Button>
       </form>
      )}
      </div>
    </LYTSimplePage>
  );
};

export default LabTestForm;
