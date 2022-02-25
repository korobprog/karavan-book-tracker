import React from "react";
import { Form, Input, Button, PageHeader, Layout, Checkbox } from "antd";
import { getAuth } from "firebase/auth";
import { useCreateUserWithEmailAndPassword } from "react-firebase-hooks/auth";
import BbtLogo from "../images/bbt-logo.png";
import { Content, Footer, Header } from "antd/lib/layout/layout";

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
  const { Content, Footer, Header } = Layout;
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
              rules={[{ required: true, message: "Please input your email!" }]}
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
          </Form>
        </div>
      </Content>
      <Footer></Footer>
    </Layout>
  );
};

export default Registration;
