import { useNavigate, useParams } from "react-router-dom";
import { routes } from "../shared/routes";
import { CurrentUser } from "common/src/services/api/useCurrentUser";
import { saveTeam, TeamFormValues } from "common/src/services/teams";
import { TeamForm } from "common/src/components/forms/TeamForm";
import { useTeam } from "common/src/services/api/teams";
import { BaseLayout } from "common/src/components/BaseLayout";

type Props = {
  currentUser: CurrentUser;
};

export const TeamsEdit = ({ currentUser }: Props) => {
  const { profile } = currentUser;
  const navigate = useNavigate();
  const avatar = profile?.avatar;
  const { teamId } = useParams();
  const { team, loading } = useTeam(teamId || "");

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
    <BaseLayout title="РЕДАКТИРОВАНИЕ КОМАНДЫ" backPath={routes.teams} avatar={avatar}>
      {initialValues && !loading && (
        <TeamForm onFinishHandler={onFinish} initialValues={initialValues} />
      )}
    </BaseLayout>
  );
};
