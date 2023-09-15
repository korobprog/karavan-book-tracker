import React, { useEffect } from "react";
import { generatePath, useNavigate } from "react-router-dom";
import { Button, Divider } from "antd";

import { routes } from "../shared/routes";
import { CurrentUser } from "common/src/services/api/useCurrentUser";
import { BaseLayout } from "common/src/components/BaseLayout";

type Props = {
  currentUser: CurrentUser;
};

export const Distributors = ({ currentUser }: Props) => {
  const { profile, user, loading, userDocLoading } = currentUser;
  const avatar = profile?.avatar;
  const navigate = useNavigate();

  useEffect(() => {
    if (!user && !loading) {
      navigate(routes.auth);
    }
  }, [user, loading, navigate]);

  const distributorId = "mock";

  return (
    <BaseLayout
      title="Распространители"
      backPath={routes.root}
      userDocLoading={userDocLoading}
      avatar={avatar}
    >
      <Button
        type="primary"
        block
        size="large"
        onClick={() => navigate(generatePath(routes.distributor, { distributorId }))}
      >
        Первый моковый распространитель
      </Button>
      <Divider dashed />
      <Divider dashed />
      Distributors
    </BaseLayout>
  );
};
