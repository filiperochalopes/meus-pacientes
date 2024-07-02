const useDataTableHeader = ({
  globalFilterValue,
  onGlobalFilterChange,
  handleInsertModelBtn,
  searchPlaceholder = "Digite para Pesquisar",
}) => {
  return (
    <div className="flex justify-content-end">
      <span className="p-input-icon-left">
        <i className="pi pi-search" />
        <input
          type="search"
          value={globalFilterValue}
          onChange={onGlobalFilterChange}
          placeholder={searchPlaceholder}
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
