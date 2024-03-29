import React from "react";
import { getAuth, signOut } from "firebase/auth";
import { Button, Tooltip, Typography } from "antd";
import { LogoutOutlined } from "@ant-design/icons";
import { useTransitionNavigate } from "common/src/utils/hooks/useTransitionNavigate";
import { routes } from "../shared/routes";
import { useUser } from "common/src/services/api/useUser";
import { CurrentUser } from "common/src/services/api/useCurrentUser";
import { BaseLayout } from "common/src/components/BaseLayout";
import { ProfileForm, ProfileFormValues } from "common/src/components/forms/profile/ProfileForm";

type Props = {
  currentUser: CurrentUser;
};

const Profile = ({ currentUser }: Props) => {
  const { profile, user, userDocLoading } = currentUser;
  const { setProfile } = useUser({ profile, user });
  const auth = getAuth();
  const navigate = useTransitionNavigate();

  const initialValues: ProfileFormValues = {
    ...profile,
    name: profile?.name || user?.displayName || "",
    email: profile?.email || user?.email || "",
  };
  const onLogout = () => {
    signOut(auth);
  };

  const onFinish = async (formValues: ProfileFormValues) => {
    const userId = profile?.id || user?.uid;

    if (userId) {
      setProfile(formValues).then(() => navigate(routes.root));
    }
  };

  return (
    <BaseLayout
      title="Профиль"
      isAdmin
      backPath={routes.root}
      headerActions={[
        <Tooltip title="Выйти" key="logout">
          <Button type="default" shape="circle" icon={<LogoutOutlined />} onClick={onLogout} />
        </Tooltip>,
      ]}
    >
      {userDocLoading || !profile?.id ? (
        <Typography.Title className="site-page-title" level={5}>
          Загрузка...
        </Typography.Title>
      ) : (
        <ProfileForm initialValues={initialValues} onFinish={onFinish} userId={profile.id} />
      )}
    </BaseLayout>
  );
};

export default Profile;
