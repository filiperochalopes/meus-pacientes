import React from "react";
import ReactSelect from "react-select";
import Creatable from "react-select/creatable";
import Container, { IconContainer } from "./styles";
import { MdArrowDropDown } from "react-icons/md";
import AsyncSelect from "react-select/async";

const selectStyles = {
  container: (props) => ({
    ...props,
    background: "#D9D9D9",
    height: "2.5rem",
  }),
  indicatorSeparator: () => ({
    border: "0",
  }),
  control: (props) => ({
    ...props,
    background: "#D9D9D9",
    border: "0",
  }),
  placeholder: (props) => ({
    ...props,
    color: "#000",
    fontSize: "1rem",
  }),
};

const Select = ({
  error,
  className,
  name, 
  formik,
  created = false,
  components = {},
  async = false,
  options,
  ...rest
}) => {
  const SelectType =
    created && !async ? Creatable : async ? AsyncSelect : ReactSelect;

  return (
    <Container className={className}>
      <SelectType
        menuPosition="fixed"
        components={{
          DropdownIndicator: () => (
            <IconContainer>
              <MdArrowDropDown size={24} />
            </IconContainer>
          ),
          ...components,
        }}
        styles={selectStyles}
        name={name}
        options={options}
        value={formik?.values[name]}
        onChange={(e) => {
          formik?.setFieldValue(name, e);
          formik?.setFieldTouched(name, true);
        }}
        {...rest}
      />
      {formik?.errors[name] && formik.touched[name] && (
        <ErrorText>{formik.errors[name]}</ErrorText>
      )}
    </Container>
  );
};

export default Select;
