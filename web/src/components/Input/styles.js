import styled from "styled-components";

export default styled.input`
  background-color: rgb(255, 255, 255);
  border: 1px solid rgb(143, 143, 162);
  border-radius: 2px;
  color: rgb(36, 37, 46);
  font-size: 0.8125rem;
  line-height: 1rem;
  margin: 0px;
  padding: calc(-1px + 0.5rem) 0.5rem;
  width: 100%;
  transition-property: box-shadow;
  transition-duration: 0.2s;

  ::placeholder {
    color: ${({ theme }) => theme.colors.black};
  }

  :disabled {
    background: #ececec;
  }

  &:focus {
    outline: none;
    box-shadow: rgb(240, 240, 245) 0px 0px 0px 2px,
      rgb(0, 105, 208) 0px 0px 0px 4px;
  }

  ::-webkit-outer-spin-button,
  ::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  /* Firefox */
  [type="number"] {
    -moz-appearance: textfield;
  }
`;

export const ContainerInput = styled.div`
  flex: 1;
  position: relative;
`;

export const Label = styled.label`
  font-weight: bold;
  display: block;
  margin-bottom: 0.25rem;
  line-height: 20px;
`;

export const ErrorText = styled.p`
  display: flex;
  -webkit-box-align: center;
  align-items: center;
  color: rgb(208, 30, 41);
  margin-top: 0.25rem;
  line-height: 20px;
`;
