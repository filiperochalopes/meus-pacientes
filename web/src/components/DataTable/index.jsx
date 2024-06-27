import { StyledDataTable } from "./styles";
import { FilterMatchMode } from "primereact/api";
import useDataTableHeader from "services/hooks/useDataTableHeader";
import { useEffect, useState } from "react";
import { Column } from "primereact/column";

const InternalDataTable = ({
  children,
  columns,
  loading,
  handleInsertModel,
  ...props
}) => {
  const [filters, setFilters] = useState({
      global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    }),
    [globalFilterValue, setGlobalFilterValue] = useState(""),
    [showInsertForm, setShowInsertForm] = useState(false);

  // Updates the global filter value and triggers a filter update.
  const onGlobalFilterChange = (e) => {
    const value = e.target.value;
    let _filters = { ...filters };

    _filters["global"].value = value;

    setFilters(_filters);
    setGlobalFilterValue(value);
  };

  const handleUpdateModelItem = (id, name, value) => {};

  const header = useDataTableHeader({
    globalFilterValue,
    onGlobalFilterChange,
    handleInsertModelBtn: () => setShowInsertForm(true),
  });

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

  return showInsertForm && children ? (
    [
      children,
      <button key={2} onClick={() => setShowInsertForm(false)}>
        Voltar
      </button>,
    ]
  ) : (
    <StyledDataTable
      size="small"
      paginator
      rows={20}
      rowsPerPageOptions={[20, 40, 80, 160]}
      sortMode="multiple"
      removableSort
      editMode="cell"
      scrollable
      header={header}
      loading={loading}
      filters={filters}
      onFilter={onGlobalFilterChange}
      emptyMessage="Sem informações."
      {...props}
      rowClassName={(rowData) => props.rowClassName(rowData)}
    >
      {columns.map((column) => {
        return (
          <Column
            key={column.field}
            field={column.field}
            body={column.body}
            header={column.header}
            editor={(options) => textEditor(options)}
            onCellEditComplete={onCellEditComplete}
          ></Column>
        );
      })}
    </StyledDataTable>
  );
};

export default InternalDataTable;
