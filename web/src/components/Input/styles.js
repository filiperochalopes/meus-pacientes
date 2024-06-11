import styled from "styled-components";

export default styled.div`
  flex: 1;
  position: relative;
  margin-bottom: 1rem;

  small {
    line-height: 11px;
    font-size: 12px;
    color: #767676;
  }

  label {
    font-weight: bold;
    display: block;
    line-height: 20px;
  }

  input,
  textarea {
    background-color: rgb(255, 255, 255);
    border: 1px solid rgb(143, 143, 162);
    border-radius: 2px;
    color: rgb(36, 37, 46);
    font-size: 0.8125rem;
    line-height: 1rem;
    margin: 0px;
    margin-top: 0.25rem;
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
  }
`;

export const ErrorText = styled.p`
  display: flex;
  -webkit-box-align: center;
  align-items: center;
  color: rgb(208, 30, 41);
  margin-top: 0.25rem;
  line-height: 20px;
`;
