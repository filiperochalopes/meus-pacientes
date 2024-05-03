import React from "react";
import LYTSimplePage from "components/LYT_SimplePage";
import Input from "components/Input";
import Button from "components/Button";
import { useFormik } from "formik";

const LabTestForm = () => {
  const [id, setId] = React.useState(null),
  formik = useFormik({
    initialValues: {
      id: 1,
      pickDate: new Date().toISOString().slice(0, 10),
    },
  });

  return (
    <LYTSimplePage title="Cadastro de Exames">
      <p>
        O paciente já pegou o exame e precisa ser retirado da lista, selecione
        abaixo o exame que chegou e informe a data em que o paciente levou.
      </p>
      <div
        styles={{ position: "fixed", top: "20vh", width: "80vw", left: "10vw" }}
      >
        <form>
          <Input
            type="date"
            name="pickDate"
            placeholder="Data"
            description="Informe a data que o paciente pegou o exame"
          />
          <Input
            type="text"
            name="name"
            placeholder="Nome do paciente"
            required
          />
          <Button type="submit">Chegou</Button>
        </form>
      </div>
    </LYTSimplePage>
  );
};

export default LabTestForm;
