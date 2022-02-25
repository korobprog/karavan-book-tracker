import React from "react";
import {
  Form,
  Input,
  Button,
  Checkbox,
  Layout,
  PageHeader,
  Typography,
} from "antd";
import GoogleButton from "react-google-button";
import { useSignInWithGoogle } from "react-firebase-hooks/auth";
import { useSignInWithEmailAndPassword } from "react-firebase-hooks/auth";
import { getAuth } from "firebase/auth";
import BbtLogo from "../images/bbt-logo.png";
import { Link } from "react-router-dom";
import { routes } from "../shared/routes";

const Auth = () => {
  const auth = getAuth();
  const [signInWithGoogle, user] = useSignInWithGoogle(auth);
  console.log("user", user);

  const [signInWithEmailAndPassword, usersigned] =
    useSignInWithEmailAndPassword(auth);
  console.log("usersigned", usersigned);

  const onFinish = ({ email, password }: any) => {
    signInWithEmailAndPassword(email, password);
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };
  const { Header, Footer, Content } = Layout;
  const { Title } = Typography;

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
      <Title className="site-page-title" level={2}>
        ВХОД В УЧЕТ КНИГ
      </Title>
     
      <Content>
        <div className="site-layout-content">
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

            <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
              <Button type="primary" htmlType="submit">
                Войти
              </Button>
              <Link to={routes.registration}>регистрация</Link>
            </Form.Item>
           
            <GoogleButton
              className="site-page-google-button"
              label="Войти через Google"
              onClick={() => signInWithGoogle()}
            />
          </Form>
        </div>
      </Content>
      <Footer></Footer>
    </Layout>
  );
};

export default Auth;
