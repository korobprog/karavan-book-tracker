import React, { useEffect, useState } from "react";
import {
  Form,
  Input,
  Button,
  Typography,
  Row,
  notification,
  Tooltip,
} from "antd";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { routes } from "../shared/routes";
import { CurrentUser } from "common/src/services/api/useCurrentUser";
import { BaseLayout } from "common/src/components/BaseLayout";
import { LogoutOutlined } from "@ant-design/icons";

type Props = {
  currentUser: CurrentUser;
};

export const Reset = ({ currentUser }: Props) => {
  const auth = getAuth();
  const { user } = currentUser;
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (user) {
      navigate(routes.root);
    }
  }, [navigate, user]);

  const onFinish = ({ email }: any) => {
    setIsSubmitting(true);
    sendPasswordResetEmail(auth, email)
      .then(() => {
        // Тут при успехе покажем нотификацию
        notification.open({
          message: 'Письмо отправлено',
          description: `Зайдите на почту ${email} и пройдите по ссылке, чтобы восстановить пароль `,
        });
      })
      .catch((error) => {
        // Обработка ошибок
        notification.open({
          message: `Нету такого пользователя ${email}`,
        })
      });
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };

  const { Title } = Typography;

  return (
    <BaseLayout
      title="УЧЕТ КНИГ"
      backPath={routes.auth}
      headerActions={[
        <Tooltip title="Выйти" key="logout">
          <Button
            type="ghost"
            shape="circle"
            icon={<LogoutOutlined />}
          />
        </Tooltip>,
      ]}
    >
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
          <Row>
            <Input
              style={{ flexGrow: 1, width: 200, marginRight: 8 }}
            />
            <Button type="primary" htmlType="submit" loading={isSubmitting}>
              сбросить пароль
            </Button>
          </Row>
        </Form.Item>
      </Form>
    </BaseLayout>
  );
};
