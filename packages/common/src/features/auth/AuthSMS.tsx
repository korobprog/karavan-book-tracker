import React, { useEffect, useState } from "react";
import {
  Form,
  Button,
  Typography,
  Card,
  Space,
  Input,
} from "antd";
import { routes } from "../../../../tracker/src/shared/routes";
import { CurrentUser } from "common/src/services/api/useCurrentUser";
import { useNavigate } from "react-router-dom";
import { Reactphone } from "./Reactphone"

type Props = {
  currentUser: CurrentUser;
};

export const AuthSMS = ({ currentUser }: Props) => {
  const { auth, user, } = currentUser;
  //const { setProfile } = useUser({ profile, user });
  const [value, setValue] = useState()

  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate(routes.root);
    }
  }, [navigate, user]);

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };

  const { Title } = Typography;

  return (
    <Space direction="vertical" size="middle" align="center" style={{ display: 'flex' }}>
      <Card>
        <Title className="site-page-title" level={5}>
        Введите номер телефона
        </Title>
        <Form
          name="basic"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          initialValues={{ remember: true }}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Reactphone />
          <Button type="dashed" block size="middle">
            ПОЛУЧИТЬ SMS КОД
          </Button>
          
        </Form>
      </Card>
    </Space>
  );
};

