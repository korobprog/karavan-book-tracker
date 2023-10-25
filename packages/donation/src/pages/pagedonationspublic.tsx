import React from "react";
import { CurrentUser } from "common/src/services/api/useCurrentUser";
import { DonationPageDoc, editDonationPageDoc } from "common/src/services/api/donation";
import { apiRefs } from "common/src/services/api/refs";
import { useDocumentData } from "react-firebase-hooks/firestore";
import { Avatar, Button, Divider, QRCode, Space, Typography, Image } from "antd";
import { BaseLayout } from "common/src/components/BaseLayout";
import { BankOutlined, CreditCardOutlined } from "@ant-design/icons";

type Props = {
  currentUser: CurrentUser;
};

const PageDonations = ({ currentUser }: Props) => {
  const { profile, user } = currentUser;

  const avatar = profile?.avatar;

  const userId = profile?.id || user?.uid || "";

  const [donationPageDocData, donationDocLoading] = useDocumentData<DonationPageDoc>(
    apiRefs.donationPage(userId)
  );

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
  const { Title } = Typography;
  const { Paragraph, Text } = Typography;

  return (
    <BaseLayout title="Book Donation" headerActions={[]}>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <Avatar size={80} src={<img src={avatar} alt="Евгений" />} />
      </div>
      <Title className="site-page-title" level={4}>
        Evgeny Kovalsky
      </Title>
      <Text strong>Gocha Afciauri TBS</Text>
      <Paragraph copyable>
        <CreditCardOutlined />
        <Text style={{ fontSize: "150%" }} code>
          {donationPageDocData?.banks}
        </Text>
      </Paragraph>

      <Divider dashed />
      <Paragraph copyable>
        <Space align="center">
          <BankOutlined />
          <Button href="https://www.tinkoff.ru/rm/korobkov.maksim37/xORxX45790">
            ПЕРЕВОД ЧЕРЕЗ TINKOFF
          </Button>
        </Space>

        <CreditCardOutlined />
        <Text style={{ fontSize: "150%" }} code>
          5536914106233152
        </Text>
      </Paragraph>

      <Divider dashed />
      <Text>My contacts</Text>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <Paragraph>
          <a href="https://t.me/+87QpmUsO_Gw2NDNi">
            <Image alt="telegram" src={avatar} height={30} width={30} preview={false} />
          </a>
        </Paragraph>
      </div>
      <Text>Donation leave here</Text>
      <div id="myqrcode">
        <QRCode
          className="centred"
          value="https://books-donation.web.app/evgenyk"
          bgColor="#fff"
          style={{ marginBottom: 16 }}
        />
        <Button className="centred" type="primary" onClick={downloadQRCode}>
          Download QR
        </Button>
      </div>
      <Divider dashed />
      <Paragraph copyable>
        <Text>
          <a href="https://books-donation.web.app/evgenyk">www.books-donation.web.app/evgenyk</a>
        </Text>
      </Paragraph>
    </BaseLayout>
  );
};

export default PageDonations;
