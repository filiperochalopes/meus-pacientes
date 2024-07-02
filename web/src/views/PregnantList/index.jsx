import LYTSimplePage from "components/LYT_SimplePage";
import { useEffect, useState } from "react";
import {
  COMMUNITY_HEALTH_AGENTS,
  GET_PRESCRIPTION_LIST,
  PREGNANTS,
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
  const [pregnants, setPregnants] = useState([]),
    { data, loading } = useQuery(PREGNANTS),
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
      setPregnants(data.pregnants);
      console.log(data.pregnants);
    }
  }, [data]);

  return (
    <LYTSimplePage title="Lista de Gestantes">
      <DataTable
        globalFilterFields={["patient.name"]}
        loading={loading}
        value={pregnants}
        emptyMessage="Não foram encontrados gestantes."
        footer="* Utilizar idade gestacional pela DUM se diferença entre data pela primeira USG e DUM for menor ou maior que 8% (margem de erro)"
        canUpdate
        formik={formik}
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
            field: "patient.communityHealthAgent.name",
          },
          {
            header: "Detalhes",
            body: (pregnancy) => {
              return `${pregnancy?.parity} ${pregnancy?.gestationalAgeLmp} pela DUM (${pregnancy?.lastMenstrualPeriod}) e ${pregnancy?.gestacionalAgeFirstUs} pela USG de ${pregnancy?.ultrasonographies[0]?.age}`;
            },
          },
          {
            header: "Observações",
            field: "observations",
          }
        ]}
        rowClassName={(data) => {
          return {
            "bg-high-risk": data?.risk?.name === "alto",
          };
        }}
      >
        <form onSubmit={formik.handleSubmit}>
          <input type="text" name="id" value={formik.values.id} onChange={formik.handleChange}/>
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
      <pre>
        <code>{JSON.stringify(formik.values, null, 2)}</code>
      </pre>
    </LYTSimplePage>
  );
};

export default PrescriptionList;
