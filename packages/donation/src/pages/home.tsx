import React from "react";
import { Divider, Typography } from "antd";
import { BaseLayout } from "common/src/components/BaseLayout";

type Props = {};

export const Home = ({}: Props) => {
  const { Title } = Typography;

  return (
    <BaseLayout title="Book Donation">
      <Title className="site-page-title" level={2}>
        Привет,
        <br />
      </Title>
      <Divider dashed />
      фa
    </BaseLayout>
  );
};
