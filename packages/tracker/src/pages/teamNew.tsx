import { useTransitionNavigate } from "common/src/utils/hooks/useTransitionNavigate";
import { routes } from "../shared/routes";
import { CurrentUser } from "common/src/services/api/useCurrentUser";
import { saveTeam, TeamFormValues } from "common/src/services/teams";
import { TeamForm } from "common/src/components/forms/TeamForm";
import { BaseLayout } from "common/src/components/BaseLayout";

type Props = {
  currentUser: CurrentUser;
};

export const TeamNew = ({ currentUser }: Props) => {
  const { profile } = currentUser;
  const navigate = useTransitionNavigate();
  const avatar = profile?.avatar;
  const onFinish = async (formValues: TeamFormValues) => {
    await saveTeam({ team: formValues });
    navigate(routes.team);
  };

  return (
    <BaseLayout title="Новая команда" isAdmin backPath={routes.team} avatar={avatar}>
      {profile && (
        <TeamForm
          onFinishHandler={onFinish}
          initialValues={{ leaderId: profile.id, name: "" }}
          leaderIdDisabled
        />
      )}
    </BaseLayout>
  );
};
