import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import {
  Button,
  Layout,
  PageHeader,
  Tooltip,
  Table,
  Divider,
  Space,
  TableColumnsType,
  Popconfirm,
} from "antd";
import {
  DeleteOutlined,
  LogoutOutlined,
  UserAddOutlined,
} from "@ant-design/icons";

import BbtLogo from "../images/bbt-logo.png";
import { routes } from "../shared/routes";
import { useUsers } from "../firebase/useUsers";
import { LocationDoc, useLocations } from "../firebase/useLocations";
import { mapDocsToHashTable } from "../firebase/utils";
import { CurrentUser } from "../firebase/useCurrentUser";
import { useUser } from "../firebase/useUser";

type Props = {
  currentUser: CurrentUser;
};

export const Users = ({ currentUser }: Props) => {
  const { auth } = currentUser;

  const navigate = useNavigate();

  const { usersDocData, usersDocLoading } = useUsers({});
  const { deleteProfile } = useUser({ currentUser });
  const { locations, loading: locationLoading } = useLocations({});
  const locationsHashTable = useMemo(
    () => mapDocsToHashTable<LocationDoc>(locations),
    [locations]
  );

  const onLogout = () => {
    signOut(auth);
  };

  const onAddUser = () => {
    navigate(routes.usersNew);
  };

  const { Content, Footer, Header } = Layout;

  const data =
    usersDocData?.map((user) => ({
      key: user.id,
      nameSpiritual: user.nameSpiritual,
      name: user.name,
      count: user.statistic?.[2022].count,
      points: user.statistic?.[2022].points,
      phone: user.phone,
      city: (user.city && locationsHashTable[user.city]?.name) || user.city,
      address: user.address,
      role: user.role,
    })) || [];

  const columns: TableColumnsType<typeof data[0]> = [
    {
      title: "Духовное имя",
      dataIndex: "nameSpiritual",
      key: "nameSpiritual",
    },
    {
      title: "ФИО",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Книг",
      dataIndex: "count",
      key: "count",
    },
    {
      title: "Баллов",
      dataIndex: "points",
      key: "points",
    },
    {
      title: "Телефон",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Город",
      dataIndex: "city",
      key: "city",
    },
    {
      title: "Адрес",
      dataIndex: "address",
      key: "address",
    },
    {
      title: "Роль",
      dataIndex: "role",
      key: "role",
    },
    {
      title: "Действие",
      key: "action",
      render: (text: string, record) => (
        <Space>
          <Popconfirm
            title={`Удалить пользователя ${record.name}?`}
            onConfirm={() => {
              deleteProfile(record.key);
            }}
          >
            <Button danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Layout>
      <Header className="site-page-header">
        <PageHeader
          title="ПОЛЬЗОВАТЕЛИ"
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
          <Button
            block
            size="large"
            type="primary"
            icon={<UserAddOutlined />}
            onClick={onAddUser}
          >
            Добавить пользователя
          </Button>
          <Divider dashed />
          <Table
            columns={columns}
            dataSource={data}
            scroll={{ x: true }}
            loading={locationLoading || usersDocLoading}
          />
        </div>
      </Content>
      <Footer></Footer>
    </Layout>
  );
};
