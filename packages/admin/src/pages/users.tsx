import React, { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Table, Divider, Space, TableColumnsType, Popconfirm, Typography } from "antd";
import { CalculatorOutlined, DeleteOutlined, UserAddOutlined } from "@ant-design/icons";

import { useUsers } from "common/src/services/api/useUsers";
import { LocationDoc, useLocations } from "common/src/services/api/locations";
import { mapDocsToHashTable } from "common/src/services/api/utils";
import { CurrentUser } from "common/src/services/api/useCurrentUser";
import { useUser } from "common/src/services/api/useUser";
import { BaseLayout } from "common/src/components/BaseLayout";
import { nowYear } from "common/src/services/year";
import { YearSwitch } from "common/src/components/YearSwitch";
import { routes } from "../shared/routes";
import { recalculateStatisticToUsers } from "common/src/services/statistic/user";

type Props = {
  currentUser: CurrentUser;
};

type Sorter = {
  columnKey?: String;
  field?: String;
  order?: String;
}

export const Users = ({ currentUser }: Props) => {
  const { profile } = currentUser;

  const navigate = useNavigate();

  const { usersDocData, usersDocLoading } = useUsers({});
  // console.log('usersDocData\n', usersDocData);
  const { deleteProfile } = useUser({ profile });
  const { locations, loading: locationLoading } = useLocations({});
  const locationsHashTable = useMemo(() => mapDocsToHashTable<LocationDoc>(locations), [locations]);

  const [isCalculating, setIsCalculating] = useState(false);
  const [sortedInfo, setSortedInfo] = useState<Sorter>({});
  const onCalculate = async () => {
    setIsCalculating(true);
    if (usersDocData) {
      await recalculateStatisticToUsers(usersDocData);
    }
    setIsCalculating(false);
  };

  const onAddUser = () => {
    navigate(routes.usersNew);
  };

  const [selectedYear, setSelectedYear] = useState(nowYear);

  const data =
    usersDocData?.map((user) => ({
      key: user.id,
      nameSpiritual: user.nameSpiritual,
      name: user.name,
      count: user.statistic?.[selectedYear]?.count || 0,
      points: user.statistic?.[selectedYear]?.points || 0,
      contacts: { phone: user.phone, email: user.email },
      city: (user.city && locationsHashTable[user.city]?.name) || user.city,
      address: user.address,
      role: user.role,
    })) || [];

  const columns: TableColumnsType<typeof data[0]> = [
    {
      title: "Духовное имя",
      dataIndex: "nameSpiritual",
      key: "nameSpiritual",
      sortOrder: sortedInfo.columnKey === 'nameSpiritual' ? sortedInfo?.order : null,
      sorter: (a: any, b: any) => a.nameSpiritual.localeCompare(b.nameSpiritual),
    },
    {
      title: "ФИО",
      dataIndex: "name",
      key: "name",
      sortOrder: sortedInfo.columnKey === 'name' ? sortedInfo?.order : null,
      sorter: (a: any, b: any) => a.name.localeCompare(b.name),
    },
    {
      title: "Книг",
      dataIndex: "count",
      key: "count",
      sortOrder: sortedInfo.columnKey === 'count' ? sortedInfo?.order : null,
      sorter: (a: any, b: any) => a.count - b.count,
    },
    {
      title: "Баллов",
      dataIndex: "points",
      key: "points",
      sortOrder: sortedInfo.columnKey === 'points' ? sortedInfo?.order : null,
      sorter: (a: any, b: any) => a.points - b.points,
    },
    {
      title: "Контакты",
      dataIndex: "contacts",
      key: "contacts",
      render: (contacts) => (
        <div>
          <div>{contacts.phone}</div>
          <div>{contacts.email}</div>
        </div>
      ),
    },
    {
      title: "Город",
      dataIndex: "city",
      key: "city",
      sorter: (a: any, b: any) => a.city.localeCompare(b.city),
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
  
  useEffect(() => {
    console.log(JSON.parse(localStorage.getItem('admin-users-sort-key') || ''));
    if(localStorage.getItem('admin-users-sort-key')){
      console.log('localStorage');
      setSortedInfo(JSON.parse(localStorage.getItem('admin-users-sort-key') || ''));
    }
  }, []);

  const onChange = (pagination: any, filters: any, sorter: any, extra: any) => {
    console.log('sorter\n', sorter);
    localStorage.setItem('admin-users-sort-key', JSON.stringify(sorter));
    console.log('localStorage');
    console.log(JSON.parse(localStorage.getItem('admin-users-sort-key') || ''));
  };

  const test = () => {
    console.log('SortedInfo\n', sortedInfo);
    console.log('SortedInfo\n', sortedInfo.columnKey);
    console.log('SortedInfo\n', sortedInfo.order);
  };
  
  return (
    <BaseLayout title="ПОЛЬЗОВАТЕЛИ" backPath={routes.root}>
      <Button block size="large" type="primary" icon={<UserAddOutlined />} onClick={onAddUser}>
        Добавить пользователя
      </Button>
      <Divider dashed />
      <Button
        block
        size="large"
        type="primary"
        icon={<CalculatorOutlined />}
        onClick={onCalculate}
        loading={isCalculating || usersDocLoading || locationLoading}
      >
        Пересчитать статистику
      </Button>

      <Divider dashed />
      <Space>
        <Typography.Text>Статистика за</Typography.Text>
        <YearSwitch selectedYear={selectedYear} setSelectedYear={setSelectedYear} />
      </Space>
      <Divider dashed />
      <Button onClick={test}>test</Button>
      <Table
        columns={columns}
        dataSource={data}
        scroll={{ x: true }}
        loading={locationLoading || usersDocLoading}
        onChange={onChange}
        pagination={{ pageSize: 100 }}
      />
    </BaseLayout>
  );
};
