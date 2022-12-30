import { useNavigate } from "react-router-dom";
import useGoogleSheets from "use-google-sheets";
import {
  Button,
  Table,
  Divider,
  Space,
  TableColumnsType,
  Tag,
  Popconfirm,
} from "antd";
import { PlusCircleOutlined, DeleteOutlined } from "@ant-design/icons";

import { removeOperationTransaction } from "common/src/services/api/transactions";
import { routes } from "../shared/routes";
import { useOperations } from "common/src/services/api/operations";
import moment from "moment";
import { CurrentUser } from "common/src/services/api/useCurrentUser";
import { useLocations } from "common/src/services/api/locations";
import { BaseLayout } from "common/src/components/BaseLayout";
import { useState } from "react";

type Props = {
  currentUser: CurrentUser;
};

export const Reports = ({ currentUser }: Props) => {
  const { loading } = currentUser;
  const navigate = useNavigate();
  const { loading: booksLoading } = useGoogleSheets({
    apiKey: process.env.REACT_APP_GOOGLE_API_KEY as string,
    sheetId: process.env.REACT_APP_GOOGLE_SHEETS_ID as string,
  });

  const { operationsDocData, loading: operationLoading } = useOperations();

  const onAddOperation = () => {
    navigate(routes.report);
  };

  const [deleteLoading, setDeleteLoading] = useState(false);
  const onRemoveOperation = async (operationId: string) => {
    setDeleteLoading(true);
    await removeOperationTransaction(operationId);
    setDeleteLoading(false);
  };

  const data =
    operationsDocData?.map((operation, index) => ({
      key: operation.id || index,
      date: operation.date,
      isAuthorized: operation.isAuthorized,
      name: operation.userName,
      totalCount: operation.totalCount,
      books: operation.books,
      location: operation.locationId,
    })) || [];

  const { locations } = useLocations({});
  const columns: TableColumnsType<typeof data[0]> = [
    {
      title: "Статус",
      dataIndex: "isAuthorized",
      key: "isAuthorized",
      render: (status: boolean) =>
        status ? (
          <Tag color="green">Подтвержден</Tag>
        ) : (
          <Tag color="processing">Ожидание</Tag>
        ),
    },
    {
      title: "Дата",
      dataIndex: "date",
      key: "date",
      render: (date: string) => moment(date).calendar(),
    },
    {
      title: "Пользователь",
      dataIndex: "name",
      key: "name",
      render: (text: string) => text,
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
      render: (locationId) =>
        locations.find((location) => location.id === locationId)?.name,
    },
    // {
    //   title: "Книги",
    //   dataIndex: "books",
    //   key: "books",
    //   render: (books: OperationDoc['books']) => (
    //     <>
    //       {books.map((book, index) => {
    //         let color = index > 2 ? "geekblue" : "green";

    //         return (
    //           <Tag color={color} key={index}>
    //             id {book.bookId} - {book.count} шт.
    //           </Tag>
    //         );
    //       })}
    //     </>
    //   ),
    // },
    {
      title: "Действие",
      key: "action",
      render: (text: string, record) => (
        <Space>
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
    <BaseLayout title="ПОСЛЕДНИЕ ОПЕРАЦИИ" backPath={routes.root}>
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
        loading={booksLoading || loading || operationLoading}
        scroll={{ x: true }}
        pagination={{ pageSize: 100 }}
      />
    </BaseLayout>
  );
};
