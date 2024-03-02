import { useTransitionNavigate } from "common/src/utils/hooks/useTransitionNavigate";
import { Button, Typography } from "antd";
import { CheckSquareOutlined, UsergroupAddOutlined } from "@ant-design/icons";

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
  const navigate = useTransitionNavigate();
  const { teams, loading } = useTeams();
  const avatar = profile?.avatar;
  const { Title, Paragraph } = Typography;

  const myTeamId = profile?.team?.id;
  const myStatus = profile?.team?.status;

  const myTeam = teams.find((team) => team.id === myTeamId);

  const onTeamEdit = () => {
    navigate(routes.teamEdit);
  };

  const onTeamAdd = () => {
    navigate(routes.teamNew);
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
            Вы можете подать заявку на вступление в команду или создать новую
          </Paragraph>
        </>
      )}

      <Button block size="large" type="primary" icon={<UsergroupAddOutlined />} onClick={onTeamAdd}>
        Создать свою команду
      </Button>

      {teams.map((team) => {
        return (
          <TeamCard key={team.id} team={team} locationsHashMap={locationsHashMap}>
            <Button
              size="large"
              icon={<CheckSquareOutlined />}
              onClick={() =>
                setUserTeam({ id: team.id, status: TeamMemberStatus.request }, profile?.id)
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
      title="Моя команда"
      backPath={routes.root}
      userDocLoading={userDocLoading}
      avatar={avatar}
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
