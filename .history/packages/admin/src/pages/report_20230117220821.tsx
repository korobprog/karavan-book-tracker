import React, { useState } from "react";
import { useStore } from "effector-react";
import { useNavigate } from "react-router-dom";
import moment, { Moment } from "moment";
import {
  Button,
  List,
  Typography,
  Input,
  InputNumber,
  Space,
  Form,
  Select,
  Checkbox,
  DatePicker,
  Row,
} from "antd";
import { PlusOutlined, StarFilled, StarOutlined } from "@ant-design/icons";

import { routes } from "../shared/routes";
import { $books, $booksLoading, Book } from "common/src/services/books";
import { useUser } from "common/src/services/api/useUser";
import {
  addOperation,
  DistributedBook,
  OperationDoc,
} from "common/src/services/api/operations";
import { addLocation, useLocations } from "common/src/services/api/locations";
import { LocationSelect } from "common/src/components/LocationSelect";
import { useDebouncedCallback } from "use-debounce";
import { UserSelect } from "common/src/components/UserSelect";
import { useUsers } from "common/src/services/api/useUsers";
import { CurrentUser } from "common/src/services/api/useCurrentUser";
import { addOperationToLocationStatistic } from "common/src/services/locations";
import { BaseLayout } from "common/src/components/BaseLayout";

type FormValues = Record<number, number> & {
  locationId: string;
  userId: string;
  date: Moment;
};

type Props = {
  currentUser: CurrentUser;
};

