import { useState } from "react";
import { signOut } from "firebase/auth";
import { Button, Layout, PageHeader, Tooltip, Form, Input, Select } from "antd";
import { LogoutOutlined } from "@ant-design/icons";
import BbtLogo from "../images/bbt-logo.png";
import { useNavigate } from "react-router-dom";
import { routes } from "../shared/routes";
import { LocationSelect } from "../shared/components/LocationSelect";
import { addLocation, useLocations } from "common/src/services/api/locations";
import { useDebouncedCallback } from "use-debounce";
import { CurrentUser } from "common/src/services/api/useCurrentUser";
import { addTeam } from "common/src/services/api/teams";
import { UserSelect } from "../shared/components/UserSelect";
import { useUsers } from "common/src/services/api/useUsers";
import { setUserTeam, TeamMemberStatus } from "common/src/services/api/useUser";

type Props = {
  currentUser: CurrentUser;
};

export const TeamsNew = ({ currentUser }: Props) => {
  const { auth } = currentUser;
  const navigate = useNavigate();
  const { Content, Footer, Header } = Layout;

  const [locationSearchString, setLocationSearchString] = useState("");
  const [userSearchString, setUserSearchString] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { locations } = useLocations({
    searchString: locationSearchString,
  });
  const { usersDocData } = useUsers({
    searchString: userSearchString,
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

  const onUserChange = useDebouncedCallback((value: string) => {
    setUserSearchString(value);
  }, 1000);

  const onFinish = ({ leaderId, ...formValues }: any) => {
    if (!usersDocData) {
      return;
    }

    const created = new Date().toISOString();
    const leader = usersDocData.find((user) => user.id === leaderId);

    // ! TODO: add founded date;
    // ! TODO: Добавить - выбор родительской команды

    if (leader) {
      setIsSubmitting(true);

      // TODO: Move to Service Layer
      addTeam({
        ...formValues,
        created,
        leader: {
          id: leader.id,
          name: leader.nameSpiritual || leader.name,
        },
        members: [leader.id],
      })
        .then((response) => {
          setUserTeam({ id: response.id, status: TeamMemberStatus.admin }, leader)
        }
        )
        .then(() => navigate(routes.teams))
        .finally(() => setIsSubmitting(false));
    }
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };

  const usersOptions = usersDocData?.map((d) => (
    <Select.Option key={d.id}>
      {d.name} {d.nameSpiritual}
    </Select.Option>
  ));

  const locationOptions = locations?.map((d) => (
    <Select.Option key={d.id}>{d.name}</Select.Option>
  ));

  return (
    <Layout>
      <Header className="site-page-header">
        <PageHeader
          title="СОЗДАНИЕ НОВОЙ КОМАНДЫ"
          className="page-header"
          onBack={() => navigate(routes.teams)}
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
              label="Название"
              rules={[{ required: true, message: "Введите название" }]}
              initialValue={""}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="leaderId"
              label="Лидер группы"
              rules={[{ required: true, message: "Выберите лидера" }]}
            >
              <UserSelect
                onSearch={onUserChange}
                onAddNewUser={() => navigate(routes.usersNew)}
                userSearchString={userSearchString}
              >
                {usersOptions}
              </UserSelect>
            </Form.Item>
            <Form.Item
              name="location"
              label="Место базирования"
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
              name="currentLocation"
              label="Текущее место пребывания"
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
