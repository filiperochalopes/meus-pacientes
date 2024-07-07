import { StyledDataTable } from "./styles";
import { FilterMatchMode } from "primereact/api";
import useDataTableHeader from "services/hooks/useDataTableHeader";
import { useState } from "react";
import { Column } from "primereact/column";
import { PropTypes } from "prop-types";
import { forwardRef } from "react";
import { useImperativeHandle } from "react";

const InternalDataTable = forwardRef(
  (
    {
      children,
      columns,
      loading,
      handleInsertModel,
      canUpdate,
      searchPlaceholder,
      formik,
      showMoreDetails,
      ...props
    },
    ref
  ) => {
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

    useImperativeHandle(ref, () => ({
      setShowInsertForm,
    }));

    const header = useDataTableHeader({
      globalFilterValue,
      onGlobalFilterChange,
      handleInsertModelBtn: () => {
        setShowInsertForm(true);
        if (formik) formik.setFieldValue("id", null, true);
      },
      searchPlaceholder,
    });

    return showInsertForm && children ? (
      [
        <button key={2} onClick={() => setShowInsertForm(false)}>
          ← Voltar
        </button>,
        children,
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
            ></Column>
          );
        })}
        {canUpdate && (
          <Column
            header="Edit"
            body={(rowData) => (
              <button
                onClick={() => {
                  setShowInsertForm(true);
                  if (formik) formik.setFieldValue("id", rowData.id, true);
                }}
              >
                📝
              </button>
            )}
          ></Column>
        )}
        {showMoreDetails && (
          <Column
            header="Details"
            body={(rowData) => (
              <button
                onClick={() => {
                  showMoreDetails(rowData);
                }}
              >
                🔎
              </button>
            )}
          ></Column>
        )}
      </StyledDataTable>
    );
  }
);

InternalDataTable.propTypes = {
  children: PropTypes.node,
  columns: PropTypes.array,
  loading: PropTypes.bool,
  handleInsertModel: PropTypes.func,
  searchPlaceholder: PropTypes.string,
  formik: PropTypes.object,
  canUpdate: PropTypes.bool,
  showMoreDetails: PropTypes.func,
};

InternalDataTable.defaultProps = {
  searchPlaceholder: "Digite para Pesquisar",
};

export default InternalDataTable;
