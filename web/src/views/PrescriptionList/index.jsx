import LYTSimplePage from "components/LYT_SimplePage";
import { useEffect, useState } from "react";
import apiClient from "services/apiClient";
import { GET_PRESCRIPTION_LIST } from "graphql/queries";
import { useQuery } from "@apollo/client";
import DataTable from "components/DataTable"

// the function component to display a DataTable from primereact
const PrescriptionList = () => {
  const [prescriptionList, setPrescriptionList] = useState([]),
    { data, loading } = useQuery(GET_PRESCRIPTION_LIST);

  useEffect(() => {
    if (data) {
      setPrescriptionList(data.getPrescriptionList);
    }
  }, [data]);

  return (
    <LYTSimplePage title="Lista de Prescrições">
      <DataTable globalFilterFields={["patient.name", "dosage", "origin"]} loading={loading} value={prescriptionList} emptyMessage="Não foram encontrados pacientes." columns={[
        {
          field: "patient.name",
          header: "Nome do Paciente",
        },
        {
          field: "origin",
          header: "Origem",
        },
        {
          field: "dosage",
          header: "Dose"
        },
        {
          field: "reason",
          header: "Motivo"
        },
        {
          field: "observations",
          header: "Observações",
        },
        {
          field: "withdrawal_attempt",
          header: "Tentativa de Retirada/Desmame"
        },
        {
          field: "last_prescription_date",
          header: "Data da Ultima Prescrição",
          description: "Data da prescrição trazida para renovação",
          type: "date"
        },
        {
          field: "usage_time",
          header: "Tempo de Uso"
        },
        {
          field: "last_renovation",
          header: "Ultima Renovação",
          type: "date"
        }
      ]} />
    </LYTSimplePage>
  );
};

export default PrescriptionList;
