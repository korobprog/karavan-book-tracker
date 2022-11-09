import { signOut } from "firebase/auth";
import { Button, Layout, PageHeader, Tooltip } from "antd";
import { LogoutOutlined } from "@ant-design/icons";
import BbtLogo from "../images/bbt-logo.png";
import { useNavigate } from "react-router-dom";
import { routes } from "../shared/routes";
import { CurrentUser } from "common/src/services/api/useCurrentUser";
import { saveTeam, TeamFormValues } from "common/src/services/teams";
import { TeamForm } from "common/src/components/forms/TeamForm";

type Props = {
  currentUser: CurrentUser;
};

export const TeamsNew = ({ currentUser }: Props) => {
  const { auth } = currentUser;
  const navigate = useNavigate();
  const { Content, Footer, Header } = Layout;

  const onLogout = () => {
    signOut(auth);
  };

  const onFinish = async (formValues: TeamFormValues) => {
    await saveTeam({ team: formValues });
    navigate(routes.teams);
  };

  return (
    <Layout>
      <Header className="site-page-header">
        <PageHeader
          title="СОЗДАНИЕ НОВОЙ КОМАНДЫ"
          className="page-header"
          onBack={() => navigate(routes.teams)}
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
          <TeamForm onFinishHandler={onFinish} />
        </div>
      </Content>

      <Footer></Footer>
    </Layout>
  );
};
