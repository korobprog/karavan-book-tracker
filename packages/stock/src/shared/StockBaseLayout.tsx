import React from "react";
import { BaseLayout, BaseLayoutProps } from "common/src/components/BaseLayout";
import version from "../../package.json";

export const StockBaseLayout = (props: React.PropsWithChildren<BaseLayoutProps>) => {
  return <BaseLayout {...props} version={version.version} />;
};
