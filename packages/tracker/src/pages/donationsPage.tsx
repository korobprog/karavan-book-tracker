import { CurrentUser } from "common/src/services/api/useCurrentUser";
import { DonationPageDoc, editDonationPageDoc } from "common/src/services/api/donation";
import { apiRefs } from "common/src/services/api/refs";
import { useDocumentData } from "react-firebase-hooks/firestore";
import { Button, Form, QRCode, Space, Typography, notification } from "antd";
import { BaseLayout } from "common/src/components/BaseLayout";
import { routes } from "../shared/routes";
import { PageForm } from "common/src/components/forms/profile/pagedonation/PageForm";
import PageMenu from "common/src/components/forms/profile/pagedonation/PageMenu";
import { Preview } from "common/src/components/forms/profile/pagedonation/preview";
import { Switch } from "antd";
import { EyeInvisibleFilled, EyeTwoTone, ToolTwoTone } from "@ant-design/icons";
import { useState } from "react";
import logo from "common/src/images/logo.png";
import { useTransitionNavigate } from "common/src/utils/hooks/useTransitionNavigate";
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
  const userName = currentUser.profile?.name;
  const QR_SIZE = 160;
  const downloadQRCode = () => {
    const canvas = document.getElementById("myqrcode")?.querySelector<HTMLCanvasElement>("canvas");
    if (canvas) {
      const url = canvas.toDataURL();
      const a = document.createElement("a");
      a.download = "QRCode.png";
      a.href = url;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  const { Text } = Typography;
  const myPageLink = `https://books-donation.web.app/page/${userId}`;
  const dnone = "none";
  const plug1 = switchState ? "" : dnone;
  const plug2 = switchState ? dnone : "";

  // TODO: check is it need
  const [isChecked] = useState(false);

  const navigate = useTransitionNavigate();

  return (
    <>
      <BaseLayout title={t("home.donations")} isAdmin backPath={routes.root} avatar={avatar}>
        {isChecked ? (
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
        ) : (
          ""
        )}

        <Space style={{ display: "flex", flexFlow: "column", alignItems: "center" }}>
          <Button
            type="primary"
            onClick={() => navigate(routes.pageDonationsForm)}
            style={{ marginTop: 16 }}
            icon={<ToolTwoTone />}
          >
            {t("donation.customize")}
          </Button>
        </Space>

        {donationDocLoading || !initialPageDoc ? (
          <Typography.Title className="site-page-title" level={5}>
            {t("loading")}
          </Typography.Title>
        ) : (
          <>
            {!isChecked && <PageMenu initialValues={initialValues} currentUser={currentUser} />}

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
              <div id="elem" style={{ display: `${isChecked ? "" : plug1}` }}>
                <PageForm
                  initialValues={initialValues}
                  onFinish={onFinish}
                  currentUser={currentUser}
                />
              </div>
            </Space>
            {initialValues.active && !isChecked ? (
              <div id="myqrcode">
                <Space
                  direction="vertical"
                  style={{ marginTop: 15, display: "flex", alignItems: "center" }}
                >
                  <Text italic>
                    {userName}, {t("donation.your_qr")}
                  </Text>
                  <QRCode
                    className="centred"
                    value={myPageLink}
                    bgColor="#fff"
                    style={{ marginBottom: 16 }}
                    errorLevel="H"
                    size={QR_SIZE}
                    iconSize={QR_SIZE / 4}
                    icon={logo}
                  />
                  <Button type="primary" onClick={downloadQRCode}>
                    {t("donation.download_qr")}
                  </Button>
                </Space>
              </div>
            ) : (
              ""
            )}
          </>
        )}
      </BaseLayout>
    </>
  );
};

export default PageDonations;
