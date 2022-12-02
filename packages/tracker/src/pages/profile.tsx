import React, { useState } from "react";
import { getAuth, signOut } from "firebase/auth";
import {
  Button,
  Layout,
  PageHeader,
  Tooltip,
  Typography,
  Form,
  Input,
  Select,
} from "antd";
import { LogoutOutlined } from "@ant-design/icons";
import BbtLogo from "../images/bbt-logo.png";
import { useNavigate } from "react-router-dom";
import { routes } from "../shared/routes";
import { useUser } from "common/src/services/api/useUser";
import { LocationSelect } from "../shared/components/LocationSelect";
import { addLocation, useLocations } from "common/src/services/api/locations";
import { useDebouncedCallback } from "use-debounce";
import { CurrentUser } from "common/src/services/api/useCurrentUser";
import { phoneNumberPattern } from "common/src/utils/patterns";

type Props = {
  currentUser: CurrentUser;
};

const Profile = ({ currentUser }: Props) => {
  const { profile, user } = currentUser;
  console.log("🚀 ~ currentUser", currentUser)
  console.log("🚀 ~ profile", profile)
  const { setProfile } = useUser({ profile });
  const auth = getAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { Content, Footer, Header } = Layout;
  const { Title, Paragraph } = Typography;

  const [locationSearchString, setLocationSearchString] = useState("");
  const { locations, loading: locationsLoading } = useLocations({
    searchString: locationSearchString,
  });

  const onLocationChange = useDebouncedCallback((value: string) => {
    setLocationSearchString(value.charAt(0).toUpperCase() + value.slice(1));
  }, 1000);

  const onLogout = () => {
    signOut(auth);
  };

  const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
  };

  const onAddNewLocation = () => {
    addLocation({
      name: locationSearchString,
    });
    setLocationSearchString("");
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

  const locationOptions = locations?.map((d) => (
    <Select.Option key={d.id}>{d.name}</Select.Option>
  ));

  return (
    <Layout>
      <Header className="site-page-header">
        <PageHeader
          title="УЧЕТ КНИГ"
          className="page-header"
          onBack={() => navigate(routes.root)}
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

      <Content>
        <div className="site-layout-content">
          <Title className="site-page-title" level={2}>
            Ваш профиль
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
              <LocationSelect
                onSearch={onLocationChange}
                onAddNewLocation={onAddNewLocation}
                locationSearchString={locationSearchString}
                loading={locationsLoading}
              >
                {locationOptions}
              </LocationSelect>
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
              <Button type="primary" htmlType="submit" loading={isSubmitting}>
                СОХРАНИТЬ
              </Button>
            </Form.Item>
          </Form>
        </div>
      </Content>

      <Footer></Footer>
    </Layout>
  );
};

export default Profile;
