import clsx from "clsx";
import React from "react";
import "./index.less";

type LayoutProps = {
  className?: string;
  contentClassName?: string;
  ui?: React.ReactNode;
};

export const Layout: React.FC<LayoutProps> = (props) => {
  const { className, contentClassName, ui, children } = props;

  return (
    <div className={clsx("layout", className)}>
      <div className={clsx("layout__content", contentClassName)}>{children}</div>
      {ui && <div className="layout__ui">{ui}</div>}
    </div>
  );
};
