import React from "react";
import { getAuth, signOut } from "firebase/auth";
import { Button, Typography, Tooltip } from "antd";
import { useNavigate } from "react-router-dom";
import { routes } from "../shared/routes";
import { useUser } from "common/src/services/api/useUser";
import { CurrentUser } from "common/src/services/api/useCurrentUser";
import { BaseLayout } from "common/src/components/BaseLayout";
import { LogoutOutlined } from "@ant-design/icons";
import { ProfileForm, ProfileFormValues } from "common/src/components/forms/profile/ProfileForm";

type Props = {
  currentUser: CurrentUser;
};

const PageDonations = ({ currentUser }: Props) => {
  const { profile, user, userDocLoading } = currentUser;
  const { setProfile } = useUser({ profile, user });
  const auth = getAuth();
  const navigate = useNavigate();

  const avatar = profile?.avatar;

  const initialValues: ProfileFormValues = {
    ...profile,
    name: profile?.name || user?.displayName || "",
    email: profile?.email || user?.email || "",
    registrationDate: profile?.registrationDate
      ? profile?.registrationDate
      : new Date().toISOString(),
  };

  const onLogout = () => {
    signOut(auth);
  };

  const userId = profile?.id || user?.uid || "";

  const onFinish = async (formValues: ProfileFormValues) => {
    if (userId) {
      setProfile(formValues).then(() => navigate(routes.root));
    }
  };

  return (
    <BaseLayout
      title="Донаты"
      backPath={routes.root}
      userDocLoading={userDocLoading}
      headerActions={[
        <Tooltip title="Выйти" key="logout">
          <Button type="ghost" shape="circle" icon={<LogoutOutlined />} onClick={onLogout} />
        </Tooltip>,
      ]}
      avatar={avatar}
    >
      <Typography.Title className="site-page-title" level={2}>
        Список банков
      </Typography.Title>
      {userDocLoading ? (
        <Typography.Title className="site-page-title" level={5}>
          Загрузка...
        </Typography.Title>
      ) : (
        <ProfileForm initialValues={initialValues} onFinish={onFinish} userId={userId} />
      )}
    </BaseLayout>
  );
};

export default PageDonations;
