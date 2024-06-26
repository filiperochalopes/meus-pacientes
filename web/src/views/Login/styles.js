import styled from "styled-components";

export default styled.form`
  display: flex;
  justify-content: center;
  width: 100%;
  max-width: 20rem;
  flex-direction: column;
  row-gap: 0.5rem;
  margin-top: 7rem;

  h2 {
    margin-bottom: 1.125rem;
  }

  button {
    align-self: flex-end;
    margin-top: 1.625rem;
    max-width: 5.94rem;
  }
`;

export const Container = styled.div`
  background: rgb(255, 255, 255);
  min-width: 400px;
  width: 22%;
  padding: 4rem;
  overflow: auto;
`;
