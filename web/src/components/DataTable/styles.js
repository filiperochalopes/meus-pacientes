import styled from "styled-components";
import { DataTable } from "primereact/datatable";

export const StyledDataTable = styled(DataTable)`
  .p-datatable-scrollable {
    overflow-x: auto;
  }

  .p-datatable {
    border-collapse: collapse;
    box-shadow: 0px 0px 2px 5px green;
  }

  .p-datatable-header {
    padding: 0.5rem;
    border-radius: 8px 8px 0 0;
    background-color: #0069d0;

    input[type="search"] {
      padding: 4px 8px;
      width: 250px;
      border-radius: 8px;
    }

    button {
      padding: 4px 8px;
      border-radius: 8px;
      margin-left: 8px;
      cursor: pointer;
    }
  }

  .p-datatable-thead > tr > th {
    background-color: #0069d0;
    padding: 6px 2px;
    font-weight: 100;
    color: white;
  }

  .p-datatable-tbody td {
    border: 1px solid #0069d0;
  }

  .bg-high-risk {
    background-color: #ff9c99;
  }
`;
