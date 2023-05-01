import React, { useEffect } from "react";
import { getAuth, signOut } from "firebase/auth";
import { Button, Tooltip, Typography, Form, Input } from "antd";
import { LogoutOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { routes } from "../shared/routes";
import { useUser } from "common/src/services/api/useUser";
import { CurrentUser } from "common/src/services/api/useCurrentUser";
import { phoneNumberPattern } from "common/src/utils/patterns";
import { BaseLayout } from "common/src/components/BaseLayout";
import { SelectLocation } from "common/src/features/select-location/SelectLocation";

type Props = {
  currentUser: CurrentUser;
};

const Profile = ({ currentUser }: Props) => {
  const { setProfile } = useUser({ profile: currentUser.profile });
  const { profile, loading, user } = currentUser;
  const auth = getAuth();
  const navigate = useNavigate();
  const { Title, Paragraph } = Typography;


  useEffect(() => {
    if (!user && !loading) {
      navigate(routes.auth);
    }
  }, [user, loading, navigate]);

  const onLogout = () => {
    signOut(auth);
  };

  const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
  };

  const onFinish = ({ ...formValues }: any) => {
    setProfile({
      ...formValues,
    }).then(() => navigate(routes.root));
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <BaseLayout
      title="УЧЕТ КНИГ (АДМИН)"
      backPath={routes.root}
      headerActions={[
        <Tooltip title="Выйти" key="logout">
          <Button
            type="ghost"
            shape="circle"
            icon={<LogoutOutlined />}
            onClick={onLogout}
          />
        </Tooltip>,
      ]}
    >
      <Title className="site-page-title" level={2}>
        Привет, {profile?.name || user?.displayName || "друг"}
      </Title>
      <Form
        name="basic"
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
        {...layout}
      >
        <Paragraph>Обязательно заполните Ваш профиль</Paragraph>

        <Form.Item
          name="name"
          label="Ваше Ф.И.О"
          rules={[{ required: true }]}
          initialValue={profile?.name || user?.displayName || ""}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="nameSpiritual"
          label="Ваше духовное имя"
          rules={[{ required: false }]}
          initialValue={profile?.nameSpiritual || ""}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="city"
          label="Ваш город"
          rules={[{ required: true }]}
          initialValue={profile?.city || ""}
        >
          <SelectLocation />
        </Form.Item>
        <Form.Item
          name="phone"
          label="Ваш телефон"
          rules={[
            {
              required: true,
              message: "Пожалуйста, введите свой номер телефона!",
            },
            {
              pattern: phoneNumberPattern,
              message: "Пожалуйста, введите корректный номер",
            },
          ]}
          initialValue={profile?.phone || ""}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="address"
          label="Ваш адрес"
          rules={[{ required: false }]}
          initialValue={profile?.address || ""}
        >
          <Input />
        </Form.Item>
        <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 8 }}>
          <Button type="primary" htmlType="submit">
            СОХРАНИТЬ
          </Button>
        </Form.Item>
      </Form>
    </BaseLayout>
  );
};

export default Profile;
