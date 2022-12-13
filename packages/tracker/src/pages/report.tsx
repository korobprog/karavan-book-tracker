import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useGoogleSheets from "use-google-sheets";
import type { Moment } from "moment";
import {
  Button,
  List,
  Input,
  InputNumber,
  Form,
  Select,
  Checkbox,
  Row,
  Space,
  DatePicker,
} from "antd";
import { PlusOutlined, StarFilled, StarOutlined } from "@ant-design/icons";

import { routes } from "../shared/routes";
import { useUser } from "common/src/services/api/useUser";
import {
  addOperation,
  DistributedBook,
  OperationDoc,
} from "common/src/services/api/operations";
import { addLocation, useLocations } from "common/src/services/api/locations";
import { useDebouncedCallback } from "use-debounce";
import { CurrentUser } from "common/src/services/api/useCurrentUser";
import { addOperationToLocationStatistic } from "common/src/services/locations";
import { Book, getBookPointsMap, getBooks } from "common/src/services/books";
import { BaseLayout } from "common/src/components/BaseLayout";
import { LocationSelect } from "common/src/components/LocationSelect";
import moment from "moment";

type FormValues = Record<number, number> & {
  locationId: string;
  date: Moment;
};

type Props = {
  currentUser: CurrentUser;
};

export const Report = ({ currentUser }: Props) => {
  const { profile, favorite, user, loading, userDocLoading } = currentUser;
  const { addStatistic, toggleFavorite } = useUser({ profile });
  const [searchString, setSearchString] = useState("");
  const [locationSearchString, setLocationSearchString] = useState("");
  const [isOnline, setIsOnline] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();

  const { data, loading: booksLoading } = useGoogleSheets({
    apiKey: process.env.REACT_APP_GOOGLE_API_KEY as string,
    sheetId: process.env.REACT_APP_GOOGLE_SHEETS_ID as string,
  });

  const { locations } = useLocations({
    searchString: locationSearchString,
  });

  const onOnlineChange = () => {
    setIsOnline(!isOnline);
  };

  useEffect(() => {
    if (!user && !loading) {
      navigate(routes.auth);
    }
  }, [user, loading, navigate]);

  const onLocationChange = useDebouncedCallback((value: string) => {
    setLocationSearchString(value.charAt(0).toUpperCase() + value.slice(1));
  }, 1000);

  const books = getBooks(data);
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
    if (user && profile?.name) {
      setIsSubmitting(true);
      const { locationId, date, ...bookIdsWithCounts } = formValues;

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
        userId: user?.uid,
        date: date.format(),
        locationId,
        userName: profile?.name || "",
        books: operationBooks,
        totalCount,
        totalPoints,
        isAuthorized: true,
        isOnline,
      };

      Promise.all([
        addStatistic({ count: totalCount, points: totalPoints }),
        addOperation(operation),
        addOperationToLocationStatistic(
          operation,
          getBookPointsMap(books),
          locations
        ),
      ])
        .then(() => navigate(routes.statistic))
        .finally(() => setIsSubmitting(false));
    }
  }

  const locationOptions = locations?.map((d) => (
    <Select.Option key={d.id}>{d.name}</Select.Option>
  ));

  const { Search } = Input;

  const [form] = Form.useForm();

  function onPlusClick(bookId: string) {
    const prevValue = form.getFieldValue(bookId) || 0;
    form.setFieldsValue({ [bookId]: prevValue + 1 });
  }

  return (
    <BaseLayout
      title="ОТМЕТИТЬ КНИГИ"
      backPath={routes.root}
      userDocLoading={userDocLoading}
    >
      <Form
        name="basic"
        onFinish={onFinish}
        form={form}
        initialValues={{ date: moment() }}
      >
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
          <Button
            type="primary"
            htmlType="submit"
            loading={isSubmitting || userDocLoading}
          >
            {isSubmitting ? "Отправляем..." : "Отправить"}
          </Button>
        </Row>

        <List
          itemLayout="horizontal"
          dataSource={favoriteBooks}
          loadMore={booksLoading}
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
                  disabled={isSubmitting || userDocLoading}
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
          loading={booksLoading || userDocLoading}
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
