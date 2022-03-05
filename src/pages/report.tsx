import React, { useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import { getAuth, signOut } from "firebase/auth";
import useGoogleSheets from "use-google-sheets";
import { Button, Layout, List, PageHeader, Tooltip, Typography, Input, Space  } from "antd";
import { LogoutOutlined, StarFilled, StarOutlined, AudioOutlined } from "@ant-design/icons";

import BbtLogo from "../images/bbt-logo.png";
import { routes } from "../shared/routes";
import { Spinner } from "../shared/components/Spinner";
import { Book, getBooks } from "../shared/helpers/getBooks";
import { useUser } from "../firebase/api";

const Report = () => {
  const auth = getAuth();
  const { favorite, toggleFavorite, loading: userLoading } = useUser();
  const [user, loading] = useAuthState(auth);

  const navigate = useNavigate();
  const { Content, Footer, Header } = Layout;
  const { Title } = Typography;
  const { data, loading: booksLoading } = useGoogleSheets({
    apiKey: process.env.REACT_APP_GOOGLE_API_KEY as string,
    sheetId: process.env.REACT_APP_GOOGLE_SHEETS_ID as string,
  });
  const books = getBooks(data);

  useEffect(() => {
    if (!user && !loading) {
      navigate(routes.auth);
    }
  }, [user, loading, navigate]);

  if (booksLoading || userLoading) {
    return <Spinner />;
  }

  const onLogout = () => {
    signOut(auth);
  };

  const { favoriteBooks, otherBooks } = books.reduce(
    ({ favoriteBooks, otherBooks }, book) => {
      if (favorite.includes(book.id)) {
        favoriteBooks.push(book);
      } else {
        otherBooks.push(book);
      }

      return { favoriteBooks, otherBooks };
    },
    { favoriteBooks: [] as Book[], otherBooks: [] as Book[] }
  );

  const { Search } = Input;
  const onSearch = (value: string) => console.log(value);


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
          <Title className="site-page-title" level={4}>
            Отметить распространненные книги
          </Title>
          <Search placeholder="input search text" allowClear onSearch={onSearch} style={{ width: 200 }} />
         
          <List
            itemLayout="horizontal"
            dataSource={favoriteBooks}
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
              </List.Item>
            )}
          />
          <List
            itemLayout="horizontal"
            dataSource={otherBooks}
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
              </List.Item>
            )}
          />
        </div>
      </Content>
      <Footer></Footer>
    </Layout>
  );
};

export default Report;
