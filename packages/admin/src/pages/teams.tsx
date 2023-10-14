import { Button, Typography } from "antd";
import { UsergroupAddOutlined } from "@ant-design/icons";
import { generatePath } from "react-router-dom";
import { routes } from "../shared/routes";
import { useTransitionNavigate } from "common/src/utils/hooks/useTransitionNavigate";
import { CurrentUser } from "common/src/services/api/useCurrentUser";
import { useTeams } from "common/src/services/api/teams";
import { TeamCard } from "common/src/components/TeamCard";
import { useLocations } from "common/src/services/api/locations";
import { BaseLayout } from "common/src/components/BaseLayout";

type Props = {
  currentUser: CurrentUser;
};

export const Teams = ({ currentUser }: Props) => {
  const { profile } = currentUser;
  const { locationsHashMap } = useLocations();
  const navigate = useTransitionNavigate();
  const { teams, loading } = useTeams();
  const { Title } = Typography;
  const avatar = profile?.avatar;
  const onTeamAdd = () => {
    navigate(routes.teamsNew);
  };

  const onTeamEdit = (teamId: string) => {
    navigate(generatePath(routes.teamsEdit, { teamId }));
  };

  return (
    <BaseLayout title="Команды" isAdmin backPath={routes.root} avatar={avatar}>
      <Title className="site-page-title" level={2}>
        Команды
      </Title>
      <Button block size="large" type="primary" icon={<UsergroupAddOutlined />} onClick={onTeamAdd}>
        Добавить команду
      </Button>

      {teams.length === 0 && (
        <Title className="site-page-title" level={5}>
          {loading ? "Загрузка..." : "Команд еще нет"}
        </Title>
      )}
      {teams.map((team) => (
        <TeamCard
          key={team.id}
          team={team}
          locationsHashMap={locationsHashMap}
          onTeamEdit={onTeamEdit}
          isAdmin
        />
      ))}
    </BaseLayout>
  );
};
