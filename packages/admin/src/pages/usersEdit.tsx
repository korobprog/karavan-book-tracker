import React from "react";
import { getAuth, signOut } from "firebase/auth";
import { Button, Tooltip, Typography } from "antd";
import { LogoutOutlined } from "@ant-design/icons";
import { useNavigate, useParams } from "react-router-dom";
import { routes } from "../shared/routes";
import { updateProfile, useProfileById } from "common/src/services/api/useUser";
import { BaseLayout } from "common/src/components/BaseLayout";
import { ProfileForm, ProfileFormValues } from "common/src/components/forms/profile/ProfileForm";

type Props = {};

export const UsersEdit = (props: Props) => {
  const { userId } = useParams<{ userId: string }>();
  const { profile, loading } = useProfileById(userId);
  const auth = getAuth();
  const navigate = useNavigate();

  const initialValues: ProfileFormValues = {
    ...profile,
  };

  const onLogout = () => {
    signOut(auth);
  };

  const onFinish = async (formValues: ProfileFormValues) => {
    if (userId) {
      updateProfile(userId, formValues).then(() => navigate(routes.users));
    }
  };

  return (
    <BaseLayout
      title="Редактировать пользователя"
      isAdmin
      backPath={routes.users}
      headerActions={[
        <Tooltip title="Выйти" key="logout">
          <Button type="ghost" shape="circle" icon={<LogoutOutlined />} onClick={onLogout} />
        </Tooltip>,
      ]}
    >
      {loading || !userId ? (
        <Typography.Title className="site-page-title" level={5}>
          Загрузка...
        </Typography.Title>
      ) : (
        <ProfileForm initialValues={initialValues} onFinish={onFinish} userId={userId} />
      )}
    </BaseLayout>
  );
};
