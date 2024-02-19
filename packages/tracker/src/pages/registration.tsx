import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Form, Input, Button, Checkbox, Typography, Space } from "antd";
import { useCreateUserWithEmailAndPassword } from "react-firebase-hooks/auth";
import { AuthError } from "firebase/auth";
import { useTransitionNavigate } from "common/src/utils/hooks/useTransitionNavigate";
import { routes } from "../shared/routes";
import { CurrentUser } from "common/src/services/api/useCurrentUser";
import { BaseLayout } from "common/src/components/BaseLayout";

type Props = {
  currentUser: CurrentUser;
};

const RegistrationErrors = {
  "Firebase: Error (auth/email-already-in-use).": "Пользователь с таким email уже существует",
  "Firebase: Error (auth/invalid-email).": "Email не валиднный",
} as Record<string, string>;

const getErrorMessage = (error: AuthError) => {
  const customMessage = RegistrationErrors[error.message];
  return customMessage || `При регистрации произошла ошибка: ${error.message}`;
};

export const Registration = ({ currentUser }: Props) => {
  const { auth, user } = currentUser;
  const [createUserWithEmailAndPassword, , , error] = useCreateUserWithEmailAndPassword(auth);
  const navigate = useTransitionNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Пользователь вошел
    if (user) {
      navigate(routes.auth);
    }
  }, [user, navigate]);

  const onFinish = ({ email, password }: any) => {
    setIsSubmitting(true);
    createUserWithEmailAndPassword(email.trim(), password).then(() => {
      setIsSubmitting(false);
    });
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };

  const { Title, Text } = Typography;

  const tailFormItemLayout = {
    wrapperCol: {
      xs: {
        span: 24,
        offset: 0,
      },
      sm: {
        span: 16,
        offset: 8,
      },
    },
  };

  return (
    <BaseLayout title="Регистрация" headerActions={[]}>
      <Title className="site-page-title" level={2}>
        СТРАНИЦА РЕГИСТРАЦИИ
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
              message: "Пожалуйста, введите свой адрес электронной почты",
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Пароль"
          name="password"
          rules={[
            { required: true, message: "Пожалуйста, введите ваш пароль" },
            { min: 6, message: "Пароль должен быть не менее 6 символов" },
          ]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item
          name="confirm"
          label="Подтвердить пароль"
          dependencies={["password"]}
          hasFeedback
          rules={[
            {
              required: true,
              message: "Пожалуйста, подтвердите свой пароль",
            },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("password") === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error("Два введенных вами пароля не совпадают"));
              },
            }),
          ]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item name="remember" valuePropName="checked" wrapperCol={{ offset: 8, span: 16 }}>
          <Checkbox>Запомни меня</Checkbox>
        </Form.Item>

        <Form.Item
          name="agreement"
          valuePropName="checked"
          rules={[
            {
              validator: (_, value) =>
                value
                  ? Promise.resolve()
                  : Promise.reject(new Error("Следует принять соглашение для регистрации")),
            },
          ]}
          {...tailFormItemLayout}
        >
          <Checkbox>
            Я согласен(а) и ознакомлен(на) с <Link to={routes.privacy}>соглашением</Link> и
            политикой конфиденциальности
          </Checkbox>
        </Form.Item>
        <Space direction="vertical" align="center" style={{ width: "100%" }}>
          <Button type="primary" htmlType="submit" block loading={isSubmitting}>
            Зарегистрироваться и войти
          </Button>
          {error && <Text type="danger">{getErrorMessage(error)}</Text>}
          <Link to={routes.auth}>Уже есть аккаунт</Link>
        </Space>
      </Form>
    </BaseLayout>
  );
};
