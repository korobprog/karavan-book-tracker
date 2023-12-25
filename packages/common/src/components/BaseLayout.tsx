import React, { useEffect } from "react";
import { useTransitionNavigate } from "common/src/utils/hooks/useTransitionNavigate";
import { Button, Layout, Tooltip, Avatar } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { PageHeader } from "@ant-design/pro-layout";
import { getViewTransitionStyles } from "../utils/transition";
import Logo from "../images/logo.png";

type BaseLayoutProps = {
  title: string;
  backPath?: string;
  headerActions?: React.ReactNode;
  userDocLoading?: boolean;
  avatar?: string;
  isAdmin?: boolean;
  transitionName?: string;
};

export const BaseLayout = (props: React.PropsWithChildren<BaseLayoutProps>) => {
  const { children, title, backPath, headerActions, userDocLoading, isAdmin, avatar } = props;
  const { Content, Header } = Layout;
  const navigate = useTransitionNavigate();
  const onBack = backPath ? () => navigate(backPath) : undefined;

  useEffect(() => {
    document.title = (isAdmin ? "Admin: " : "") + (title || "Karavan Book Tracker");
  }, [title, isAdmin]);

  return (
    <Layout>
      <Header className="site-page-header">
        <PageHeader
          title={<span style={getViewTransitionStyles("TitleTransition")}>{title}</span>}
          className="page-header"
          onBack={onBack}
          avatar={{
            src: Logo,
            style: { minWidth: 32, ...getViewTransitionStyles("logo-icon") },
          }}
          extra={
            headerActions ?? [
              <Tooltip title="Профиль" key="profile">
                <Button
                  type="text"
                  size="middle"
                  shape="circle"
                  icon={
                    avatar ? (
                      <Avatar src={avatar} style={getViewTransitionStyles("avatar")} />
                    ) : (
                      <UserOutlined />
                    )
                  }
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
    </Layout>
  );
};
