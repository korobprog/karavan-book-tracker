import React, { useState } from "react";
import { useStore } from "effector-react";
import { Button, Table, Divider, Space, Typography, Popconfirm, TableColumnsType } from "antd";
import { CalculatorOutlined, DeleteOutlined } from "@ant-design/icons";

import { routes } from "../shared/routes";
import { LocationDoc, deleteLocation, useLocations } from "common/src/services/api/locations";
import { LocationStatistic } from "common/src/components/LocationStatistic";
import { CurrentUser } from "common/src/services/api/useCurrentUser";
import { $booksLoading } from "common/src/services/books";
import { CoordinatesEdit } from "common/src/components/CoordinatesEdit";
import { LocationNameEdit } from "common/src/components/LocationNameEdit";
import { recalculateStatisticToLocations } from "common/src/services/locations";
import { BaseLayout } from "common/src/components/BaseLayout";
import { YearSwitch } from "common/src/components/YearSwitch";
import { nowYear } from "common/src/services/year";

type Props = {
  currentUser: CurrentUser;
};

export const Locations = ({ currentUser }: Props) => {
  const { locations, loading: locationsLoading } = useLocations({});
  const [selectedYear, setSelectedYear] = useState(nowYear);

  const booksLoading = useStore($booksLoading);
  const [isCalculating, setIsCalculating] = useState(false);

  const onCalculate = async () => {
    setIsCalculating(true);
    await recalculateStatisticToLocations(locations);
    setIsCalculating(false);
  };

  const [deleteLoading, setDeleteLoading] = useState(false);
  const onRemoveLocation = async (locationId: string) => {
    setDeleteLoading(true);
    await deleteLocation(locationId);
    setDeleteLoading(false);
  };

  const data =
    locations?.map((location, index) => ({
      ...location,
      key: location.id || String(index),
    })) || [];

  const dataWithoutCoords = data.filter((location) => !location.coordinates);

  const columns: TableColumnsType<(typeof data)[0]> = [
    {
      title: "Населенный пункт",
      dataIndex: "name",
      key: "name",
      render: (_stat: LocationDoc["name"], locationData: LocationDoc & { key: string }) => (
        <LocationNameEdit locationData={locationData} />
      ),
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
      render: (_stat: LocationDoc["coordinates"], location: LocationDoc & { key: string }) => (
        <CoordinatesEdit location={location} locations={locations} />
      ),
    },
    {
      title: "Распространено",
      dataIndex: "statistic",
      key: "statistic",
      render: (stat: LocationDoc["statistic"]) => (
        <LocationStatistic statistic={stat} year={selectedYear} />
      ),
    },
    {
      title: "Действие",
      key: "action",
      render: (text: string, record) => (
        <Space>
          <Popconfirm
            title={`Удалить локацию?`}
            onConfirm={() => onRemoveLocation(String(record.key))}
          >
            <Button danger icon={<DeleteOutlined />} loading={deleteLoading} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <BaseLayout title="Города на карте" isAdmin backPath={routes.root}>
      <Button
        block
        size="large"
        type="primary"
        icon={<CalculatorOutlined />}
        onClick={onCalculate}
        loading={isCalculating || booksLoading}
      >
        Пересчитать статистику
      </Button>

      <Divider dashed />
      <Space>
        <Typography.Text>Статистика за</Typography.Text>
        <YearSwitch selectedYear={selectedYear} setSelectedYear={setSelectedYear} />
      </Space>

      <Divider dashed />
      {dataWithoutCoords.length > 0 && (
        <Table
          columns={columns}
          dataSource={dataWithoutCoords}
          loading={locationsLoading}
          scroll={{ x: true }}
          pagination={{ pageSize: 100 }}
        />
      )}
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
