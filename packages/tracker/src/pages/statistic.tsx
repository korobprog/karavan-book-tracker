import { useState } from "react";
import { generatePath, useNavigate } from "react-router-dom";
import {
  Button,
  Table,
  Divider,
  Space,
  TableColumnsType,
  Tag,
  Statistic as AntdStatistic,
  Row,
  Popconfirm,
} from "antd";
import {
  PlusCircleOutlined,
  DeleteOutlined,
  ShareAltOutlined,
  EditOutlined,
} from "@ant-design/icons";
import { useStore } from "effector-react";
import moment from "moment";

import { routes } from "../shared/routes";
import { OperationDoc, useMyOperations } from "common/src/services/api/operations";
import { removeOperationMultiAction } from "common/src/services/api/multiactions";
import { shareOperation } from "common/src/services/share";
import { CurrentUser } from "common/src/services/api/useCurrentUser";
import { useLocations } from "common/src/services/api/locations";
import { $booksHashMap, $booksLoading } from "common/src/services/books";
import { nowYear } from "common/src/services/year";
import { BaseLayout } from "common/src/components/BaseLayout";
import { YearSwitch } from "common/src/components/YearSwitch";

type Props = {
  currentUser: CurrentUser;
};

export const Statistic = ({ currentUser }: Props) => {
  const { loading, profile, user, userDocLoading } = currentUser;
  const navigate = useNavigate();
  const booksHashMap = useStore($booksHashMap);
  const booksLoading = useStore($booksLoading);

  const { myOperationsDocData, loading: myOperationsLoading } = useMyOperations(user?.uid || "");

  const { locations, locationsHashMap } = useLocations({});

  const [selectedYear, setSelectedYear] = useState(nowYear);
  const statistic = profile?.statistic?.[selectedYear];

  const onAddOperation = () => {
    navigate(routes.report);
  };

  const onEditOperation = (id: string) => {
    navigate(generatePath(routes.reportEdit, { operationId: id }));
  };

  const [deleteLoading, setDeleteLoading] = useState(false);
  const onRemoveOperation = async (operationId: string) => {
    setDeleteLoading(true);
    await removeOperationMultiAction(operationId);
    setDeleteLoading(false);
  };

  const share = ({ isOnline, totalCount, date, books, location }: DataType) => {
    const locationName = locationsHashMap?.[location]?.name || "";
    const total = totalCount;
    if (profile) {
      const params = {
        isOnline,
        total,
        date,
        books,
        locationName,
        profile,
        booksHashMap,
      };
      shareOperation(params);
    }
  };

  const data =
    myOperationsDocData
      ?.sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0))
      ?.map((operation) => ({
        key: operation.id,
        id: operation.id,
        date: operation.date,
        isAuthorized: operation.isAuthorized,
        totalCount: operation.totalCount,
        books: operation.books,
        isOnline: operation.isOnline,
        location: operation.locationId,
      })) || [];

  type DataType = (typeof data)[0];

  const columns: TableColumnsType<(typeof data)[0]> = [
    {
      title: "Дата",
      dataIndex: "date",
      key: "date",
      render: (date: string) => moment(date).calendar(),
    },
    {
      title: "Всего книг",
      dataIndex: "totalCount",
      key: "totalCount",
    },
    {
      title: "Город",
      dataIndex: "location",
      key: "location",
      // TODO: refactor to hashmap
      render: (locationId) => locations.find((location) => location.id === locationId)?.name,
    },
    {
      title: "Книги",
      dataIndex: "books",
      key: "books",
      render: (books: OperationDoc["books"]) => (
        <>
          {books.map((book, index) => {
            const color = index > 2 ? "geekblue" : "green";
            const bookName = booksHashMap[book.bookId]?.name;

            return (
              <Tag color={color} key={index}>
                {bookName} - {book.count} шт.
              </Tag>
            );
          })}
        </>
      ),
    },
    {
      title: "Статус",
      dataIndex: "isAuthorized",
      key: "isAuthorized",
      render: (status: boolean) =>
        status ? <Tag color="green">Подтвержден</Tag> : <Tag color="processing">Ожидание</Tag>,
    },
    {
      title: "Действие",
      key: "action",
      fixed: "right",
      render: (text: string, record) => (
        <Space>
          <Button icon={<ShareAltOutlined />} onClick={() => share(record)} type="default" />
          <Button
            icon={<EditOutlined />}
            loading={deleteLoading}
            onClick={() => onEditOperation(record.id)}
          />
          <Popconfirm
            title={`Удалить операцию?`}
            onConfirm={() => onRemoveOperation(String(record.key))}
          >
            <Button danger icon={<DeleteOutlined />} loading={deleteLoading} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <BaseLayout title="Моя статистика" backPath={routes.root} userDocLoading={userDocLoading}>
      <Row justify="center" align="middle">
        <Space split={<Divider type="vertical" />}>
          <YearSwitch selectedYear={selectedYear} setSelectedYear={setSelectedYear} />
          <AntdStatistic title="Книг" value={statistic?.count} loading={userDocLoading} />
          <AntdStatistic title="Баллов" value={statistic?.points} loading={userDocLoading} />
        </Space>
      </Row>
      <Divider dashed />
      <Button
        block
        size="large"
        type="primary"
        icon={<PlusCircleOutlined />}
        onClick={onAddOperation}
      >
        Добавить операцию
      </Button>
      <Divider dashed />
      <Table
        columns={columns}
        dataSource={data}
        loading={booksLoading || loading || myOperationsLoading}
        scroll={{ x: true }}
        pagination={{ pageSize: 100 }}
      />
    </BaseLayout>
  );
};
