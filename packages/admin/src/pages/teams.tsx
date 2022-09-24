import { getAuth, signOut } from "firebase/auth";
import { Button, Layout, PageHeader, Tooltip, Typography } from "antd";
import { LogoutOutlined, UsergroupAddOutlined } from "@ant-design/icons";
import BbtLogo from "../images/bbt-logo.png";
import { useNavigate } from "react-router-dom";
import { routes } from "../shared/routes";
import { CurrentUser } from "common/src/services/api/useCurrentUser";
import { useTeams } from "common/src/services/api/teams";
import { TeamCard } from "common/src/components/TeamCard";
import { useLocations } from "common/src/services/api/locations";

type Props = {
  currentUser: CurrentUser;
};

export const Teams = ({ currentUser }: Props) => {
  const { locationsHashMap } = useLocations();
  const auth = getAuth();
  const navigate = useNavigate();
  const { teams, loading } = useTeams();
  const { Content, Footer, Header } = Layout;
  const { Title } = Typography;

  const onTeamAdd = () => {
    navigate(routes.teamsNew);
  };

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
          <Title className="site-page-title" level={2}>
            Команды
          </Title>
          <Button
            block
            size="large"
            type="primary"
            icon={<UsergroupAddOutlined />}
            onClick={onTeamAdd}
          >
            Добавить команду
          </Button>

          {teams.length === 0 && (
            <Title className="site-page-title" level={5}>
              {loading ? 'Загрузка...' : 'Команд еще нет'}
            </Title>
          )}
          {teams.map((team) => (
            <TeamCard
              key={team.id}
              team={team}
              locationsHashMap={locationsHashMap}
            />
          ))}
        </div>
      </Content>

      <Footer></Footer>
    </Layout>
  );
};