const Report = ({ currentUser }: Props) => {
  const { profile, user, favorite } = currentUser;
  const { addStatistic, toggleFavorite } = useUser({ profile });

  const [searchString, setSearchString] = useState("");
  const [locationSearchString, setLocationSearchString] = useState("");
  const [userSearchString, setUserSearchString] = useState("");
  const [isOnline, setIsOnline] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();

  const books = useStore($books);
  const booksLoading = useStore($booksLoading);

  const { locations } = useLocations({
    searchString: locationSearchString,
  });
  const { usersDocData } = useUsers({
    searchString: userSearchString,
  });
  console.log(useUsers)

  const onOnlineChange = () => {
    setIsOnline(!isOnline);
  };

  const onLocationChange = useDebouncedCallback((value: string) => {
    setLocationSearchString(value.charAt(0).toUpperCase() + value.slice(1));
  }, 1000);

  const onUserChange = useDebouncedCallback((value: string) => {
    setUserSearchString(value);
    
  }, 1000);
  const { favoriteBooks, otherBooks } = books.reduce(
    ({ favoriteBooks, otherBooks }, book) => {
      if (book.name.toLowerCase().includes(searchString)) {
        if (favorite.includes(book.id)) {
          favoriteBooks.push(book);
        } else {
          otherBooks.push(book);
        }
      }

      return { favoriteBooks, otherBooks };
    },
    { favoriteBooks: [] as Book[], otherBooks: [] as Book[] }
  );

  const onAddNewLocation = () => {
    addLocation({
      name: locationSearchString,
    });
    setLocationSearchString("");
  };

  const onSearchChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    setSearchString(e.target.value.toLowerCase());
  };

  function onFinish(formValues: FormValues) {
    if (user && profile?.name && profile?.nameSpiritual) {
      setIsSubmitting(true);
      const { locationId, userId, date, ...bookIdsWithCounts } = formValues;

      let totalCount = 0;
      let totalPoints = 0;

      const operationBooks = Object.entries(bookIdsWithCounts).reduce(
        (acc, [id, count]) => {
          if (count) {
            totalCount += count;
            totalPoints +=
              (Number(books.find((book) => book.id === id)?.points) || 0) *
              count;
            acc.push({ bookId: Number(id), count });
          }
          return acc;
        },
        [] as DistributedBook[]
      );

      if (totalCount === 0) {
        setIsSubmitting(false);
        return;
      }

      const operation: OperationDoc = {
        userId,
        date: date.format(),
        locationId,
        userName:
          usersDocData?.find((value) => value.id === userId)?.name && usersDocData?.find((value) => value.id === userId)?.nameSpiritual  || "",
        books: operationBooks,
        totalCount,
        totalPoints,
        isAuthorized: true,
        isOnline,
      };

      Promise.all([
        addOperation(operation),
        // TODO: вынести в transactions
        operation.isAuthorized &&
          addStatistic({ count: totalCount, points: totalPoints }, userId),
        addOperationToLocationStatistic(operation, locations),
      ])
        .then(() => navigate(routes.reports))
        .finally(() => setIsSubmitting(false));
    }
  }

  const locationOptions = locations?.map((d) => (
    <Select.Option key={d.id}>{d.name}</Select.Option>
  ));

  const usersOptions = usersDocData?.map((d) => (
    <Select.Option key={d.id}>
     {d.name} {d.nameSpiritual}
    </Select.Option>
  ));

  const { Search } = Input;
  const { Title } = Typography;

  const [form] = Form.useForm();

  function onPlusClick(bookId: string) {
    const prevValue = form.getFieldValue(bookId) || 0;
    form.setFieldsValue({ [bookId]: prevValue + 1 });
  }

  return (
    <BaseLayout title="УЧЕТ КНИГ (АДМИН)" backPath={routes.root}>
      <Form
        name="basic"
        onFinish={onFinish}
        form={form}
        initialValues={{ date: moment() }}
      >
        <Title className="site-page-title" level={4}>
          Отметить распространненные книги
        </Title>
        <Form.Item
          name="userId"
          label="Пользователь"
          rules={[{ required: true }]}
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
          name="locationId"
          label="Место"
          rules={[
            {
              required: true,
              message: "Выберите или создайте новое место",
            },
          ]}
        >
          <LocationSelect
            onSearch={onLocationChange}
            onAddNewLocation={onAddNewLocation}
            locationSearchString={locationSearchString}
            // TODO: add onChange add to localStorage
          >
            {locationOptions}
          </LocationSelect>
        </Form.Item>
        <Space style={{ flexGrow: 1, marginRight: 8 }}>
          <Form.Item name="date">
            <DatePicker
              disabledDate={(current) => {
                let customDate = moment().add(1, "day").format("YYYY-MM-DD");
                return current && current > moment(customDate, "YYYY-MM-DD");
              }}
            />
          </Form.Item>
          <Form.Item>
            <Checkbox onChange={onOnlineChange} checked={isOnline}>
              Онлайн-распространение
            </Checkbox>
          </Form.Item>
        </Space>
        <Row>
          <Search
            placeholder="поиск книги"
            allowClear
            onChange={onSearchChange}
            value={searchString}
            style={{ flexGrow: 1, width: 200, marginRight: 8 }}
          />
          <Button type="primary" htmlType="submit" loading={isSubmitting}>
            {isSubmitting ? "Отправляем..." : "Отправить"}
          </Button>
        </Row>
        <List
          itemLayout="horizontal"
          dataSource={favoriteBooks}
          loading={booksLoading}
          locale={{
            emptyText: searchString
              ? "Не найдено избранного"
              : "Нажмите на ⭐, чтобы добавить в избранное",
          }}
          renderItem={(book) => (
            <List.Item
              actions={[
                <Button
                  onClick={() => toggleFavorite(book.id)}
                  icon={<StarFilled />}
                ></Button>,
              ]}
            >
              <List.Item.Meta
                title={book.name}
                description={book.points ? `Баллы: ${book.points}` : ""}
              />
              <Button
                onClick={() => onPlusClick(book.id)}
                icon={<PlusOutlined />}
                style={{ margin: 8 }}
              ></Button>
              <Form.Item name={book.id} noStyle>
                <InputNumber
                  min={0}
                  max={10000}
                  style={{ width: 70 }}
                  type="number"
                  inputMode="numeric"
                  pattern="\d*"
                />
              </Form.Item>
            </List.Item>
          )}
        />
        <List
          itemLayout="horizontal"
          dataSource={otherBooks}
          loading={booksLoading}
          locale={{ emptyText: "Не найдено книг" }}
          renderItem={(book) => (
            <List.Item
              actions={[
                <Button
                  onClick={() => toggleFavorite(book.id)}
                  icon={<StarOutlined />}
                ></Button>,
              ]}
            >
              <List.Item.Meta
                title={book.name}
                description={book.points ? `Баллы: ${book.points}` : ""}
              />
              <Button
                onClick={() => onPlusClick(book.id)}
                icon={<PlusOutlined />}
                style={{ margin: 8 }}
              ></Button>
              <Form.Item name={book.id} noStyle>
                <InputNumber
                  name={book.id}
                  min={0}
                  max={10000}
                  style={{ width: 70 }}
                  type="number"
                  inputMode="numeric"
                  pattern="\d*"
                />
              </Form.Item>
            </List.Item>
          )}
        />
      </Form>
    </BaseLayout>
  );
};

export default Report;
