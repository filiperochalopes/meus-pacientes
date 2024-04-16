import LYTSimplePage from "components/LYT_SimplePage";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { useEffect, useState } from "react";
import apiClient from "services/apiClient";
import { GET_PRESCRIPTION_LIST } from "graphql/queries";
import { FilterMatchMode } from "primereact/api";

// the function component to display a DataTable from primereact
const PrescriptionList = () => {
  const [prescriptionList, setPrescriptionList] = useState([]);
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    name: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    "country.name": { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    representative: { value: null, matchMode: FilterMatchMode.IN },
    status: { value: null, matchMode: FilterMatchMode.EQUALS },
    verified: { value: null, matchMode: FilterMatchMode.EQUALS },
  });
  const [globalFilterValue, setGlobalFilterValue] = useState(""),
    [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient
      .query({
        query: GET_PRESCRIPTION_LIST,
      })
      .then(({ data }) => {
        console.log(data);
        setPrescriptionList(data.getPrescriptionList);
      })
      .finally(() => setLoading(false));
  }, []);

  const onGlobalFilterChange = (e) => {
    const value = e.target.value;
    let _filters = { ...filters };

    _filters["global"].value = value;

    setFilters(_filters);
    setGlobalFilterValue(value);
  };

  const renderHeader = () => {
    return (
      <div className="flex justify-content-end">
        <span className="p-input-icon-left">
          <i className="pi pi-search" />
          <input
            type="text"
            value={globalFilterValue}
            onChange={onGlobalFilterChange}
            placeholder="Keyword Search"
          />
        </span>
      </div>
    );
  };
  const header = renderHeader();

  return (
    <LYTSimplePage title="Lista de Prescrições">
      <DataTable
        value={prescriptionList}
        // size="small"
        paginator
        rows={20}
        rowsPerPageOptions={[20, 40, 80, 160]}
        sortMode="multiple"
        removableSort
        globalFilterFields={["patient.name"]}
        editMode="row"
        scrollable
        header={header}
        loading={loading}
      >
        <Column
          field="patient.name"
          header="Nome do Paciente"
          sortable
          filterField="patient.name"
          frozen
        ></Column>
        <Column
          field="origin"
          header="Origem"
          sortable
          filterField="origin"
          filterPlace
        ></Column>
        <Column field="dosage" header="Dose"></Column>
        <Column field="reason" header="Motivo"></Column>
        <Column field="observations" header="Observações"></Column>
        <Column
          field="withdrawal_attempt"
          header="Tentativa de Retirada/Desmame"
        ></Column>
        <Column field="usage_time" header="Tempo de Uso"></Column>
        <Column field="last_renovation" header="Última Renovação"></Column>
      </DataTable>
    </LYTSimplePage>
  );
};

export default PrescriptionList;
