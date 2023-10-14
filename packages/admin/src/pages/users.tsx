import React, { useMemo, useState, useEffect } from "react";
import { generatePath } from "react-router-dom";
import {
  Select,
  Button,
  Table,
  Divider,
  Space,
  TableColumnsType,
  Popconfirm,
  Typography,
} from "antd";
import {
  CalculatorOutlined,
  DeleteOutlined,
  UserAddOutlined,
  EditOutlined,
} from "@ant-design/icons";

import { useUsers } from "common/src/services/api/useUsers";
import { LocationDoc, useLocations } from "common/src/services/api/locations";
import { mapDocsToHashTable } from "common/src/services/api/utils";
import { CurrentUser } from "common/src/services/api/useCurrentUser";
import { useUser, updateProfile } from "common/src/services/api/useUser";
import { BaseLayout } from "common/src/components/BaseLayout";
import { nowYear } from "common/src/services/year";
import { YearSwitch } from "common/src/components/YearSwitch";
import { routes } from "../shared/routes";
import { recalculateStatisticToUsers } from "common/src/services/statistic/user";
import { SortOrder } from "antd/lib/table/interface";
import { useTransitionNavigate } from "common/src/utils/hooks/useTransitionNavigate";

type Props = {
  currentUser: CurrentUser;
};

type Sorter = {
  columnKey?: string;
  field?: string;
  order?: SortOrder;
};

export const Users = ({ currentUser }: Props) => {
  const { profile } = currentUser;

  const navigate = useTransitionNavigate();
  const avatar = profile?.avatar;
  const { usersDocData, usersDocLoading } = useUsers({});
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

  const onEditUser = (userId: string) => {
    navigate(generatePath(routes.usersEdit, { userId }));
  };

  const [selectedYear, setSelectedYear] = useState(nowYear);

  const data =
    usersDocData?.map((user) => ({
      key: user.id,
      id: user.id,
      nameSpiritual: user.nameSpiritual,
      name: user.name,
      count: user.statistic?.[selectedYear]?.count || 0,
      points: user.statistic?.[selectedYear]?.points || 0,
      contacts: { phone: user.phone, email: user.email },
      city: (user.city && locationsHashTable[user.city]?.name) || user.city,
      address: user.address,
      role: user.role,
    })) || [];

  const columns: TableColumnsType<(typeof data)[0]> = [
    {
      title: "Духовное имя",
      dataIndex: "nameSpiritual",
      key: "nameSpiritual",
      sorter: (a: any, b: any) => a.nameSpiritual.localeCompare(b.nameSpiritual),
      sortOrder: sortedInfo.columnKey === "nameSpiritual" ? sortedInfo.order : null,
    },
    {
      title: "ФИО",
      dataIndex: "name",
      key: "name",
      sorter: (a: any, b: any) => a.name.localeCompare(b.name),
      sortOrder: sortedInfo.columnKey === "name" ? sortedInfo.order : null,
    },
    {
      title: "Книг",
      dataIndex: "count",
      key: "count",
      sorter: (a: any, b: any) => a.count - b.count,
      sortOrder: sortedInfo.columnKey === "count" ? sortedInfo.order : null,
    },
    {
      title: "Баллов",
      dataIndex: "points",
      key: "points",
      sorter: (a: any, b: any) => a.points - b.points,
      sortOrder: sortedInfo.columnKey === "points" ? sortedInfo.order : null,
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
      sortOrder: sortedInfo.columnKey === "city" ? sortedInfo.order : null,
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
      render: (_, record) => (
        <Select
          mode="multiple"
          style={{ width: "100%" }}
          placeholder="Выберите роли"
          defaultValue={() => {
            if (record.role) {
              return String(record?.role)
                .split(",")
                .map((role: any) => ({ label: role, value: role }));
            }
          }}
          onChange={(event) => {
            handleRoleChange(event, record.key);
          }}
          options={rolesDropDown.map((role: any) => ({ label: role, value: role }))}
        />
      ),
    },
    {
      title: "Действие",
      key: "action",
      fixed: "right",
      render: (text: string, record) => (
        <Space>
          <Button icon={<EditOutlined />} onClick={() => onEditUser(record.id)} />
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

  const rolesDropDown = ["admin", "authorized"];

  const handleRoleChange = (role: any, userId: any) => {
    updateProfile(userId, { role: role });
  };

  useEffect(() => {
    if (localStorage.getItem("admin-users-sort-key")) {
      setSortedInfo(JSON.parse(localStorage.getItem("admin-users-sort-key") || ""));
    }
  }, []);

  const onChange = (pagination: any, filters: any, sorter: any, extra: any) => {
    setSortedInfo(sorter);
    localStorage.setItem("admin-users-sort-key", JSON.stringify(sorter));
  };

  return (
    <BaseLayout title="Пользователи" isAdmin backPath={routes.root} avatar={avatar}>
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
