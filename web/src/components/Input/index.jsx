import Container, { ContainerInput, Label, ErrorText } from "./styles";

import React, { useRef, useState } from "react";

function Input({ error, disabled, placeholder, value, className, ...props }) {
  const [select, setSelect] = useState(false);
  const ref = useRef(null);
  return (
    <ContainerInput className={className} disabled={disabled}>
      {placeholder && (
        <Label
          width={ref?.current?.clientWidth}
          disabled={disabled}
          select={select || value}
        >
          {placeholder}
        </Label>
      )}
      <Container
        ref={ref}
        disabled={disabled}
        value={value}
        className={className}
        {...props}
        onFocus={() => setSelect(true)}
        onBlur={() => setSelect(false)}
      />
      {error && <ErrorText>{error}</ErrorText>}
    </ContainerInput>
  );
}

export default Input;
