import { CurrentUser } from "common/src/services/api/useCurrentUser";
import { DonationPageDoc } from "common/src/services/api/donation";
import { apiRefs } from "common/src/services/api/refs";
import { useDocumentData } from "react-firebase-hooks/firestore";
import { Button, Radio, RadioChangeEvent, Space, Switch, Modal } from "antd";
import { PrinterTwoTone, LinkOutlined } from "@ant-design/icons";
import { useState } from "react";
import Link from "antd/es/typography/Link";
import printPdfDonations from "common/src/components/forms/profile/pagedonation/printPdfDonations";
import printPdfDonations88 from "common/src/components/forms/profile/pagedonation/printPdfDonations88";
import { useTranslation } from "react-i18next";

export type PageFormValues = DonationPageDoc;

type Props = {
  initialValues: PageFormValues;
  disabled?: boolean;
  currentUser: CurrentUser;
};

const PageMenu = ({ currentUser }: Props) => {
  const { profile, user } = currentUser;
  const { t } = useTranslation();

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

  const [donationPageDocData] = useDocumentData<DonationPageDoc>(
    userId ? apiRefs.donationPage(userId) : null
  );

  const initialValues = donationPageDocData || initialPageDoc;

  const [switchState, setSwitchState] = useState(initialValues.active);

  const myPageLink = `https://books-donation.web.app/page/${userId}`;

  const [value, setValue] = useState(true);

  const onChange = (e: RadioChangeEvent) => {
    //console.log("radio checked", e.target.value);
    setValue(e.target.value);
  };

  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <Space
        direction="vertical"
        style={{ display: "flex", flexFlow: "column", alignItems: "center", marginTop: 20 }}
      >
        {initialValues.active ? (
          <Button type="primary" ghost icon={<LinkOutlined />}>
            <Link copyable={{ text: myPageLink }} href={myPageLink} target="_blank">
              {t("common.donation.menu.your_page")}
            </Link>
          </Button>
        ) : (
          ""
        )}
        {initialValues.active ? (
          <Button type="dashed" onClick={showModal} icon={<PrinterTwoTone />}>
            {t("common.donation.menu.print")}
          </Button>
        ) : (
          ""
        )}{" "}
      </Space>
      {initialValues.active ? (
        <Space
          direction="vertical"
          style={{ display: "flex", flexFlow: "column", alignItems: "center", marginBottom: 15 }}
        >
          <Modal title="Выберете формат" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
            <Radio.Group name="radiogroup" defaultValue={1} onChange={onChange} value={value}>
              <Radio value={true} onClick={printPdfDonations}>
                16 QR
              </Radio>
              <Radio value={false} onClick={printPdfDonations88}>
                88 QR
              </Radio>
            </Radio.Group>
          </Modal>
        </Space>
      ) : (
        ""
      )}
    </>
  );
};

export default PageMenu;
