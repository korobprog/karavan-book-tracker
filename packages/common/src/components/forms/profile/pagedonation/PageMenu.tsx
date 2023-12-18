import { CurrentUser } from "common/src/services/api/useCurrentUser";
import { DonationPageDoc, editDonationPageDoc } from "common/src/services/api/donation";
import { apiRefs } from "common/src/services/api/refs";
import { useDocumentData } from "react-firebase-hooks/firestore";
import { Button, Form, Radio, RadioChangeEvent, Space, Switch, Modal } from "antd";

import { EyeInvisibleFilled, EyeTwoTone, PrinterTwoTone } from "@ant-design/icons";
import { useState } from "react";
import Link from "antd/es/typography/Link";
import printPdfDonations from "common/src/components/forms/profile/pagedonation/printPdfDonations";
import printPdfDonations88 from "common/src/components/forms/profile/pagedonation/printPdfDonations88";
import React from "react";

export type PageFormValues = DonationPageDoc;

type Props = {
  initialValues: PageFormValues;
  disabled?: boolean;
  currentUser: CurrentUser;
};

const PageMenu = ({ currentUser }: Props) => {
  const { profile, user } = currentUser;

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

  const [switchState, setSwitchState] = useState(initialValues.active);

  const handleSwitchChange = (checked: boolean | ((prevState: boolean) => boolean)) => {
    setSwitchState(checked);
  };

  const [isChecked, setIsChecked] = useState(false);

  const toggleDisabled = () => {
    setIsChecked(true);
  };

  const toggleEnabled = () => {
    setIsChecked(false);
  };

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
      {switchState ? (
        <Button type="primary" ghost>
          <Link copyable={{ text: myPageLink }} href={myPageLink} target="_blank">
            Ваша страница визитки
          </Link>
        </Button>
      ) : (
        ""
      )}
      <Space style={{ display: "flex", flexFlow: "column", alignItems: "center", marginTop: 15 }}>
        <Button type="primary" onClick={showModal} icon={<PrinterTwoTone />}>
          Распечатать визитки
        </Button>
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
