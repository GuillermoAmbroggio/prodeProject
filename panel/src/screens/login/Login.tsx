import React from "react";
import { Form, Input, Button } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { useLogin } from "../../particules/serverStore/mutations";

interface ILoginProps {}

const Login: React.FC<ILoginProps> = ({}) => {
  const { mutate, isLoading, isSuccess, isError, error } = useLogin();

  const onFinish = (values: any) => {
    mutate(values);
  };

  /* eslint-disable no-template-curly-in-string */
  const validateMessages = {
    required: "${label} este campo es requerido",
    types: {
      email: "${label} no es un correo valido",
    },
  };
  /* eslint-enable no-template-curly-in-string */

  const initialValues = {
    email: "guille@gmail.com",
    password: "Asd12345",
  };

  return (
    <div className="containerLogin">
      <Form
        name="normal_login"
        className="login-form"
        onFinish={onFinish}
        validateMessages={validateMessages}
        initialValues={initialValues}
      >
        <Form.Item name="email" rules={[{ required: true }, { type: "email" }]}>
          <Input
            prefix={<UserOutlined className="site-form-item-icon" />}
            placeholder="Correo eléctronico"
          />
        </Form.Item>
        <Form.Item name="password" rules={[{ required: true }]}>
          <Input.Password
            prefix={<LockOutlined className="site-form-item-icon" />}
            type="password"
            placeholder="Contraseña"
          />
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            className="login-form-button"
          >
            Iniciar Sesion
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Login;
