import Container from "./styles";

import PropTypes from "prop-types";
import React, { useRef } from "react";
import ReactSelect from "react-select";
import AsyncSelect from "react-select/async";
import AsyncCreatableSelect from "react-select/async-creatable";
import CreatableSelect from "react-select/creatable";

const selectStyles = {
  container: (props) => ({
    ...props,
    height: "2.2rem",
  }),
  indicatorSeparator: () => ({
    border: "none",
  }),
  indicatorContainer: () => ({
    border: "2px",
    height: "21px",
    svg: {
      fill: "#000",
    },
  }),
  control: (props, { isDisabled }) => ({
    ...props,
    background: "#ffffff0",
    borderWidth: "1px",
    borderColor: "#8f8fa2",
    borderRadius: "2px",
    minHeight: "2rem",
    height: "2rem",
    opacity: isDisabled ? "0.4" : "1",
  }),
  placeholder: (props) => ({
    ...props,
    color: "#000",
    fontSize: "0.9rem",
    height: "21px",
  }),
};

const Select = ({
  formik,
  name,
  label,
  description,
  placeholder,
  required,
  creatable,
  async,
  options,
  onBlur,
  onChange,
  isMulti,
  isOptionDisabled,
  onCreateOption,
  disabled,
  menuIsOpen,
}) => {
  const SelectComponent =
    creatable && !async
      ? CreatableSelect
      : async && creatable
      ? AsyncCreatableSelect
      : async
      ? AsyncSelect
      : ReactSelect;
  let processedOptions = useRef([]);
  if (options.length) {
    // Verificando se o array é simples composto de strings ou de objetos, no primeiro duplicamos o valor para value e label
    if (typeof options[0] === "string") {
      processedOptions = options.map((e) => ({
        value: e,
        label: e,
      }));
    } else {
      processedOptions = options;
    }
  }
  return (
    <Container>
      <label to={name}>
        {label || placeholder} {required && <span>*</span>}
      </label>
      {description && <p>{description}</p>}
      <SelectComponent
        menuPosition="fixed"
        placeholder={
          isMulti ? "Selecione uma ou mais opções" : "Selecione uma opção"
        }
        styles={selectStyles}
        id={name}
        name={name}
        options={!async && processedOptions}
        loadOptions={async && processedOptions}
        cacheOptions={async && true}
        defaultOptions={async && true}
        formatCreateLabel={(inputValue) =>
          `Clique para Adicionar "${inputValue}"`
        }
        onCreateOption={
          onCreateOption &&
          creatable &&
          ((value) => {
            onCreateOption(value);
            // Verifica se o input aceita varias respostas ou apenas uma para setar o campo da melhor forma
            if (isMulti) {
              if (Array.isArray(formik.values[name])) {
                formik.setFieldValue(name, [...formik.values[name], value]);
              } else {
                formik.setFieldValue(name, [value]);
              }
            } else {
              formik.setFieldValue(name, value);
            }
            formik.setFieldTouched(name, true, true);
          })
        }
        value={
          Array.isArray(processedOptions)
            ? Array.isArray(formik.values[name])
              ? processedOptions.filter((e) =>
                  formik.values[name].some((el) => e.value.includes(el))
                )
              : processedOptions.filter((e) => {
                  return e.value === formik.values[name];
                })
              ? processedOptions.filter((e) => {
                  return e.value === formik.values[name];
                })
              : { value: formik.values[name], label: formik.values[name] }
            : formik.values[name]
        }
        onChange={(e) => {
          if (onChange) onChange(e);
          let value = e.value;
          if (Array.isArray(e))
            value = e.reduce((acc, cur) => [cur.value, ...acc], []);
          if (!Array.isArray(processedOptions)) value = e;
          formik.setFieldValue(name, value);
          formik.setFieldTouched(name, true, true);
        }}
        onBlur={(e) => {
          if (onBlur) onBlur(e);
        }}
        isMulti={isMulti}
        isOptionDisabled={isOptionDisabled}
        isDisabled={disabled}
        menuIsOpen={menuIsOpen || undefined}
      />
      {formik?.errors[name] &&
        (formik.touched[name] || formik.submitCount > 0) && (
          <span className="error">{formik.errors[name]}</span>
        )}
    </Container>
  );
};

Select.propTypes = {
  formik: PropTypes.object,
  name: PropTypes.string.isRequired,
  type: PropTypes.string,
  label: PropTypes.string,
  required: PropTypes.bool,
  creatable: PropTypes.bool,
  async: PropTypes.bool,
  disabled: PropTypes.bool,
  isMulti: PropTypes.bool,
  menuIsOpen: PropTypes.bool,
  options: PropTypes.oneOfType([PropTypes.array, PropTypes.func]),
  isOptionDisabled: PropTypes.func,
  onCreateOption: PropTypes.func,
  description: PropTypes.string || PropTypes.node,
  placeholder: PropTypes.string,
  onChange: PropTypes.func,
  onBlur: PropTypes.func,
};

Select.defaultProps = {
  placeholder: "Selecione um item",
  required: false,
  creatable: false,
  isMulti: false,
  async: false,
  disabled: false,
  menuIsOpen: false,
  options: [],
};

export default Select;
