import React from "react";
import { useNavigate } from "react-router-dom";
import { Button, Layout, PageHeader, Tooltip, Avatar } from "antd";
import { UserOutlined } from "@ant-design/icons";

import BbtLogo from "../images/bbt-logo.png";

import { UserDoc } from "../services/api/useUser";

type BaseLayoutProps = {
  title: string;
  backPath?: string;
  headerActions?: React.ReactNode;
  userDocLoading?: boolean;
  profile: UserDoc;
};

export const BaseLayout: React.FC<BaseLayoutProps> = (props) => {
  const { children, title, backPath, headerActions, userDocLoading, profile } = props;
  const avatar = profile.avatar;
  const { Content, Header } = Layout;
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
                {avatar ? (
                  <Button
                    type="ghost"
                    shape="circle"
                    icon={<Avatar src={avatar} />}
                    onClick={() => navigate("/profile")}
                    loading={userDocLoading}
                  />
                ) : (
                  <Button
                    type="ghost"
                    shape="circle"
                    icon={<UserOutlined />}
                    onClick={() => navigate("/profile")}
                    loading={userDocLoading}
                  />
                )}
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
