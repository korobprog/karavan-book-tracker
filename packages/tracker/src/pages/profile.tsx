import React, { useState } from "react";
import { getAuth, signOut } from "firebase/auth";
import { Button, Typography, Form, Input, Tooltip } from "antd";
import { useNavigate } from "react-router-dom";
import { routes } from "../shared/routes";
import { useUser } from "common/src/services/api/useUser";
import { CurrentUser } from "common/src/services/api/useCurrentUser";
import { phoneNumberPattern } from "common/src/utils/patterns";
import { BaseLayout } from "common/src/components/BaseLayout";
import { LogoutOutlined } from "@ant-design/icons";
import { SelectLocation } from "common/src/features/select-location/SelectLocation";

type Props = {
  currentUser: CurrentUser;
};

const Profile = ({ currentUser }: Props) => {
  const { profile, user, userDocLoading } = currentUser;

  const { setProfile } = useUser({ profile, user });
  const auth = getAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { Title, Paragraph } = Typography;

  const onLogout = () => {
    signOut(auth);
  };

  const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
  };

  const onFinish = ({ ...formValues }: any) => {
    setIsSubmitting(true);
    setProfile({
      ...formValues,
      email: user?.email,
    })
      .then(() => navigate(routes.root))
      .finally(() => setIsSubmitting(false));
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <BaseLayout
      title="УЧЕТ КНИГ"
      backPath={routes.root}
      userDocLoading={userDocLoading}
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
        Ваш профиль
      </Title>
      {userDocLoading ? (
        <Title className="site-page-title" level={5}>
          Загрузка...
        </Title>
      ) : (
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
            name="email"
            label="Ваш email"
            initialValue={user?.email || ""}
          >
            <Input disabled />
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
            <Button
              type="primary"
              htmlType="submit"
              loading={isSubmitting || userDocLoading}
            >
              СОХРАНИТЬ
            </Button>
          </Form.Item>
        </Form>
      )}
    </BaseLayout>
  );
};

export default Profile;
