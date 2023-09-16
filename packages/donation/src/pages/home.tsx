import React from "react";
import { Divider, Typography } from "antd";
import { BaseLayout } from "common/src/components/BaseLayout";

export const Home = () => {
  const { Title } = Typography;

  return (
    <BaseLayout title="Book Donation" headerActions={[]}>
      <Title className="site-page-title" level={2}>
        Привет, друг!
      </Title>
      <Divider dashed />
      Donation оставлять тут
    </BaseLayout>
  );
};
