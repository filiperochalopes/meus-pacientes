import styled from "styled-components";

export default styled.div`
  main {
    max-width: 1200px;
    padding: 1rem 16px;
    margin: 0 auto;
    box-sizing: border-box;
  }

  aside {
    position: absolute;
    top: 40px;
    z-index: 99;
    background: blue;
    color: white;

    a {
      color: white;

      &:hover {
        text-decoration: underline;
      }
    }

    ul {
      li {
        padding: 8px;
      }
    }
  }
`;
