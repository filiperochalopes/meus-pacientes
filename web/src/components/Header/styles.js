import styled from "styled-components";

export default styled.header`
  background: ${({ theme }) => theme.colors.blueGradient};
  width: 95%;
  max-width: 1150px;
  margin: 0 auto;
  height: 40px;
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  justify-content: space-between;
`;
