import { CurrentUser } from "common/src/services/api/useCurrentUser";
import { DonationPageDoc, editDonationPageDoc } from "common/src/services/api/donation";
import { apiRefs } from "common/src/services/api/refs";
import { useDocumentData } from "react-firebase-hooks/firestore";
import { Form, Space, Typography, notification } from "antd";
import { BaseLayout } from "common/src/components/BaseLayout";
import { routes } from "../shared/routes";
import { PageForm } from "common/src/components/forms/profile/pagedonation/PageForm";
import { Preview } from "common/src/components/forms/profile/pagedonation/preview";
import { Switch } from "antd";
import { EyeInvisibleFilled, EyeTwoTone } from "@ant-design/icons";
import { useState } from "react";
import { useTranslation } from "react-i18next";
export type PageFormValues = DonationPageDoc;

type Props = {
  initialValues: PageFormValues;
  disabled?: boolean;
  currentUser: CurrentUser;
};

const PageDonations = ({ currentUser }: Props) => {
  const { profile, user } = currentUser;
  const { t } = useTranslation();

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
      notification.success({ message: t("donation.save_success") });
    }
  };
  const [switchState, setSwitchState] = useState(initialValues.active);

  const handleSwitchChange = (checked: boolean | ((prevState: boolean) => boolean)) => {
    setSwitchState(checked);
  };
  const dnone = "none";
  const plug1 = switchState ? "" : dnone;
  const plug2 = switchState ? dnone : "";

  return (
    <>
      <BaseLayout
        title={t("home.donations")}
        isAdmin
        backPath={routes.pageDonations}
        avatar={avatar}
      >
        <Space style={{ display: "flex", flexFlow: "column", alignItems: "flex-start" }}>
          <Form layout="vertical">
            <Form.Item>
              <Switch
                checkedChildren={<EyeTwoTone />}
                unCheckedChildren={<EyeInvisibleFilled />}
                checked={switchState}
                onChange={handleSwitchChange}
              />
            </Form.Item>
          </Form>
        </Space>
        {donationDocLoading || !initialPageDoc ? (
          <Typography.Title className="site-page-title" level={5}>
            {t("loading")}
          </Typography.Title>
        ) : (
          <>
            <Space style={{ display: `${switchState ? "" : plug1}` }}>
              <Preview
                initialValues={initialValues}
                onFinish={onFinish}
                currentUser={currentUser}
              />
            </Space>
            <Space
              style={{
                display: `${switchState ? plug2 : ""}`,
              }}
            >
              <PageForm
                initialValues={initialValues}
                onFinish={onFinish}
                currentUser={currentUser}
              />
            </Space>
          </>
        )}
      </BaseLayout>
    </>
  );
};

export default PageDonations;
