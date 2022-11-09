import { useState } from "react";
import { signOut } from "firebase/auth";
import { Button, Layout, PageHeader, Tooltip, Form, Input, Select } from "antd";
import { LogoutOutlined } from "@ant-design/icons";
import BbtLogo from "../images/bbt-logo.png";
import { useNavigate } from "react-router-dom";
import { routes } from "../shared/routes";
import { useUser } from "common/src/services/api/useUser";
import { LocationSelect } from "common/src/components/LocationSelect";
import { addLocation, useLocations } from "common/src/services/api/locations";
import { useDebouncedCallback } from "use-debounce";
import { CurrentUser } from "common/src/services/api/useCurrentUser";

type Props = {
  currentUser: CurrentUser;
};

export const UsersNew = ({ currentUser }: Props) => {
  const { addNewUnattachedProfile } = useUser({ profile: currentUser.profile });
  const { auth } = currentUser;
  const navigate = useNavigate();
  const { Content, Footer, Header } = Layout;

  const [locationSearchString, setLocationSearchString] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { locations } = useLocations({
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
    addLocation({ name: locationSearchString });
    setLocationSearchString("");
  };

  const onFinish = ({ phone, prefix, ...formValues }: any) => {
    setIsSubmitting(true);
    addNewUnattachedProfile({
      ...formValues,
      phone,
    })
      .then(() => navigate(routes.users))
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
          title="СОЗДАНИЕ НОВОГО ПОЛЬЗОВАТЕЛЯ"
          className="page-header"
          onBack={() => navigate(routes.users)}
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
          <Form
            name="basic"
            initialValues={{ remember: true }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
            {...layout}
          >
            <Form.Item
              name="name"
              label="Ф.И.О"
              rules={[{ required: true }]}
              initialValue={""}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="nameSpiritual"
              label="Духовное имя"
              rules={[{ required: false }]}
              initialValue={""}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="city"
              label="Город"
              rules={[{ required: true }]}
              initialValue={""}
            >
              <LocationSelect
                onSearch={onLocationChange}
                onAddNewLocation={onAddNewLocation}
                locationSearchString={locationSearchString}
              >
                {locationOptions}
              </LocationSelect>
            </Form.Item>
            <Form.Item
              name="phone"
              label="Телефон"
              rules={[
                {
                  required: true,
                  message: "Пожалуйста, введите номер телефона!",
                },
              ]}
              initialValue={""}
            >
              <Input style={{ width: "100%" }} />
            </Form.Item>
            <Form.Item
              name="email"
              label="email"
              rules={[
                {
                  required: true,
                  message: "Пожалуйста, введите email",
                },
              ]}
              initialValue={""}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="address"
              label="Адрес"
              rules={[{ required: false }]}
              initialValue={""}
            >
              <Input />
            </Form.Item>

            <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 8 }}>
              <Button type="primary" htmlType="submit" loading={isSubmitting}>
                ДОБАВИТЬ
              </Button>
            </Form.Item>
          </Form>
        </div>
      </Content>

      <Footer></Footer>
    </Layout>
  );
};
