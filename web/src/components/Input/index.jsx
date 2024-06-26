import InputContainer, { ErrorText } from "./styles";

import React from "react";
import PropTypes from "prop-types";
function Input({
  type,
  name,
  label,
  placeholder,
  description,
  formik,
  required,
  onBlur,
  onChange,
  onFocus,
  disabled,
}) {
  return (
    <InputContainer disabled={disabled}>
      {placeholder && (
        <label disabled={disabled} to={name}>
          {label || placeholder} {required && <span>*</span>}
        </label>
      )}
      {description && <small>{description}</small>}
      {type === "textarea" ? (
        <textarea
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
      ) : (
        <input
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
      )}
      {formik?.errors[name] && formik.touched[name] && (
        <ErrorText>{formik.errors[name]}</ErrorText>
      )}
    </InputContainer>
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
