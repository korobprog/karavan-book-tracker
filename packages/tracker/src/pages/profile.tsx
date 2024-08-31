import React from "react";
import { getAuth, signOut } from "firebase/auth";
import { Button, Typography, Tooltip } from "antd";
import { useTransitionNavigate } from "common/src/utils/hooks/useTransitionNavigate";
import { routes } from "../shared/routes";
import { useUser } from "common/src/services/api/useUser";
import { CurrentUser } from "common/src/services/api/useCurrentUser";
import { BaseLayout } from "common/src/components/BaseLayout";
import { LogoutOutlined } from "@ant-design/icons";
import { ProfileForm, ProfileFormValues } from "common/src/components/forms/profile/ProfileForm";
import { useTranslation } from "react-i18next";

type Props = {
  currentUser: CurrentUser;
};

const Profile = ({ currentUser }: Props) => {
  const { profile, user, userDocLoading } = currentUser;
  const { setProfile } = useUser({ profile, user });
  const auth = getAuth();
  const navigate = useTransitionNavigate();
  const { t } = useTranslation();

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
      title={t("profile.title")}
      backPath={routes.root}
      userDocLoading={userDocLoading}
      headerActions={[
        <Tooltip title={t("profile.logout")} key="logout">
          <Button type="default" shape="circle" icon={<LogoutOutlined />} onClick={onLogout} />
        </Tooltip>,
      ]}
      avatar={avatar}
    >
      <Typography.Title className="site-page-title" level={2}>
        {t("profile.title")}
      </Typography.Title>
      {userDocLoading ? (
        <Typography.Title className="site-page-title" level={5}>
          {t("common.loading")}
        </Typography.Title>
      ) : (
        <ProfileForm initialValues={initialValues} onFinish={onFinish} userId={userId} />
      )}
    </BaseLayout>
  );
};

export default Profile;
