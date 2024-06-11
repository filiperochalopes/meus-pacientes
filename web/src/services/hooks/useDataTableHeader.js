const useDataTableHeader = ({
  globalFilterValue,
  onGlobalFilterChange,
  handleInsertModelBtn,
}) => {
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
        {handleInsertModelBtn && (
          <button onClick={handleInsertModelBtn}>
            Adicionar novo registro
          </button>
        )}
      </span>
    </div>
  );
};

export default useDataTableHeader;
