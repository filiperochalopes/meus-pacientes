import LYTSimplePage from "components/LYT_SimplePage";
import { useEffect, useState } from "react";
import { GET_PRESCRIPTION_LIST } from "graphql/queries";
import { useQuery } from "@apollo/client";
import DataTable from "components/DataTable";
import Input from "components/Input";
import Button from "components/Button";
import { useFormik } from "formik";
// import Select from "components/Select";

// the function component to display a DataTable from primereact
const PrescriptionList = () => {
  const [prescriptionList, setPrescriptionList] = useState([]),
    { data, loading } = useQuery(GET_PRESCRIPTION_LIST),
    formik = useFormik({
      initialValues: {
        patientName: "",
      },
      onSubmit: (values) => {
        console.log(values);
      },
    });

  useEffect(() => {
    if (data) {
      setPrescriptionList(data.getPrescriptionList);
    }
  }, [data]);

  return (
    <LYTSimplePage title="Lista de Gestantes">
      <DataTable
        globalFilterFields={["patient.name"]}
        rowClassName={({ pregnancy }) => ({
          "bg-high-risk": pregnancy?.risk === "HIGH",
        })}
        loading={loading}
        value={prescriptionList}
        emptyMessage="Não foram encontrados gestantes."
        footer="* Utilizar idade gestacional pela DUM se diferença entre data pela primeira USG e DUM for menor ou maior que 8% (margem de erro)"
        columns={[
          {
            header: "Nome do Paciente",
            field: "patient.name",
          },
          {
            header: "Idade",
            field: "patient.age",
          },
          {
            header: "Agente Saúde",
            field: "patient.tacs",
          },
          {
            header: "Detalhes",
            body: ({ pregnancy }) =>
              `${pregnancy?.parity} ${pregnancy?.gestationalAgeLmp} pela DUM (${pregnancy?.lmp}) e ${pregnancy?.gestationalAgeUs} pela USG de ${pregnancy?.us[0]?.date}`,
          },
          {
            header: "Observações",
            field: "pregnancy.observations",
          },
        ]}
      >
        <form>
          <Input label="Nome da Paciente" name="patientName" formik={formik} />
          <Input
            type="date"
            label="Data de Nascimento"
            name="patientDob"
            formik={formik}
          />
          {/* <Select label="Agente de Saúde" name="patientTacs" formik={formik} options={[]} /> */}
          <Input
            label="Paridade"
            description="Formato deve ser G9P9A0"
            name="pregnancyParity"
            formik={formik}
          />
          <Input type="date" label="DUM" name="pregnancyLmp" formik={formik} />
          <Input
            type="date"
            label="Data da Primeira Ultrassonografia"
            name="pregnancyFirstUsDate"
            formik={formik}
          />
          <Input
            type="number"
            label="Idade Gestacional na Primeira USG (Semana)"
            name="pregnancyFirstUsWeek"
            formik={formik}
          />
          <Input
            type="number"
            label="Idade Gestacional na Primeira USG (Dia)"
            name="pregnancyFirstUsDay"
            formik={formik}
          />
          <Input
            type="textarea"
            label="Observações"
            name="pregnancyObservations"
            formik={formik}
          />
          <Button>Enviar</Button>
        </form>
      </DataTable>
    </LYTSimplePage>
  );
};

export default PrescriptionList;
