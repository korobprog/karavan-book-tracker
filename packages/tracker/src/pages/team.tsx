import { useNavigate } from "react-router-dom";
import { Button, Layout, PageHeader, Tooltip, Typography } from "antd";
import { CheckSquareOutlined, UserOutlined } from "@ant-design/icons";

import BbtLogo from "../images/bbt-logo.png";
import { routes } from "../shared/routes";
import { CurrentUser } from "common/src/services/api/useCurrentUser";
import { useTeams } from "common/src/services/api/teams";
import { TeamCard } from "common/src/components/TeamCard";
import { useLocations } from "common/src/services/api/locations";
import { TeamMemberStatus, setUserTeam } from "common/src/services/api/useUser";

type Props = {
  currentUser: CurrentUser;
};

export const Team = ({ currentUser }: Props) => {
  const { profile } = currentUser;
  const { locationsHashMap } = useLocations();

  const navigate = useNavigate();
  const { teams, loading } = useTeams();

  const { Content, Footer, Header } = Layout;
  const { Title, Paragraph } = Typography;

  const myTeamId = profile?.team?.id;
  const myStatus = profile?.team?.status;

  const myTeam = teams.find((team) => team.id === myTeamId);


  const onTeamEdit = () => {
    navigate(routes.teamEdit);
  };


  const teamNoSelectedBlock = (
    <>
      {loading ? (
        <Title className="site-page-title" level={5}>
          Загрузка...
        </Title>
      ) : (
        <>
          <Title className="site-page-title" level={5}>
            Команда еще не выбрана
          </Title>
          <Paragraph className="site-page-title">
            Вы можете подать заявку на вступление в команду
          </Paragraph>
        </>
      )}

      {teams.map((team) => {
        return (
          <TeamCard
            key={team.id}
            team={team}
            locationsHashMap={locationsHashMap}
          >
            <Button
              size="large"
              icon={<CheckSquareOutlined />}
              onClick={() =>
                setUserTeam({ id: team.id, status: TeamMemberStatus.request }, profile.id)
              }
              style={{ marginLeft: "auto" }}
            >
              Подать заявку
            </Button>
          </TeamCard>
        );
      })}
    </>
  );

  return (
    <Layout>
      <Header className="site-page-header">
        <PageHeader
          title="МОЯ КОМАНДА"
          className="page-header"
          onBack={() => navigate(routes.root)}
          avatar={{ src: BbtLogo }}
          extra={[
            <Tooltip title="Профиль" key="profile">
              <Button
                type="ghost"
                shape="circle"
                icon={<UserOutlined />}
                onClick={() => navigate(routes.profile)}
              />
            </Tooltip>,
          ]}
        />
      </Header>

      <Content>
        <div className="site-layout-content">
          {myTeam ? (
            <TeamCard
              key={myTeam.id}
              team={myTeam}
              locationsHashMap={locationsHashMap}
              myStatus={myStatus}
              onLeaveTeam={() => setUserTeam(null, profile.id)}
              onTeamEdit={onTeamEdit}
            />
          ) : (
            teamNoSelectedBlock
          )}
        </div>
      </Content>

      <Footer></Footer>
    </Layout>
  );
};
