import React from "react"
import { Form, Input, Button, Checkbox } from 'antd';
import GoogleButton from 'react-google-button'
import { useSignInWithGoogle } from "react-firebase-hooks/auth";
import { useSignInWithEmailAndPassword } from "react-firebase-hooks/auth";
import { getAuth } from "firebase/auth";


const Auth = () => {
  const auth = getAuth();
  const [signInWithGoogle, user] = useSignInWithGoogle(auth);
  console.log("user", user);

  const [signInWithEmailAndPassword, usersigned] = useSignInWithEmailAndPassword(auth);
  console.log("usersigned", usersigned);

  const onFinish = ({ email, password }: any) => {
    signInWithEmailAndPassword(email, password);
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };

  return (
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
        rules={[{ required: true, message: 'Please input your username!' }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Password"
        name="password"
        rules={[{ required: true, message: 'Please input your password!' }]}
      >
        <Input.Password />
      </Form.Item>

      <Form.Item name="remember" valuePropName="checked" wrapperCol={{ offset: 8, span: 16 }}>
        <Checkbox>Remember me</Checkbox>
      </Form.Item>

      <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>

        <GoogleButton onClick={() => signInWithGoogle()} />
      </Form.Item>
    </Form>
  );
};

export default Auth;