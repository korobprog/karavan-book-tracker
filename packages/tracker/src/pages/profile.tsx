import React from "react";
import { getAuth, signOut } from "firebase/auth";
import { Button, Typography, Tooltip } from "antd";
import { useNavigate } from "react-router-dom";
import { routes } from "../shared/routes";
import { updateProfile } from "common/src/services/api/useUser";
import { CurrentUser } from "common/src/services/api/useCurrentUser";
import { BaseLayout } from "common/src/components/BaseLayout";
import { LogoutOutlined } from "@ant-design/icons";
import { ProfileForm, ProfileFormValues } from "common/src/components/forms/profile/ProfileForm";

type Props = {
  currentUser: CurrentUser;
};

const Profile = ({ currentUser }: Props) => {
  const { profile, user, userDocLoading } = currentUser;

  const auth = getAuth();
  const navigate = useNavigate();

  const initialValues: ProfileFormValues = {
    ...profile,
    name: profile?.name || user?.displayName || "",
  };

  const onLogout = () => {
    signOut(auth);
  };

  const onFinish = async (formValues: ProfileFormValues) => {
    const userId = profile?.id || user?.uid;

    if (userId) {
      updateProfile(userId, formValues).then(() => navigate(routes.root));
    }
  };

  return (
    <BaseLayout
      title="УЧЕТ КНИГ"
      backPath={routes.root}
      userDocLoading={userDocLoading}
      headerActions={[
        <Tooltip title="Выйти" key="logout">
          <Button type="ghost" shape="circle" icon={<LogoutOutlined />} onClick={onLogout} />
        </Tooltip>,
      ]}
    >
      <Typography.Title className="site-page-title" level={2}>
        Ваш профиль
      </Typography.Title>
      {userDocLoading ? (
        <Typography.Title className="site-page-title" level={5}>
          Загрузка...
        </Typography.Title>
      ) : (
        <ProfileForm initialValues={initialValues} onFinish={onFinish} />
      )}
    </BaseLayout>
  );
};

export default Profile;
