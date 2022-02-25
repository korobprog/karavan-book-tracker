import React from "react";
import {
  Form,
  Input,
  Button,
  PageHeader,
  Layout,
  Checkbox,
  Typography,
} from "antd";
import { getAuth } from "firebase/auth";
import { useCreateUserWithEmailAndPassword } from "react-firebase-hooks/auth";
import BbtLogo from "../images/bbt-logo.png";

const Registration = () => {
  const auth = getAuth();
  const [createUserWithEmailAndPassword, user] =
    useCreateUserWithEmailAndPassword(auth);
  console.log("user", user);

  const onFinish = ({ email, password }: any) => {
    createUserWithEmailAndPassword(email, password);
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };
  const { Content, Footer, Header} = Layout;
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
        СТРАНИЦА РЕГИСТРАЦИИ
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
              rules={[{ required: true, message: "Пожалуйста, введите свой адрес электронной почты!" }]}
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
        name="confirm"
        label="Подтвердить пароль"
        dependencies={['password']}
        hasFeedback
        rules={[
          {
            required: true,
            message: 'Пожалуйста, подтвердите свой пароль!',
          },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue('password') === value) {
                return Promise.resolve();
              }
              return Promise.reject(new Error('Два введенных вами пароля не совпадают!'));
            },
          }),
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
              Зарегистрироваться и войти
              </Button>
            </Form.Item>
          </Form>
        </div>
      </Content>
      <Footer></Footer>
    </Layout>
  );
};

export default Registration;
