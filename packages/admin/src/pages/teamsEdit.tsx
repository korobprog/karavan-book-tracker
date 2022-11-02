import { signOut } from "firebase/auth";
import { Button, Layout, PageHeader, Tooltip } from "antd";
import { LogoutOutlined } from "@ant-design/icons";
import BbtLogo from "../images/bbt-logo.png";
import { useNavigate, useParams } from "react-router-dom";
import { routes } from "../shared/routes";
import { CurrentUser } from "common/src/services/api/useCurrentUser";
import { saveTeam, TeamFormValues } from "common/src/services/teams";
import { TeamForm } from "../shared/components/forms/TeamForm";
import { useTeam } from "common/src/services/api/teams";

type Props = {
  currentUser: CurrentUser;
};

export const TeamsEdit = ({ currentUser }: Props) => {
  const { auth } = currentUser;
  const navigate = useNavigate();
  const { Content, Footer, Header } = Layout;

  const { teamId } = useParams();
  const { team, loading } = useTeam(teamId || "");
  console.log("🚀 ~ team", team);

  const onLogout = () => {
    signOut(auth);
  };

  const onFinish = async (formValues: TeamFormValues) => {
    await saveTeam({ team: formValues, teamId });
    navigate(routes.teams);
  };

  const initialValues: TeamFormValues | null = team
    ? {
        leaderId: team?.leader.id,
        location: team?.location,
        name: team?.name,
        currentLocation: team?.currentLocation,
      }
    : null;

  return (
    <Layout>
      <Header className="site-page-header">
        <PageHeader
          title="РЕДАКТИРОВАНИЕ КОМАНДЫ"
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
          {initialValues && !loading && (
            <TeamForm
              onFinishHandler={onFinish}
              initialValues={initialValues}
            />
          )}
        </div>
      </Content>

      <Footer></Footer>
    </Layout>
  );
};
