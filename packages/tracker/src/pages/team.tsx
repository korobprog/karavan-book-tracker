import { useNavigate } from "react-router-dom";
import { Button, Typography } from "antd";
import { CheckSquareOutlined } from "@ant-design/icons";

import { routes } from "../shared/routes";
import { CurrentUser } from "common/src/services/api/useCurrentUser";
import { useTeams } from "common/src/services/api/teams";
import { TeamCard } from "common/src/components/TeamCard";
import { useLocations } from "common/src/services/api/locations";
import { TeamMemberStatus, setUserTeam } from "common/src/services/api/useUser";
import { BaseLayout } from "common/src/components/BaseLayout";

type Props = {
  currentUser: CurrentUser;
};

export const Team = ({ currentUser }: Props) => {
  const { profile, userDocLoading } = currentUser;
  const { locationsHashMap } = useLocations();
const avatar = profile?.avatar;
  console.log("🚀 ~ file: team.tsx:21 ~ Team ~ avatar:", avatar)
  const navigate = useNavigate();
  const { teams, loading } = useTeams();

  const { Title, Paragraph } = Typography;

  const myTeamId = profile?.team?.id;
  const myStatus = profile?.team?.status;

  const myTeam = teams.find((team) => team.id === myTeamId);

  const onTeamEdit = () => {
    navigate(routes.teamEdit);
  };

  const teamNoSelectedBlock = (
    <>
      {loading || userDocLoading ? (
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
                setUserTeam(
                  { id: team.id, status: TeamMemberStatus.request },
                  profile?.id
                )
              }
              style={{ marginLeft: "auto" }}
              loading={userDocLoading}
            >
              Подать заявку
            </Button>
          </TeamCard>
        );
      })}
    </>
  );

  return (
    <BaseLayout
      title="МОЯ КОМАНДА"
      backPath={routes.root}
      userDocLoading={userDocLoading}
      profile={{
        avatar: avatar
      }}
    >
      {myTeam ? (
        <TeamCard
          key={myTeam.id}
          team={myTeam}
          locationsHashMap={locationsHashMap}
          myStatus={myStatus}
          onLeaveTeam={() => setUserTeam(null, profile?.id)}
          onTeamEdit={onTeamEdit}
        />
      ) : (
        teamNoSelectedBlock
      )}
    </BaseLayout>
  );
};
