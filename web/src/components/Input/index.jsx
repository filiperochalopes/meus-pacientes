import StyledInput, { ContainerInput, Label, ErrorText } from "./styles";

import React, { useRef, useState } from "react";
import PropTypes from "prop-types";
function Input({
  type,
  name,
  label,
  placeholder,
  description,
  formik,
  required,
  multiline,
  onBlur,
  onChange,
  onFocus,
  disabled,
}) {
  const [select, setSelect] = useState(false);
  const ref = useRef(null);
  return (
    <ContainerInput disabled={disabled}>
      {placeholder && (
        <Label
          width={ref?.current?.clientWidth}
          disabled={disabled}
          select={select}
          to={name}
        >
          {label || placeholder} {required && <span>*</span>}
        </Label>
      )}
      {description && <small>{description}</small>}
      <StyledInput
        type={type}
        name={name}
        id={name}
        placeholder={placeholder}
        onChange={(e) => {
          formik?.handleChange(e);
          if (onChange) onChange(e);
        }}
        onBlur={(e) => {
          formik?.handleBlur(e);
          if (onBlur) onBlur(e);
        }}
        onFocus={onFocus}
        required={required}
        value={formik?.values[name]}
        disabled={disabled}
      />
      {formik?.errors[name] && formik.touched[name] && (
        <ErrorText>{formik.errors[name]}</ErrorText>
      )}
    </ContainerInput>
  );
}

Input.propTypes = {
  name: PropTypes.string.isRequired,
  type: PropTypes.string,
  label: PropTypes.string,
  required: PropTypes.bool,
  multiline: PropTypes.bool,
  disabled: PropTypes.bool,
  description: PropTypes.string,
  placeholder: PropTypes.string,
  formik: PropTypes.object,
  onChange: PropTypes.func,
  onBlur: PropTypes.func,
  onFocus: PropTypes.func,
};

Input.defaultProps = {
  type: "text",
  placeholder: "Digite seu texto aqui",
  required: false,
  multiline: false,
  disabled: false,
};

export default Input;
