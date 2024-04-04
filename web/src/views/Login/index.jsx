import Form, { Container } from "./styles";

import Button from "components/Button";
import Input from "components/Input";
import Header from "components/Header";

import { useFormik } from "formik";
import React from "react";
import { useNavigate } from "react-router-dom";
import validationSchema from "./validationSchema";
import { useMutation } from "@apollo/client";
import { SIGNING } from "graphql/mutations";
import { useEffect } from "react";
import { useContextProvider } from "services/Context";
import useHandleErrors from "services/hooks/useHandleErrors";
import SidePageLayout from "components/LYT_SidePage";

function Login() {
  const navigate = useNavigate();
  const [signing, { loading }] = useMutation(SIGNING);
  // const { updateUser } = useContextProvider();
  const { handleErrors } = useHandleErrors();

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
        const response = await signing({ variables: values });
        console.log(response.data);
        localStorage.setItem("token", response.data.signin.token);
        // updateUser(response.data.signin.token);
        navigate("/pacientes");
      } catch (e) {
        handleErrors(e);
      }
    },
  });

  useEffect(() => {
    const getToken = localStorage.getItem("token");
    if (getToken) {
      navigate("/pacientes", {
        replace: true,
      });
    }
  }, [navigate]);

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
