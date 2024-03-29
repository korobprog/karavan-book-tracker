import React from "react";
import { getAuth, signOut } from "firebase/auth";
import { Button, Typography, Tooltip } from "antd";
import { useStore } from "effector-react";
import { useTransitionNavigate } from "common/src/utils/hooks/useTransitionNavigate";
import { routes } from "../shared/routes";
import { useUser } from "common/src/services/api/useUser";
import { CurrentUser } from "common/src/services/api/useCurrentUser";
import { StockBaseLayout } from "../shared/StockBaseLayout";
import { LogoutOutlined } from "@ant-design/icons";
import { ProfileForm, ProfileFormValues } from "common/src/components/forms/profile/ProfileForm";
import {
  ProfileStockForm,
  ProfileStockFormValues,
} from "common/src/components/forms/stock/ProfileStockForm";
import {
  $stock,
  $stockLoading,
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
  const navigate = useTransitionNavigate();
  const stock = useStore($stock);
  const stockLoading = useStore($stockLoading);

  const avatar = profile?.avatar;

  const initialValues: FormValues = {
    ...profile,
    name: profile?.name || user?.displayName || "",
    email: profile?.email || user?.email || "",
    registrationDate: profile?.registrationDate
      ? profile?.registrationDate
      : new Date().toISOString(),
    stockName: stock?.name || "",
    region: stock?.region,
  };

  const onLogout = () => {
    signOut(auth);
  };

  const userId = profile?.id || user?.uid || "";

  const onFinish = async (formValues: FormValues) => {
    if (userId) {
      const { stockName, region, ...newProfile } = formValues;

      const stockId = profile?.stockId;
      const setHolder =
        stockId && stock ? (data: Partial<HolderDoc>) => updateHolder(stockId, data) : addHolder;

      const holderDoc = await setHolder({
        creatorId: userId,
        locationId: newProfile.yatraLocationId || "",
        name: stockName,
        region,
        type: HolderType.stock,
      });

      newProfile.stockId = holderDoc ? holderDoc.id : profile?.stockId;

      return setProfile(newProfile).then(() => navigate(routes.root));
    }
  };

  return (
    <StockBaseLayout
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
      {userDocLoading || stockLoading ? (
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
    </StockBaseLayout>
  );
};

export default Profile;
