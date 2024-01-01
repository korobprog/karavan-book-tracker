import React from "react";
import { BaseLayout, BaseLayoutProps } from "common/src/components/BaseLayout";
import version from "../../package.json";
import { useTransitionNavigate } from "common/src/utils/hooks/useTransitionNavigate";
import { routes } from "./routes";

export const StockBaseLayout = (props: React.PropsWithChildren<BaseLayoutProps>) => {
  const navigate = useTransitionNavigate();

  const onAvatarClick = () => {
    navigate(routes.root);
  };

  return <BaseLayout onAvatarClick={onAvatarClick} {...props} version={version.version} />;
};
