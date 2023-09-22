import React from "react";
import { getAuth, signOut } from "firebase/auth";
import { Button, Typography, Tooltip } from "antd";
import { useStore } from "effector-react";
import { useNavigate } from "react-router-dom";
import { routes } from "../shared/routes";
import { useUser } from "common/src/services/api/useUser";
import { CurrentUser } from "common/src/services/api/useCurrentUser";
import { BaseLayout } from "common/src/components/BaseLayout";
import { LogoutOutlined } from "@ant-design/icons";
import { ProfileForm, ProfileFormValues } from "common/src/components/forms/profile/ProfileForm";
import {
  ProfileStockForm,
  ProfileStockFormValues,
} from "common/src/components/forms/stock/ProfileStockForm";
import {
  $stock,
  HolderDoc,
  HolderType,
  addHolder,
  updateHolder,
} from "common/src/services/api/holders";

type FormValues = ProfileFormValues & ProfileStockFormValues;

type Props = {
  currentUser: CurrentUser;
};

const Profile = ({ currentUser }: Props) => {
  const { profile, user, userDocLoading } = currentUser;
  const { setProfile } = useUser({ profile, user });
  const auth = getAuth();
  const navigate = useNavigate();
  const stock = useStore($stock);

  const avatar = profile?.avatar;

  const initialValues: FormValues = {
    ...profile,
    name: profile?.name || user?.displayName || "",
    email: profile?.email || user?.email || "",
    registrationDate: profile?.registrationDate
      ? profile?.registrationDate
      : new Date().toISOString(),
    stockName: stock?.name || "",
  };

  const onLogout = () => {
    signOut(auth);
  };

  const userId = profile?.id || user?.uid || "";

  const onFinish = async (formValues: FormValues) => {
    if (userId) {
      const { stockName, ...newProfile } = formValues;

      const stockId = profile?.stockId;
      const setHolder = stockId
        ? (data: Partial<HolderDoc>) => updateHolder(stockId, data)
        : addHolder;

      setHolder({
        creatorId: userId,
        locationId: newProfile.yatraLocationId || "",
        name: stockName,
        type: HolderType.stock,
      }).then((holderDoc) => {
        newProfile.stockId = holderDoc ? holderDoc.id : profile?.stockId;
        setProfile(newProfile).then(() => navigate(routes.root));
      });
    }
  };

  return (
    <BaseLayout
      title="Профиль"
      backPath={routes.root}
      userDocLoading={userDocLoading}
      headerActions={[
        <Tooltip title="Выйти" key="logout">
          <Button type="default" shape="circle" icon={<LogoutOutlined />} onClick={onLogout} />
        </Tooltip>,
      ]}
      avatar={avatar}
    >
      <Typography.Title className="site-page-title" level={2}>
        Ваш профиль
      </Typography.Title>
      {userDocLoading || (profile?.stockId && !stock) ? (
        <Typography.Title className="site-page-title" level={5}>
          Загрузка...
        </Typography.Title>
      ) : (
        <ProfileForm
          initialValues={initialValues}
          onFinish={onFinish}
          userId={userId}
          slot={<ProfileStockForm />}
          isYatraLocationRequired
        />
      )}
    </BaseLayout>
  );
};

export default Profile;
