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
import { useTranslation } from "react-i18next";

type Props = {
  currentUser: CurrentUser;
};

export const Team = ({ currentUser }: Props) => {
  const { t } = useTranslation();
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
          {t("team.loading")}
        </Title>
      ) : (
        <>
          <Title className="site-page-title" level={5}>
            {t("team.not_selected")}
          </Title>
          <Paragraph className="site-page-title">{t("team.not_selected_help")}</Paragraph>
        </>
      )}

      <Button block size="large" type="primary" icon={<UsergroupAddOutlined />} onClick={onTeamAdd}>
        {t("team.add_team")}
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
              {t("team.add_applications")}
            </Button>
          </TeamCard>
        );
      })}
    </>
  );

  return (
    <BaseLayout
      title={t("home.my_team")}
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
