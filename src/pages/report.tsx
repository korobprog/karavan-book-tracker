import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import { getAuth, signOut } from "firebase/auth";
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
} from "antd";
import { LogoutOutlined, StarFilled, StarOutlined } from "@ant-design/icons";

import BbtLogo from "../images/bbt-logo.png";
import { routes } from "../shared/routes";
import { Spinner } from "../shared/components/Spinner";
import { Book, getBooks } from "../shared/helpers/getBooks";
import { useUser } from "../firebase/useUser";
import {
  DistributedBook,
  OperationDoc,
  useOperations,
} from "../firebase/useOperations";
import { useLocations } from "../firebase/useLocations";
import { LocationSelect } from "../shared/components/LocationSelect";
import { useDebouncedCallback } from "use-debounce/lib";

type FormValues = Record<number, number> & {
  locationId: string;
};

const Report = () => {
  const auth = getAuth();
  const {
    profile,
    addStatistic,
    favorite,
    toggleFavorite,
    loading: userLoading,
  } = useUser();
  const [user, loading] = useAuthState(auth);
  const [searchString, setSearchString] = useState("");
  const [locationSearchString, setLocationSearchString] = useState("");

  const navigate = useNavigate();

  const { data, loading: booksLoading } = useGoogleSheets({
    apiKey: process.env.REACT_APP_GOOGLE_API_KEY as string,
    sheetId: process.env.REACT_APP_GOOGLE_SHEETS_ID as string,
  });

  const { addOperation } = useOperations();
  const { addLocation, locationsDocData } = useLocations({
    searchString: locationSearchString,
  });

  useEffect(() => {
    if (!user && !loading) {
      navigate(routes.auth);
    }
  }, [user, loading, navigate]);

  const onLocationChange = useDebouncedCallback((value: string) => {
    setLocationSearchString(value.charAt(0).toUpperCase() + value.slice(1));
  }, 1000);

  if (booksLoading || userLoading) {
    return <Spinner />;
  }

  const onLogout = () => {
    signOut(auth);
  };

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
    if (user && profile.name) {
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

      const operation: OperationDoc = {
        userId: user?.uid,
        date: new Date().toISOString(),
        locationId,
        userName: profile.name,
        books: operationBooks,
        totalCount,
        totalPoints,
        isAuthorized: true,
      };

      Promise.all([
        addStatistic({ count: totalCount, points: totalPoints }),
        addOperation(operation),
      ]).then(() => navigate(routes.root));
    }
  }

  const locationOptions = locationsDocData?.map((d) => (
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
            <Tooltip title="Выйти" key="logout">
              <Button
                type="ghost"
                shape="circle"
                icon={<LogoutOutlined />}
                onClick={onLogout}
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
              rules={[{ required: true }]}
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
            <Space>
              <Search
                placeholder="поиск книги"
                allowClear
                onChange={onSearchChange}
                value={searchString}
                style={{ width: 170 }}
              />
              <Button type="primary" htmlType="submit">
                Отправить
              </Button>
            </Space>

            <List
              itemLayout="horizontal"
              dataSource={favoriteBooks}
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
                    <InputNumber min={0} max={10000} style={{ width: 70 }} />
                  </Form.Item>
                </List.Item>
              )}
            />
            <List
              itemLayout="horizontal"
              dataSource={otherBooks}
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

export default Report;
