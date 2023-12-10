import React, { useEffect } from "react";
import { useTransitionNavigate } from "common/src/utils/hooks/useTransitionNavigate";
import { Button, Layout, Tooltip, Avatar, Typography } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { PageHeader } from "@ant-design/pro-layout";
import Logo from "../images/logo.png";

export type BaseLayoutProps = {
  title: string;
  backPath?: string;
  headerActions?: React.ReactNode[];
  userDocLoading?: boolean;
  avatar?: string;
  isAdmin?: boolean;
  version?: string;
};

export const BaseLayout = (props: React.PropsWithChildren<BaseLayoutProps>) => {
  const { children, title, backPath, headerActions, userDocLoading, isAdmin, avatar, version } =
    props;
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
          title={title}
          className="page-header"
          onBack={onBack}
          avatar={{ src: Logo, style: { minWidth: 32 } }}
          extra={[
            ...(version
              ? [
                  <Typography.Text key="version" type="secondary">
                    v.{version}
                  </Typography.Text>,
                ]
              : []),
            ...(headerActions ?? [
              <Tooltip title="Профиль" key="profile">
                <Button
                  type="text"
                  size="large"
                  shape="circle"
                  icon={avatar ? <Avatar src={avatar} size="large" /> : <UserOutlined />}
                  onClick={() => navigate("/profile")}
                  loading={userDocLoading}
                  style={{ padding: 0 }}
                />
              </Tooltip>,
            ]),
          ]}
        />
      </Header>
      <Content>
        <div className="site-layout-content">{userDocLoading ? "loading" : children}</div>
      </Content>
    </Layout>
  );
};
