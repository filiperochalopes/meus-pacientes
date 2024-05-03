import styled from "styled-components";

export default styled.header`
  background: ${({ theme }) => theme.colors.blueGradient};
  width: 100vw;
  margin: 0 auto;
  height: 40px;
  padding: 0 2rem;
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  justify-content: space-between;
  color: white;

  button {
    background-color: white;
    color: blue;
    padding: 4px 8px;
    border-radius: 4px;
  }
`;
