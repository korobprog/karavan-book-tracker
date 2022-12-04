import React from "react";
import { useNavigate } from "react-router-dom";
import { Button, Layout, PageHeader, Tooltip } from "antd";
import { UserOutlined } from "@ant-design/icons";

import BbtLogo from "../images/bbt-logo.png";

type BaseLayoutProps = {
  title: string;
  backPath?: string;
  headerActions?: React.ReactNode;
  userDocLoading?: boolean;
};

export const BaseLayout: React.FC<BaseLayoutProps> = (props) => {
  const { children, title, backPath, headerActions, userDocLoading } = props;
  const { Content, Footer, Header } = Layout;
  const navigate = useNavigate();
  const onBack = backPath ? () => navigate(backPath) : undefined;

  return (
    <Layout>
      <Header className="site-page-header">
        <PageHeader
          title={title}
          className="page-header"
          onBack={onBack}
          avatar={{ src: BbtLogo }}
          extra={
            headerActions ?? [
              <Tooltip title="Профиль" key="profile">
                <Button
                  type="ghost"
                  shape="circle"
                  icon={<UserOutlined />}
                  onClick={() => navigate("/profile")}
                  loading={userDocLoading}
                />
              </Tooltip>,
            ]
          }
        />
      </Header>

      <Content>
        <div className="site-layout-content">{children}</div>
      </Content>
      <Footer></Footer>
    </Layout>
  );
};
