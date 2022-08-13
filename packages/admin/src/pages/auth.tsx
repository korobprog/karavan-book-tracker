import React, { useEffect, useState } from "react";
import {
  Form,
  Input,
  Button,
  Checkbox,
  Layout,
  PageHeader,
  Typography,
  Space,
} from "antd";
import { useSignInWithGoogle } from "react-firebase-hooks/auth";
import { useSignInWithEmailAndPassword } from "react-firebase-hooks/auth";
import BbtLogo from "../images/bbt-logo.png";
import { Link, useNavigate } from "react-router-dom";
import { routes } from "../shared/routes";
import { CurrentUser } from "../firebase/useCurrentUser";
import { GoogleOutlined } from "@ant-design/icons";

type Props = {
  currentUser: CurrentUser;
};

const Auth = ({ currentUser }: Props) => {
  const { auth, user } = currentUser;
  const [signInWithGoogle, , , googleError] = useSignInWithGoogle(auth);
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

  const { Header, Footer, Content } = Layout;
  const { Title, Text } = Typography;

  return (
    <Layout>
      <Header className="site-page-header">
        <PageHeader
          title="УЧЕТ КНИГ"
          subTitle="Караван Прабхупады"
          className="page-header"
          avatar={{ src: BbtLogo }}
        />
      </Header>

      <Content>
        <div className="site-layout-content">
          <Title className="site-page-title" level={2}>
            ВХОД В УЧЕТ КНИГ
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
                  message: "Пожалуйста, введите ваше имя пользователя!",
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Пароль"
              name="password"
              rules={[
                { required: true, message: "Пожалуйста, введите ваш пароль!" },
              ]}
            >
              <Input.Password />
            </Form.Item>

            <Form.Item
              name="remember"
              valuePropName="checked"
              wrapperCol={{ offset: 8, span: 16 }}
            >
              <Checkbox>Запомни меня</Checkbox>
            </Form.Item>

            <Form.Item
              wrapperCol={{ offset: 8, span: 16 }}
              help={
                emailError && (
                  <Text type="danger">Неверный логин или пароль</Text>
                )
              }
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
              <Text type="danger">
                При входе произошла ошибка: {googleError.message}
              </Text>
            )}
          </Form>
        </div>
      </Content>
      <Footer></Footer>
    </Layout>
  );
};

export default Auth;
