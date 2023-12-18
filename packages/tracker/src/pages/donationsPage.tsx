import { CurrentUser } from "common/src/services/api/useCurrentUser";
import { DonationPageDoc, editDonationPageDoc } from "common/src/services/api/donation";
import { apiRefs } from "common/src/services/api/refs";
import { useDocumentData } from "react-firebase-hooks/firestore";
import {
  Button,
  Form,
  QRCode,
  Radio,
  RadioChangeEvent,
  Space,
  Typography,
  notification,
} from "antd";
import { BaseLayout } from "common/src/components/BaseLayout";
import { routes } from "../shared/routes";
import { PageForm } from "common/src/components/forms/profile/pagedonation/PageForm";
import PageMenu from "common/src/components/forms/profile/pagedonation/PageMenu";
import { Preview } from "common/src/components/forms/profile/pagedonation/preview";
import { Switch } from "antd";
import { CloseOutlined, EyeInvisibleFilled, EyeTwoTone, PrinterTwoTone } from "@ant-design/icons";
import { useState } from "react";
import logo from "common/src/images/logo.png";
import Link from "antd/es/typography/Link";

import printPdfDonations from "common/src/components/forms/profile/pagedonation/printPdfDonations";
import printPdfDonations88 from "common/src/components/forms/profile/pagedonation/printPdfDonations88";

export type PageFormValues = DonationPageDoc;

type Props = {
  initialValues: PageFormValues;
  disabled?: boolean;
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
  const userName = currentUser.profile?.name;
  const [isChecked, setIsChecked] = useState(false);

  const toggleDisabled = () => {
    setIsChecked(true);
  };
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

  const toggleEnabled = () => {
    setIsChecked(false);
  };

  const myPageLink = `https://books-donation.web.app/page/${userId}`;

  const dnone = "none";
  const plug1 = switchState ? "" : dnone;
  const plug2 = switchState ? dnone : "";

  const [value, setValue] = useState(true);

  const onChange = (e: RadioChangeEvent) => {
    //console.log("radio checked", e.target.value);
    setValue(e.target.value);
  };

  return (
    <>
      <BaseLayout title="Страница для пожертвований" isAdmin backPath={routes.root} avatar={avatar}>
        <Space style={{ display: "flex", flexFlow: "column", alignItems: "flex-end" }}>
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

        <Space style={{ display: "flex", flexFlow: "column", alignItems: "center" }}>
          {!isChecked ? (
            <Button type="primary" onClick={toggleDisabled} style={{ marginTop: 16 }}>
              Настроить страницу визитки
            </Button>
          ) : (
            ""
          )}
        </Space>

        {donationDocLoading || !initialPageDoc ? (
          <Typography.Title className="site-page-title" level={5}>
            Загрузка...
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
            {initialValues.active ? (
              <div id="myqrcode">
                <Space
                  direction="vertical"
                  style={{ marginTop: 15, display: "flex", alignItems: "center" }}
                >
                  <Text italic>{userName}, это Ваш QR странички донатов</Text>
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
                    Скачать QR на устройство
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
