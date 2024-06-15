import styled from "styled-components";

export default styled.div`
  flex: 1;
  position: relative;
  margin-bottom: 1rem;

  label {
    font-weight: bold;
    display: block;
    line-height: 20px;
  }

  p {
    font-size: 0.7rem;
  }

  span {
    color: red;
  }

  span.error {
    display: block;
    color: red;
    font-size: 0.8rem;
  }
`;
