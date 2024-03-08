import { useEffect, useState } from "react";
import { Form, Input, Button, Checkbox, Typography, Space } from "antd";
import { useTranslation } from "react-i18next";
import { useSignInWithGoogle } from "react-firebase-hooks/auth";
import { useSignInWithEmailAndPassword } from "react-firebase-hooks/auth";
import { Link } from "react-router-dom";
import { routes } from "../shared/routes";
import { useTransitionNavigate } from "common/src/utils/hooks/useTransitionNavigate";
import { CurrentUser } from "common/src/services/api/useCurrentUser";
import { GoogleOutlined } from "@ant-design/icons";
import { BaseLayout } from "common/src/components/BaseLayout";

type Props = {
  currentUser: CurrentUser;
};

export const Auth = ({ currentUser }: Props) => {
  const { auth, user } = currentUser;
  const [signInWithGoogle, , , googleError] = useSignInWithGoogle(auth);
  const [signInWithEmailAndPassword, , , emailError] = useSignInWithEmailAndPassword(auth);
  const navigate = useTransitionNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { t } = useTranslation();

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
    <BaseLayout title="Учет книг" headerActions={[]}>
      <Title className="site-page-title" level={2}>
        {t("auth.title")}
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
          label={t("auth.email.label")}
          name="email"
          rules={[
            {
              required: true,
              message: t("auth.email.error.required"),
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label={t("auth.password.label")}
          name="password"
          rules={[{ required: true, message: t("auth.password.error.required") }]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item name="remember" valuePropName="checked" wrapperCol={{ offset: 8, span: 16 }}>
          <Checkbox>Запомни меня</Checkbox>
        </Form.Item>
        <Form.Item
          wrapperCol={{ offset: 8, span: 16 }}
          help={emailError && <Text type="danger">Неверный логин или пароль</Text>}
        >
          <Space>
            <Button type="primary" htmlType="submit" loading={isSubmitting}>
              Войти
            </Button>
            <Link to={routes.registration}>Регистрация</Link>
          </Space>
        </Form.Item>

        <Button
          className="centred"
          icon={<GoogleOutlined />}
          type="primary"
          onClick={() => signInWithGoogle()}
        >
          Войти через Google
        </Button>
        {googleError && (
          <Text type="danger">При входе произошла ошибка: {googleError.message}</Text>
        )}
        <Form.Item {...tailFormItemLayout}>
          <Space direction="vertical" style={{ width: "100%", marginTop: 20 }}>
            <Text italic>
              Нажав "Войти с помощью Email/Google" выше, вы подтверждаете, что прочитали и поняли, а
              также соглашаетесь с &nbsp;
              <Link to={routes.privacyPolicy}>cоглашением политикой конфиденциальности</Link>{" "}
              и&nbsp;
              <Link to={routes.privacy}>правила и условия</Link>
            </Text>
          </Space>
        </Form.Item>
      </Form>
    </BaseLayout>
  );
};
