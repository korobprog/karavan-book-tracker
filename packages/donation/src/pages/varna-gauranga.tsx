import React from "react";
import { Divider, QRCode, Typography } from "antd";
import { BaseLayout } from "common/src/components/BaseLayout";

export const VarnaG = () => {
  const { Title } = Typography;
  const { Paragraph, Text } = Typography;
  return (
    <BaseLayout title="Book Donation" headerActions={[]}>
      <Title className="site-page-title" level={4}>
        Vladislav Nikolaevich M
      </Title>
      <Text strong>Gocha Afciauri TBS</Text>
      <Paragraph copyable>
        <Text code>22001023396</Text>
      </Paragraph>
      <Divider dashed />

      <Text>Donation leave here</Text>
      <QRCode className="centred" value="https://books-donation.web.app/varnag" />
      <Paragraph copyable>
        <Text>
          <a href="https://books-donation.web.app/varnag">www.books-donation.web.app/varnag</a>
        </Text>
      </Paragraph>
    </BaseLayout>
  );
};
