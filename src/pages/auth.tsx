import React from "react";
import { Form, Input, Button, Checkbox, Layout, PageHeader } from "antd";
import GoogleButton from "react-google-button";
import { useSignInWithGoogle } from "react-firebase-hooks/auth";
import { useSignInWithEmailAndPassword } from "react-firebase-hooks/auth";
import { getAuth } from "firebase/auth";
import BbtLogo from "../images/bbt-logo.png";

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
                { required: true, message: "Please input your username!" },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Password"
              name="password"
              rules={[
                { required: true, message: "Please input your password!" },
              ]}
            >
              <Input.Password />
            </Form.Item>

            <Form.Item
              name="remember"
              valuePropName="checked"
              wrapperCol={{ offset: 8, span: 16 }}
            >
              <Checkbox>Remember me</Checkbox>
            </Form.Item>

            <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
              <Button type="primary" htmlType="submit">
                Submit
              </Button>
            </Form.Item>
            <GoogleButton onClick={() => signInWithGoogle()} />
          </Form>
        </div>
      </Content>
      <Footer></Footer>
    </Layout>
  );
};

export default Auth;
