import React, { useEffect } from "react";
import { Form, Button, Typography, Card, Space } from "antd";
import { useSignInWithGoogle } from "react-firebase-hooks/auth";
import { routes } from "../../../../tracker/src/shared/routes";
import { CurrentUser } from "common/src/services/api/useCurrentUser";
import { GoogleOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

type Props = {
  currentUser: CurrentUser;
};

export const AuthGoogle = ({ currentUser }: Props) => {
  const { auth, user } = currentUser;
  const [signInWithGoogle, , , googleError] = useSignInWithGoogle(auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate(routes.root);
    }
  }, [navigate, user]);

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };

  const { Title, Text } = Typography;

  return (
    <Space direction="vertical" size="middle" style={{ display: "flex" }}>
      <Card>
        <Title className="site-page-title" level={5}>
          Быстрый вход и регистрация
        </Title>
        <Form
          name="basic"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          initialValues={{ remember: true }}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
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
        </Form>
      </Card>
    </Space>
  );
};
