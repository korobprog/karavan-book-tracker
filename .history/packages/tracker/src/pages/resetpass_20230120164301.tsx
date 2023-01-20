import React, { useEffect, useState } from "react";
import {
  Form,
  Input,
  Button,
  Checkbox,
  Typography,
  Space,
} from "antd";
import { useSignInWithEmailAndPassword } from "react-firebase-hooks/auth";
import { Link, useNavigate } from "react-router-dom";
import { routes } from "../shared/routes";
import { CurrentUser } from "common/src/services/api/useCurrentUser";
import { BaseLayout } from "common/src/components/BaseLayout";

type Props = {
  currentUser: CurrentUser;
};

export const Reset = ({ currentUser }: Props) => {
  const { auth, user } = currentUser;
  const [signInWithEmailAndPassword, , , emailError] =
    useSignInWithEmailAndPassword(auth);
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
    <BaseLayout title="ВОСТАНОВЛЕНИ ПАРОЛЯ" headerActions={[]}>
      <Title className="site-page-title" level={4}>
        ВВЕДИТЕ СВОЙ EMAIL ДЛЯ СБРОСА ПАРОЛЯ
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
              message: "Пожалуйста, введите ваш email",
            },
          ]}

        >
          <Input /> <Button type="primary" htmlType="submit" loading={isSubmitting}>
            сбросить пароль
          </Button>
        </Form.Item>
      </Form>
    </BaseLayout>
  );
};
