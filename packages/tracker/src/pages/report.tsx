import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useGoogleSheets from "use-google-sheets";
import {
  Button,
  Layout,
  List,
  PageHeader,
  Tooltip,
  Typography,
  Input,
  InputNumber,
  Space,
  Form,
  Select,
  Checkbox,
} from "antd";
import {
  StarFilled,
  StarOutlined,
  UserOutlined,
} from "@ant-design/icons";

import BbtLogo from "../images/bbt-logo.png";
import { routes } from "../shared/routes";
import { useUser } from "common/src/services/api/useUser";
import {
  addOperation,
  DistributedBook,
  OperationDoc,
} from "common/src/services/api/operations";
import { addLocation, useLocations } from "common/src/services/api/locations";
import { LocationSelect } from "../shared/components/LocationSelect";
import { useDebouncedCallback } from "use-debounce";
import { CurrentUser } from "common/src/services/api/useCurrentUser";
import { addOperationToLocationStatistic } from "common/src/services/locations";
import { Book, getBookPointsMap, getBooks } from "common/src/services/books";

type FormValues = Record<number, number> & {
  locationId: string;
};

type Props = {
  currentUser: CurrentUser;
};

export const Report = ({ currentUser }: Props) => {
  const { profile, favorite, user, loading } = currentUser;
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
      const { locationId, ...bookIdsWithCounts } = formValues;

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
        date: new Date().toISOString(),
        locationId,
        userName: profile?.name || '',
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
        .then(() => navigate(routes.root))
        .finally(() => setIsSubmitting(false));
    }
  }

  const locationOptions = locations?.map((d) => (
    <Select.Option key={d.id}>{d.name}</Select.Option>
  ));

  const { Search } = Input;
  const { Content, Footer, Header } = Layout;
  const { Title } = Typography;

  return (
    <Layout>
      <Header className="site-page-header">
        <PageHeader
          title="УЧЕТ КНИГ"
          className="page-header"
          onBack={() => navigate(routes.root)}
          avatar={{ src: BbtLogo }}
          extra={[
            <Tooltip title="Профиль" key="profile">
              <Button
                type="ghost"
                shape="circle"
                icon={<UserOutlined />}
                onClick={() => navigate(routes.profile)}
              />
            </Tooltip>,
          ]}
        />
      </Header>

      <Content>
        <div className="site-layout-content">
          <Form name="basic" onFinish={onFinish}>
            <Title className="site-page-title" level={4}>
              Отметить распространненные книги
            </Title>

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
            <Form.Item>
              <Checkbox onChange={onOnlineChange} checked={isOnline}>
                Онлайн-распространение
              </Checkbox>
            </Form.Item>
            <Space>
              <Search
                placeholder="поиск книги"
                allowClear
                onChange={onSearchChange}
                value={searchString}
                style={{ width: 170 }}
              />
              <Button type="primary" htmlType="submit" loading={isSubmitting}>
                {isSubmitting ? "Отправляем..." : "Отправить"}
              </Button>
            </Space>

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
                    ></Button>,
                  ]}
                >
                  <List.Item.Meta
                    title={book.name}
                    description={book.points ? `Баллы: ${book.points}` : ""}
                  />
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
        </div>
      </Content>
      <Footer></Footer>
    </Layout>
  );
};
