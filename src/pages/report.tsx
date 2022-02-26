import React, { useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { getAuth, signOut } from "firebase/auth";
import { Button, Layout, List, PageHeader, Tooltip, Typography } from "antd";
import { LogoutOutlined, PlusCircleOutlined } from "@ant-design/icons";
import BbtLogo from "../images/bbt-logo.png";
import { useNavigate } from "react-router-dom";
import { routes } from "../shared/routes";
import { Spinner } from "../shared/components/Spinner";
import useGoogleSheets from "use-google-sheets";
import { getBooks } from "../shared/helpers/getBooks";

const Report = () => {
  const auth = getAuth();
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

  if (booksLoading) {
    return <Spinner />;
  }

  const onLogout = () => {
    signOut(auth);
  };

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
          <List
            itemLayout="horizontal"
            dataSource={books}
            renderItem={(book) => (
              <List.Item
                actions={[<Button icon={<PlusCircleOutlined />}></Button>]}
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
