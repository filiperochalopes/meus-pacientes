import LYTSimplePage from "components/LYT_SimplePage";
import { useEffect, useState } from "react";
import {
  COMMUNITY_HEALTH_AGENTS,
  GET_PRESCRIPTION_LIST,
} from "graphql/queries";
import { CREATE_OR_UPDATE_PREGNANCY } from "graphql/mutations";
import { useMutation, useQuery } from "@apollo/client";
import DataTable from "components/DataTable";
import Input from "components/Input";
import Button from "components/Button";
import { useFormik } from "formik";
import Select from "components/Select";

// the function component to display a DataTable from primereact
const PrescriptionList = () => {
  const [prescriptionList, setPrescriptionList] = useState([]),
    { data, loading } = useQuery(GET_PRESCRIPTION_LIST),
    { data: communityHealthAgentsData } = useQuery(COMMUNITY_HEALTH_AGENTS),
    [createOrUpdatePregnancy, { loading: pregnancyLoading }] = useMutation(
      CREATE_OR_UPDATE_PREGNANCY
    ),
    formik = useFormik({
      initialValues: {
        patientName: "",
      },
      onSubmit: ({
        patientDob,
        patientName,
        patientTacs: communityHealthAgentId,
        pregnancyFirstUsgDate,
        pregnancyFirstUsgDay,
        pregnancyFirstUsgWeek,
        pregnancyLmp: lastMenstrualPeriod,
        pregnancyObservations: observations,
        pregnancyParity: parity,
        pregnancyRisk: risk,
      }) => {
        createOrUpdatePregnancy({
          variables: {
            patientName,
            patientDob,
            lastMenstrualPeriod,
            parity,
            pregnancyFirstUsgDate,
            pregnancyFirstUsgDay,
            pregnancyFirstUsgWeek,
            observations,
            risk,
            communityHealthAgentId: Number(communityHealthAgentId),
          },
        });
      },
    });

  useEffect(() => {
    if (data) {
      setPrescriptionList(data.getPrescriptionList);
    }
  }, [data]);

  useEffect(() => {
    if (communityHealthAgentsData) {
      console.log(communityHealthAgentsData);
    }
  }, [communityHealthAgentsData]);
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
              `${pregnancy?.parity} ${pregnancy?.gestationalAgeLmp} pela DUM (${pregnancy?.lmp}) e ${pregnancy?.gestacionalAgeFirstUs} pela USG de ${pregnancy?.us[0]?.age}`,
          },
          {
            header: "Observações",
            field: "pregnancy.observations",
          },
        ]}
      >
        <form onSubmit={formik.handleSubmit}>
          <Input label="Nome da Paciente" name="patientName" formik={formik} />
          <Input
            type="date"
            label="Data de Nascimento"
            name="patientDob"
            formik={formik}
          />
          {communityHealthAgentsData && (
            <Select
              label="Agente de Saúde"
              name="patientTacs"
              formik={formik}
              options={communityHealthAgentsData?.communityHealthAgents.map(
                (e) => ({ label: e.name, value: e.id })
              )}
            />
          )}
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
            name="pregnancyFirstUsgDate"
            formik={formik}
          />
          <Input
            type="number"
            label="Idade Gestacional na Primeira USG (Semana)"
            name="pregnancyFirstUsgWeek"
            formik={formik}
          />
          <Input
            type="number"
            label="Idade Gestacional na Primeira USG (Dia)"
            name="pregnancyFirstUsgDay"
            formik={formik}
          />
          <Select
            label="Risco Gestacional"
            name="pregnancyRisk"
            formik={formik}
            options={[
              { label: "Habitual", value: "regular" },
              { label: "Alto", value: "high" },
              { label: "Crítico", value: "critical" },
            ]}
          />
          <Input
            type="textarea"
            label="Observações"
            name="pregnancyObservations"
            formik={formik}
          />
          <Button loading={pregnancyLoading}>Enviar</Button>
        </form>
      </DataTable>
    </LYTSimplePage>
  );
};

export default PrescriptionList;
