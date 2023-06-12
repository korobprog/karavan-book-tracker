import { useNavigate } from "react-router-dom";
import { routes } from "../shared/routes";
import { CurrentUser } from "common/src/services/api/useCurrentUser";
import { saveTeam, TeamFormValues } from "common/src/services/teams";
import { TeamForm } from "common/src/components/forms/TeamForm";
import { BaseLayout } from "common/src/components/BaseLayout";

type Props = {
  currentUser: CurrentUser;
};

export const TeamsNew = ({ currentUser }: Props) => {
  const { profile } = currentUser;
  const navigate = useNavigate();
  const avatar = profile?.avatar;
  const onFinish = async (formValues: TeamFormValues) => {
    await saveTeam({ team: formValues });
    navigate(routes.teams);
  };

  return (
    <BaseLayout title="СОЗДАНИЕ НОВОЙ КОМАНДЫ" backPath={routes.teams} avatar={avatar}>
      <TeamForm onFinishHandler={onFinish} />
    </BaseLayout>
  );
};
