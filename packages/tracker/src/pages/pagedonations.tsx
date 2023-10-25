import React, { useState } from "react";
import { CurrentUser } from "common/src/services/api/useCurrentUser";
import { DonationPageDoc, editDonationPageDoc } from "common/src/services/api/donation";
import { apiRefs } from "common/src/services/api/refs";
import { useDocumentData } from "react-firebase-hooks/firestore";
import { PageForm } from "common/src/components/forms/profile/PageForm";
import { Divider, Form, Switch, Typography } from "antd";
import { BaseLayout } from "common/src/components/BaseLayout";
import { routes } from "../shared/routes";
import { CheckOutlined, CloseOutlined } from "@ant-design/icons";

type Props = {
  currentUser: CurrentUser;
};

const PageDonations = ({ currentUser }: Props) => {
  const { profile, user } = currentUser;

  const [disabled, setDisabled] = useState(true);

  const toggle = () => {
    setDisabled(!disabled);
  };

  const avatar = profile?.avatar;

  const initialPageDoc: DonationPageDoc = {
    banks: [],
    active: false,
    socialTelegram: "",
  };

  const userId = profile?.id || user?.uid || "";

  const [donationPageDocData, donationDocLoading] = useDocumentData<DonationPageDoc>(
    apiRefs.donationPage(userId)
  );

  const initialValues = donationPageDocData || initialPageDoc;
  console.log("🚀 ~ file: pagedonations.tsx:39 ~ PageDonations ~ initialValues:", initialValues);

  const onFinish = async (formValues: DonationPageDoc) => {
    if (userId) {
      editDonationPageDoc(userId, formValues);
      console.log("🚀 ~ file: pagedonations.tsx:44 ~ onFinish ~ formValues:", formValues);
    }
  };
  return (
    <BaseLayout title="Страница для пожертвований" isAdmin backPath={routes.root} avatar={avatar}>
      <Form.Item label="активировать страницу">
        <Switch
          checkedChildren={<CheckOutlined />}
          unCheckedChildren={<CloseOutlined />}
          defaultChecked
          onClick={toggle}
        />
      </Form.Item>
      {donationDocLoading || !initialPageDoc ? (
        <Typography.Title className="site-page-title" level={5}>
          Загрузка...
        </Typography.Title>
      ) : (
        <PageForm disabled={disabled} initialValues={initialValues} onFinish={onFinish} />
      )}
    </BaseLayout>
  );
};

export default PageDonations;
