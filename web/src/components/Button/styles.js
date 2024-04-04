import styled, { css, keyframes } from "styled-components";

const spin = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

export const ContainerLoading = styled.div`
  ${({ loading }) =>
    loading &&
    css`
      svg {
        animation: ${spin} 0.8s infinite linear;
      }
    `}
`;

export default styled.button`
  font-family: "IBM Plex Sans", sans-serif;
  line-height: 1.5rem;
  display: inline-flex;
  -webkit-box-pack: center;
  justify-content: center;
  position: relative;
  user-select: none;
  transition: all 0.2s ease 0s;
  font-weight: bold;
  cursor: pointer;
  border-radius: 4px;
  text-decoration: none;
  font-size: 0.875rem;
  padding: calc(-1px + 0.75rem) 1rem;
  width: 100%;
  background: ${({ theme }) => theme.colors.blueGradient};
  color: ${({ theme }) => theme.colors.white};
  border: none;

  ${({ customType }) => {
    switch (customType) {
      case "gray":
        return css`
          background-color: ${({ theme }) => theme.colors.grayMedium};
          color: ${({ theme }) => theme.colors.black};
        `;
      case "gray-300":
        return css`
          background-color: ${({ theme }) => theme.colors.gray};
          color: ${({ theme }) => theme.colors.black};

          :hover {
            background-color: #e9e9e9;
          }
        `;
      case "red":
        return css`
          background-color: ${({ theme }) => theme.colors.red700};
          color: ${({ theme }) => theme.colors.white};
        `;
      default:
        return css`
          background-color: ${({ theme }) => theme.colors.blue};
          color: ${({ theme }) => theme.colors.white};
        `;
    }
  }}
`;
