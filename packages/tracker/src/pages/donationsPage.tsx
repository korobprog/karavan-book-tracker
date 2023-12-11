import { CurrentUser } from "common/src/services/api/useCurrentUser";
import { DonationPageDoc, editDonationPageDoc } from "common/src/services/api/donation";
import { apiRefs } from "common/src/services/api/refs";
import { useDocumentData } from "react-firebase-hooks/firestore";
import { Space, Typography, notification } from "antd";
import { BaseLayout } from "common/src/components/BaseLayout";
import { routes } from "../shared/routes";
import { PageForm } from "common/src/components/forms/profile/pagedonation/PageForm";
import { Preview } from "common/src/components/forms/profile/pagedonation/preview";
import { Switch } from "antd";
import { CheckOutlined, CloseOutlined } from "@ant-design/icons";
import { useState } from "react";
import { useParams } from "react-router-dom";

type Props = {
  currentUser: CurrentUser;
};

const PageDonations = ({ currentUser }: Props) => {
  const { profile, user } = currentUser;

  const avatar = profile?.avatar;

  const initialPageDoc: DonationPageDoc = {
    banks: [],
    active: false,
    socialTelegram: "",
    socialWhats: "",
    socialMail: "",
    socialLink: "",
    avatar: "",
    userName: "",
    greetingText: "",
    buttonBank: "",
  };

  const userId = profile?.id || user?.uid || "";

  const [donationPageDocData, donationDocLoading] = useDocumentData<DonationPageDoc>(
    userId ? apiRefs.donationPage(userId) : null
  );

  const initialValues = donationPageDocData || initialPageDoc;

  const onFinish = async (formValues: DonationPageDoc) => {
    if (userId) {
      editDonationPageDoc(userId, formValues);

      const updatedValues: DonationPageDoc = {
        ...formValues,
        avatar: profile?.avatar,
        userName: profile?.name,
      };
      editDonationPageDoc(userId, updatedValues);
      notification.success({ message: "Страница успешно сохранена" });
    }
  };
  const [switchState, setSwitchState] = useState(initialValues.active);
  const handleSwitchChange = (checked: boolean | ((prevState: boolean) => boolean)) => {
    setSwitchState(checked);
  };

  return (
    <>
      <BaseLayout title="Страница для пожертвований" isAdmin backPath={routes.root} avatar={avatar}>
        {donationDocLoading || !initialPageDoc ? (
          <Typography.Title className="site-page-title" level={5}>
            Загрузка...
          </Typography.Title>
        ) : (
          <>
            {switchState ? (
              <Preview
                initialValues={initialValues}
                onFinish={onFinish}
                currentUser={currentUser}
              />
            ) : (
              <PageForm
                initialValues={initialValues}
                onFinish={onFinish}
                currentUser={currentUser}
              />
            )}
            `
            <Space
              style={{
                display: "flex",
                flexDirection: "column",
                flexWrap: "wrap",
                justifyContent: "flex-start",
                alignContent: "center",
                alignItems: "flex-start",
              }}
            >
              Предосмотр Вашей страницы для сбора пожертвований:
              <Switch
                checkedChildren={<CheckOutlined />}
                unCheckedChildren={<CloseOutlined />}
                checked={switchState}
                onChange={handleSwitchChange}
              />
            </Space>
          </>
        )}
      </BaseLayout>
    </>
  );
};

export default PageDonations;
