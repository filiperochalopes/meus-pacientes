import Form, { Container } from "./styles";

import Button from "components/Button";
import Input from "components/Input";
import Header from "components/Header";

import { useFormik } from "formik";
import React from "react";
import { useNavigate } from "react-router-dom";
import validationSchema from "./validationSchema";
import { useMutation } from "@apollo/client";
import { SIGNIN } from "graphql/mutations";
import { useEffect } from "react";
import { useAppContext } from "services/Context";
import useHandleErrors from "services/hooks/useHandleErrors";
import SidePageLayout from "components/LYT_SidePage";

function Login() {
  const navigate = useNavigate(),
    [signing, { data, loading, error }] = useMutation(SIGNIN),
    { setToken } = useAppContext(),
    { handleErrors } = useHandleErrors();

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      if (loading) {
        return;
      }
      try {
        signing({ variables: values });
      } catch (e) {
        handleErrors(e);
      }
    },
  });

  useEffect(() => {
    if (data) {
      // Salva token em localstorage
      setToken(data.signin.token);
      navigate("/");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  useEffect(() => {
    if (error) {
      handleErrors(error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error]);

  return (
    <SidePageLayout>
      <Form onSubmit={formik.handleSubmit}>
        <h2>Entrar</h2>
        <Input
          placeholder="Login"
          name="email"
          value={formik.values.email}
          onChange={formik.handleChange}
          data-testid="email"
          error={
            formik.errors.email && formik.touched?.email
              ? formik.errors.email
              : ""
          }
        />
        <Input
          placeholder="Senha"
          name="password"
          data-testid="password"
          type="password"
          value={formik.values.password}
          onChange={formik.handleChange}
        />
        <Button loading={loading} data-testid="button">
          Entrar
        </Button>
      </Form>
    </SidePageLayout>
  );
}

export default Login;
