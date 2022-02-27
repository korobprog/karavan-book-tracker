import React, { useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { getAuth, signOut } from "firebase/auth";
import {
  Button,
  Divider,
  Layout,
  PageHeader,
  Tooltip,
  Typography,
  Form,
  Input,
  Select,
} from "antd";
import {
  ReadOutlined,
  LogoutOutlined,
  UserAddOutlined,
  MessageOutlined,
} from "@ant-design/icons";
import BbtLogo from "../images/bbt-logo.png";
import { useNavigate } from "react-router-dom";
import { routes } from "../shared/routes";
import { Spinner } from "../shared/components/Spinner";

const Profile = () => {
  const auth = getAuth();
  const [user, loading] = useAuthState(auth);
  const navigate = useNavigate();
  const { Content, Footer, Header, } = Layout;
  const { Title, Paragraph } = Typography;
  const { Option } = Select;

  useEffect(() => {
    if (!user && !loading) {
      navigate(routes.auth);
    }
  }, [user, loading, navigate]);

  if (!user) {
    return <Spinner />;
  }

  const onAddReport = () => {
    navigate(routes.report);
  };

  const onLogout = () => {
    signOut(auth);
  };

  const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
  };

  const prefixSelector = (
    <Form.Item name="prefix" noStyle>
      <Select style={{ width: 70 }}>
        <Option value="7">+7</Option>
        <Option value="3">+3</Option>
      </Select>
    </Form.Item>
  );
  

  return (
    <Layout>
      <Header className="site-page-header">
        <PageHeader
          title="УЧЕТ КНИГ"
          className="page-header"
          avatar={{ src: BbtLogo }}
          extra={[
            <Tooltip title="Выйти" key="logout">
              <Button
                type="ghost"
                shape="circle"
                icon={<LogoutOutlined />}
                onClick={onLogout}
              />
            </Tooltip>,
          ]}
        />
      </Header>

      <Content {...layout}   >
        <div className="site-layout-content">
          <Title className="site-page-title" level={2}>
            Привет, {user?.displayName || "друг"}
          </Title>
          <Paragraph>Заполните Ваш профиль Ф.И.О</Paragraph>

          <Form.Item
            name={["user", "name"]}
            label="Ваше имя"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="phone"
            label="Ваш телефон"
            rules={[
              { required: true, message: "Please input your phone number!" },
            ]}
          >
            <Input addonBefore={prefixSelector} style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 8 }}>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
        </div>
      </Content>
      
      <Footer></Footer>
    </Layout>
  );
};

export default Profile;
