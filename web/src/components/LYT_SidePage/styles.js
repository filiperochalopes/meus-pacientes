import styled from "styled-components";

export default styled.div`
  .flex {
    display: flex;
    min-height: calc(100vh - 40px);

    > div,
    > main {
      flex: 1;
    }

    > main {
      padding: 0 16px;
      max-width: 400px;
      box-sizing: border-box;
    }
  }

  .sideComponent {
    background: grey;
    height: 100%;
    color: white;
    text-align: center;

    p {
      height: 100%;
    }
  }
`;
