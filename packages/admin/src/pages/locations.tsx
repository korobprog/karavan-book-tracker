import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { Button, Layout, PageHeader, Tooltip, Table, Divider } from "antd";
import { CalculatorOutlined, LogoutOutlined } from "@ant-design/icons";

import BbtLogo from "../images/bbt-logo.png";
import { routes } from "../shared/routes";
import { LocationDoc, useLocations } from "../firebase/useLocations";
import { LocationStatistic } from "../shared/components/LocationStatistic";
import { CurrentUser } from "../firebase/useCurrentUser";
import { getBookPointsMap, useBooks } from "../shared/helpers/getBooks";
import { CoordinatesEdit } from "../shared/components/CoordinatesEdit";
import { recalculateStatisticToLocations } from "../services/locations";

type Props = {
  currentUser: CurrentUser;
};

export const Locations = ({ currentUser }: Props) => {
  const navigate = useNavigate();
  const { locations, loading: locationsLoading } = useLocations({});

  const { books } = useBooks();
  const [isCalculating, setIsCalculating] = useState(false);

  const onLogout = () => {
    signOut(currentUser.auth);
  };

  const onCalculate = async () => {
    setIsCalculating(true);
    await recalculateStatisticToLocations(getBookPointsMap(books), locations);
    setIsCalculating(false);
  };

  const { Content, Footer, Header } = Layout;

  const columns = [
    {
      title: "Населенный пункт",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Страна",
      dataIndex: "country",
      key: "country",
    },
    {
      title: "Координаты",
      dataIndex: "coordinates",
      key: "coordinates",
      render: (
        _stat: LocationDoc["coordinates"],
        location: LocationDoc & { key: string }
      ) => <CoordinatesEdit location={location} locations={locations} />,
    },
    {
      title: "Распространено в 2022",
      dataIndex: "statistic",
      key: "statistic",
      render: (stat: LocationDoc["statistic"]) => (
        <LocationStatistic statistic={stat} />
      ),
    },
    // {
    //   title: "Действие",
    //   key: "action",
    //   render: (text: string, record: any) => <Button>Сделать что-то</Button>,
    // },
  ];

  const data =
    locations?.map((location, index) => ({
      ...location,
      key: location.id || String(index),
    })) || [];

  return (
    <Layout>
      <Header className="site-page-header">
        <PageHeader
          title="ГОРОДА НА КАРТЕ"
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
            icon={<CalculatorOutlined />}
            onClick={onCalculate}
            loading={isCalculating}
          >
            Пересчитать статистику
          </Button>

          <Divider dashed />

          <Table
            columns={columns}
            dataSource={data}
            loading={locationsLoading}
            scroll={{ x: true }}
          />
        </div>
      </Content>
      <Footer></Footer>
    </Layout>
  );
};
