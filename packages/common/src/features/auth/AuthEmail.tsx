import React, { useEffect, useState } from "react";
import { Form, Input, Button, Checkbox, Typography, Space } from "antd";
import { useSignInWithEmailAndPassword } from "react-firebase-hooks/auth";
import { Link, useNavigate } from "react-router-dom";
import { routes } from "../../../../tracker/src/shared/routes";
import { CurrentUser } from "common/src/services/api/useCurrentUser";

type Props = {
  currentUser: CurrentUser;
};

export const AuthEmail = ({ currentUser }: Props) => {
  const { auth, user } = currentUser;
  const [signInWithEmailAndPassword, , , emailError] = useSignInWithEmailAndPassword(auth);
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (user) {
      navigate(routes.root);
    }
  }, [navigate, user]);

  const onFinish = ({ email, password }: any) => {
    setIsSubmitting(true);
    signInWithEmailAndPassword(email, password).finally(() => {
      setIsSubmitting(false);
    });
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };

  const { Title, Text } = Typography;

  return (
    <Space direction="vertical" size="middle" style={{ display: "flex" }}>
      <Title className="site-page-title" level={5}>
        Вход или регистрация
      </Title>
      <Form
        name="basic"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <Form.Item
          label="Email"
          name="email"
          rules={[
            {
              required: true,
              message: "Пожалуйста, введите ваше имя пользователя",
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Пароль"
          name="password"
          rules={[{ required: true, message: "Пожалуйста, введите пароль" }]}
          help={emailError && <Text type="danger">Неверный логин или пароль</Text>}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item name="remember" valuePropName="checked" wrapperCol={{ offset: 8, span: 16 }}>
          <Form.Item>
            <Checkbox>Запомни меня</Checkbox>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={isSubmitting}>
              Войти
            </Button>
          </Form.Item>
          <Space direction="vertical">
            <Link to={routes.registration}>Регистрация</Link>
            <Link to={routes.resetpassemail}>Восстановить пароль</Link>
          </Space>
        </Form.Item>
      </Form>
    </Space>
  );
};