import { useNavigate } from "react-router-dom";
import { routes } from "../shared/routes";
import { useUser } from "common/src/services/api/useUser";
import { CurrentUser } from "common/src/services/api/useCurrentUser";
import { BaseLayout } from "common/src/components/BaseLayout";
import { ProfileForm, ProfileFormValues } from "common/src/components/forms/profile/ProfileForm";
import { Typography } from "antd";

type Props = {
  currentUser: CurrentUser;
};

export const UsersNew = ({ currentUser }: Props) => {
  const { addNewUnattachedProfile } = useUser({ profile: currentUser.profile });
  const navigate = useNavigate();

  const onFinish = async (formValues: ProfileFormValues) => {
    addNewUnattachedProfile(formValues).then(() => navigate(routes.users));
  };

  return (
    <BaseLayout title="Новый пользователь" isAdmin backPath={routes.users}>
      <Typography.Text mark>Здесь создается не привязанный к емейлу профиль!</Typography.Text>
      <ProfileForm onFinish={onFinish} isEmailEditable />
    </BaseLayout>
  );
};
