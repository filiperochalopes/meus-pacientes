// a react component created with LYT_SimplePage wrap to display  a DataTable from primereact
import LYT_SimplePage from "components/LYT_SimplePage";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { useContextProvider } from "services/Context";
import { useEffect, useState } from "react";
import apiClient from "services/apiClient";
import { GET_PRESCRIPTIONS } from "graphql/queries";

// the function component to display a DataTable from primereact
const PrescriptionList = () => {

  const [prescriptionList, setPrescriptionList] = useState([]);
  const { user } = useContextProvider();

  useEffect(() => {
    if (!user) {
      return;
    }
    apiClient.query({
      query: GET_PRESCRIPTIONS,
    }).then(({ data }) => {
      console.log(data)
    })
  }, [])

  return (
    <LYT_SimplePage title="Lista de Prescrições" >
      <DataTable value={prescriptionList} size="small" showGridlines stripedRows paginator rows={20} rowsPerPageOptions={[20, 40, 80, 160]} sortMode="multiple" globalFilterFields={['name']} editMode="row" scrollable>
        <Column field="name" header="Nome do Paciente" frozen></Column>
        <Column field="origin" header="Origem"></Column>
        <Column field="dosage" header="Dose"></Column>
        <Column field="reason" header="Motivo"></Column>
        <Column field="observations" header="Observações"></Column>
        <Column field="withdrawal_attempt" header="Tentativa de Retirada/Desmame"></Column>
        <Column field="usage_time" header="Tempo de Uso"></Column>
        <Column field="last_renovation" header="Última Renovação"></Column>
      </DataTable>
    </LYT_SimplePage>
  )
}

export default PrescriptionList