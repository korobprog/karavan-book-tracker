import React from "react";
import clsx from "clsx";

import { UiIcon, IconType } from "components/ui/icon";

import "./uiCheckbox.less";

export type UiCheckboxProps = React.InputHTMLAttributes<HTMLInputElement> & {
  icon?: IconType;
  error?: string;
  label?: React.ReactNode;
};

export const UiCheckbox = React.forwardRef<HTMLInputElement, UiCheckboxProps>((props, ref) => {
  const { icon, error, label, ...inputProps } = props;

  return (
    <label className="uiCheckbox">
      <input ref={ref} type="checkbox" className="uiCheckbox__input" hidden {...inputProps} />
      <UiIcon icon="checkbox" className="uiCheckbox__checkbox" />
      <UiIcon
        icon="check"
        className={clsx("uiCheckbox__check", {
          uiCheckbox__check_hidden: !inputProps.checked,
        })}
      />
      <span>{label}</span>
    </label>
  );
});
