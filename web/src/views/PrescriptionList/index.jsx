import LYTSimplePage from "components/LYT_SimplePage";
import { StyledDataTable } from "./styles";
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

  // Updates the global filter value and triggers a filter update.
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
            type="search"
            value={globalFilterValue}
            onChange={onGlobalFilterChange}
            placeholder="Buscar por nome ou medicação"
          />
        </span>
      </div>
    );
  };
  const header = renderHeader();

  const textEditor = (options) => {
    return (
      <input
        type="text"
        value={options.value}
        onChange={(e) => options.editorCallback(e.target.value)}
        onKeyDown={(e) => e.stopPropagation()}
      />
    );
  };

  const onCellEditComplete = (e) => {
    console.log(e);
    const { rowData, newValue, field } = e;
    console.log(`Editando ${rowData.id} - ${field} para ${newValue}`);
  };

  return (
    <LYTSimplePage title="Lista de Prescrições">
      <StyledDataTable
        value={prescriptionList}
        size="small"
        paginator
        rows={20}
        rowsPerPageOptions={[20, 40, 80, 160]}
        sortMode="multiple"
        removableSort
        globalFilterFields={["patient.name", "dosage", "origin"]}
        editMode="cell"
        scrollable
        header={header}
        loading={loading}
        filters={filters}
        onFilter={onGlobalFilterChange}
        emptyMessage="Não foram encontrados pacientes."
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
          editor={(options) => textEditor(options)}
          onCellEditComplete={onCellEditComplete}
        ></Column>
        <Column
          field="last_prescription_date"
          header="Data da Ultima Prescrição"
          editor={(options) => textEditor(options)}
          onCellEditComplete={onCellEditComplete}
        ></Column>
        <Column
          field="usage_time"
          header="Tempo de Uso"
          editor={(options) => textEditor(options)}
          onCellEditComplete={onCellEditComplete}
        ></Column>
        <Column
          field="last_renovation"
          header="Última Renovação"
          editor={(options) => textEditor(options)}
          onCellEditComplete={onCellEditComplete}
        ></Column>
      </StyledDataTable>
    </LYTSimplePage>
  );
};

export default PrescriptionList;
