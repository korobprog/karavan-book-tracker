import React, { useState } from "react";
import { Button, Table, Divider } from "antd";
import { CalculatorOutlined } from "@ant-design/icons";

import { routes } from "../shared/routes";
import { LocationDoc, useLocations } from "common/src/services/api/locations";
import { LocationStatistic } from "common/src/components/LocationStatistic";
import { CurrentUser } from "common/src/services/api/useCurrentUser";
import { getBookPointsMap, useBooks } from "common/src/services/books";
import { CoordinatesEdit } from "common/src/components/CoordinatesEdit";
import { recalculateStatisticToLocations } from "common/src/services/locations";
import { BaseLayout } from "common/src/components/BaseLayout";

type Props = {
  currentUser: CurrentUser;
};

export const Locations = ({ currentUser }: Props) => {
  const { locations, loading: locationsLoading } = useLocations({});

  const { books } = useBooks();
  const [isCalculating, setIsCalculating] = useState(false);

  const onCalculate = async () => {
    setIsCalculating(true);
    await recalculateStatisticToLocations(getBookPointsMap(books), locations);
    setIsCalculating(false);
  };

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

  const dataWithoutCoords = data.filter((location) => !location.coordinates);

  return (
    <BaseLayout title="ГОРОДА НА КАРТЕ" backPath={routes.root}>
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
        dataSource={dataWithoutCoords}
        loading={locationsLoading}
        scroll={{ x: true }}
        pagination={{ pageSize: 100 }}
      />
      <Table
        columns={columns}
        dataSource={data}
        loading={locationsLoading}
        scroll={{ x: true }}
        pagination={{ pageSize: 100 }}
      />
    </BaseLayout>
  );
};
