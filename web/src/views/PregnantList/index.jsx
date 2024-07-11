import LYTSimplePage from "components/LYT_SimplePage";
import { useEffect, useState } from "react";
import { COMMUNITY_HEALTH_AGENTS, PREGNANTS, PREGNANCY } from "graphql/queries";
import { CREATE_OR_UPDATE_PREGNANCY } from "graphql/mutations";
import { useMutation, useQuery, useLazyQuery } from "@apollo/client";
import DataTable from "components/DataTable";
import Input from "components/Input";
import Button from "components/Button";
import { useFormik } from "formik";
import Select from "components/Select";
import { useRef } from "react";
import PrivatePage from "components/LC_PrivatePage";

const riskMap = {
  regular: "regular",
  alto: "high",
  baixo: "low",
  critico: "critical",
};
// the function component to display a DataTable from primereact
const PrescriptionList = () => {
  const [pregnants, setPregnants] = useState([]),
    [getPregnants, { data, loading }] = useLazyQuery(PREGNANTS, {
      fetchPolicy: "network-only",
    }),
    { data: communityHealthAgentsData } = useQuery(COMMUNITY_HEALTH_AGENTS),
    [getPregnancyData, { data: pregnancyData }] = useLazyQuery(PREGNANCY),
    [
      createOrUpdatePregnancy,
      { loading: pregnancyLoading, data: createPregnancyData },
    ] = useMutation(CREATE_OR_UPDATE_PREGNANCY),
    datatableRef = useRef(),
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
        pregnancyDateOfBirth: dateOfBirth,
        id,
      }) => {
        createOrUpdatePregnancy({
          variables: {
            id,
            patientName,
            patientDob,
            lastMenstrualPeriod,
            parity,
            pregnancyFirstUsgDate,
            pregnancyFirstUsgDay,
            pregnancyFirstUsgWeek,
            observations,
            risk,
            dateOfBirth,
            communityHealthAgentId: Number(communityHealthAgentId),
          },
        });
      },
    });

  useEffect(() => {
    getPregnants();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (data) {
      setPregnants(data.pregnants);
    }
  }, [data]);

  useEffect(() => {
    if (createPregnancyData) {
      formik.resetForm();
      if (datatableRef.current) {
        datatableRef.current.setShowInsertForm(false);
        getPregnants();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [createPregnancyData]);

  useEffect(() => {
    if (formik.values.id) {
      // captura a gravidez pelo id
      getPregnancyData({
        variables: {
          id: parseInt(formik.values.id),
        },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formik.values.id]);

  useEffect(() => {
    if (pregnancyData) {
      const { pregnancy: p } = pregnancyData;
      console.log(p);
      formik.setValues(
        {
          id: parseInt(formik.values.id),
          patientDob: p.patient.dob,
          patientName: p.patient.name,
          patientTacs: p.patient.communityHealthAgent?.id,
          pregnancyFirstUsgDate: p.ultrasonographies[0]?.date,
          pregnancyFirstUsgDay: parseInt(
            p.ultrasonographies[0]?.gestationalAgeDays
          ),
          pregnancyFirstUsgWeek: parseInt(
            p.ultrasonographies[0]?.gestationalAgeWeeks
          ),
          pregnancyLmp: p.lastMenstrualPeriod,
          pregnancyObservations: p.observations,
          pregnancyParity: p.parity,
          pregnancyRisk: riskMap[p.risk.name],
          pregnancyDateOfBirth: p.dateOfBirth,
        },
        true
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pregnancyData]);

  return (
    <PrivatePage>
      <LYTSimplePage title="Lista de Gestantes">
        <DataTable
          ref={datatableRef}
          globalFilterFields={["patient.name"]}
          loading={loading}
          value={pregnants}
          emptyMessage="Não foram encontrados gestantes."
          footer="* Utilizar idade gestacional pela DUM se diferença entre data pela primeira USG e DUM for menor ou maior que 8% (margem de erro)"
          canUpdate
          formik={formik}
          showMoreDetails={(pregnancy, setContentCallback) => {
            setContentCallback(
              <section>
                {pregnancy?.gestationalAgeLmp} pela DUM (
                {pregnancy?.lastMenstrualPeriod}) e{" "}
                {pregnancy?.gestationalAgeFirstUsg} pela USG de{" "}
                {pregnancy?.ultrasonographies[0]?.age}
                <textarea>
                  Gestante, {pregnancy?.patient?.age}, {pregnancy?.parity} IG{" "}
                  {pregnancy?.gestationalAge}. Nega cólicas, corrimentos,
                  sangramentos, disúria e outras queixas não descritas. Relata
                  uso do sultato ferroso e ácido fólico.
                </textarea>
              </section>
            );
          }}
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
                return `${pregnancy?.parity} ${pregnancy?.gestationalAge}`;
              },
            },
            {
              header: "DPP",
              field: "dueDate",
            },
            {
              header: "Observações",
              field: "observations",
            },
          ]}
          rowClassName={(data) => {
            return {
              "bg-high-risk": data?.risk?.name === "alto",
            };
          }}
        >
          <form onSubmit={formik.handleSubmit}>
            <input
              type="hidden"
              name="id"
              value={formik.values.id}
              onChange={formik.handleChange}
            />
            <Input
              label="Nome da Paciente"
              name="patientName"
              formik={formik}
            />
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
            <Input
              type="date"
              label="DUM"
              name="pregnancyLmp"
              formik={formik}
            />
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
            <Input
              type="date"
              name="pregnancyDateOfBirth"
              label="Data do Desfecho"
              formik={formik}
            />
            <Button loading={pregnancyLoading}>Enviar</Button>
          </form>
        </DataTable>
        {/* <pre>
          <code>{JSON.stringify(formik.values, null, 2)}</code>
        </pre> */}
      </LYTSimplePage>
    </PrivatePage>
  );
};

export default PrescriptionList;
