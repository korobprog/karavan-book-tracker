import { useNavigate } from "react-router-dom";
import {
  Button,
  Table,
  Divider,
  Space,
  TableColumnsType,
  Tag,
  Statistic as AntdStatistic,
  Row,
} from "antd";
import { PlusCircleOutlined, DeleteOutlined } from "@ant-design/icons";

import { routes } from "../shared/routes";
import {
  deleteOperation,
  OperationDoc,
  useMyOperations,
} from "common/src/services/api/operations";
import moment from "moment";
import { CurrentUser } from "common/src/services/api/useCurrentUser";
import { useLocations } from "common/src/services/api/locations";
import { useBooks } from "common/src/services/books";
import { BaseLayout } from "common/src/components/BaseLayout";

type Props = {
  currentUser: CurrentUser;
};

export const Statistic = ({ currentUser }: Props) => {
  const { loading, profile, user, userDocLoading } = currentUser;
  const navigate = useNavigate();
  const { booksHashMap, booksLoading } = useBooks();

  const { myOperationsDocData, loading: myOperationsLoading } = useMyOperations(
    user?.uid || ""
  );

  const statistic2022 = profile?.statistic?.[2022];

  const onAddOperation = () => {
    navigate(routes.report);
  };

  const data =
    myOperationsDocData
      ?.sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0))
      ?.map((operation, index) => ({
        key: operation.id || index,
        date: operation.date,
        isAuthorized: operation.isAuthorized,
        totalCount: operation.totalCount,
        books: operation.books,
        location: operation.locationId,
      })) || [];

  const { locations } = useLocations({});
  const columns: TableColumnsType<typeof data[0]> = [
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
      render: (locationId) =>
        locations.find((location) => location.id === locationId)?.name,
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
      title: "Действие",
      key: "action",
      render: (text: string, record) => (
        <Space>
          <Button
            danger
            icon={<DeleteOutlined />}
            onClick={() => deleteOperation(record.key)}
          />
        </Space>
      ),
    },
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
  ];

  return (
    <BaseLayout
      title="МОЯ СТАТИСТИКА"
      backPath={routes.root}
      userDocLoading={userDocLoading}
    >
      <Row justify="center" align="top">
        <Space size="large" split={<Divider type="vertical" />}>
          <AntdStatistic title="Год" value="2022" groupSeparator="" />
          <AntdStatistic title="Книг" value={statistic2022?.count} />
          <AntdStatistic title="Баллов" value={statistic2022?.points} />
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
