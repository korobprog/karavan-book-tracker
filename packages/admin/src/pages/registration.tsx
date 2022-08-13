import React, { useEffect, useState } from "react";
import {
  Form,
  Input,
  Button,
  PageHeader,
  Layout,
  Checkbox,
  Typography,
  Space,
} from "antd";
import { useCreateUserWithEmailAndPassword } from "react-firebase-hooks/auth";
import BbtLogo from "../images/bbt-logo.png";
import { Link, useNavigate } from "react-router-dom";
import { routes } from "../shared/routes";
import { CurrentUser } from "../firebase/useCurrentUser";
import { AuthError } from "firebase/auth";

const RegistrationErrors = {
  "Firebase: Error (auth/email-already-in-use).":
    "Пользователь с таким email уже существует",
  "Firebase: Error (auth/invalid-email).": "Email не валиднный",
} as Record<string, string>;

const getErrorMessage = (error: AuthError) => {
  const customMessage = RegistrationErrors[error.message];
  return customMessage || `При регистрации произошла ошибка: ${error.message}`;
};

type Props = {
  currentUser: CurrentUser;
};

const Registration = ({ currentUser }: Props) => {
  const { auth, user } = currentUser;
  const [createUserWithEmailAndPassword, , , error] =
    useCreateUserWithEmailAndPassword(auth);
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Пользователь вошел
    if (user) {
      navigate(routes.auth);
    }
  }, [user, navigate]);

  const onFinish = ({ email, password }: any) => {
    setIsSubmitting(true);
    createUserWithEmailAndPassword(email, password).then(() => {
      setIsSubmitting(false);
    });
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };
  const { Content, Footer, Header } = Layout;
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
                  message: "Пожалуйста, введите свой адрес электронной почты!",
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
                { len: 6, message: "Пароль должен быть не менее 6 символов" },
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
                  message: "Пожалуйста, подтвердите свой пароль!",
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("password") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error("Два введенных вами пароля не совпадают!")
                    );
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

            <Space
              direction="vertical"
              align="center"
              style={{ width: "100%" }}
            >
              <Button
                type="primary"
                htmlType="submit"
                block
                loading={isSubmitting}
              >
                Зарегистрироваться и войти
              </Button>
              {error && <Text type="danger">{getErrorMessage(error)}</Text>}
              <Link to={routes.auth}>Уже есть аккаунт</Link>
            </Space>
          </Form>
        </div>
      </Content>
      <Footer></Footer>
    </Layout>
  );
};

export default Registration;
