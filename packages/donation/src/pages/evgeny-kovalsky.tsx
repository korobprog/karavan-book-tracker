import React from "react";
import { Divider, QRCode, Typography } from "antd";
import { BaseLayout } from "common/src/components/BaseLayout";

export const EvgenyK = () => {
  const { Title } = Typography;
  const { Paragraph, Text } = Typography;
  return (
    <BaseLayout title="Book Donation" headerActions={[]}>
      <Title className="site-page-title" level={4}>
        Evgeny Kovalsky
      </Title>
      <Text strong>Gocha Afciauri TBS</Text>
      <Paragraph copyable>
        <Text code>22001023396</Text>
      </Paragraph>

      <Text strong>Sberbank of Russia</Text>
      <Paragraph copyable>
        <Text code>4817760161072578</Text>
      </Paragraph>

      <Text strong>Tinkoff</Text>
      <Paragraph copyable>
        <Text code>5536914106233152</Text>
      </Paragraph>

      <Divider dashed />

      <Text>Donation leave here</Text>
      <QRCode className="centred" value="https://books-donation.web.app/evgenyk" />
      <Paragraph copyable>
        <Text>
          <a href="https://books-donation.web.app/evgenyk">www.books-donation.web.app/evgenyk</a>
        </Text>
      </Paragraph>
    </BaseLayout>
  );
};
