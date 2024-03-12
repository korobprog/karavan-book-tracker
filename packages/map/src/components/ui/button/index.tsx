import clsx from "clsx";
import "./uiButton.less";

export type UiButtonTypes = "primary" | "secondary" | "danger" | "ghost" | "link";

export type UiButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant: UiButtonTypes;
  label: string;
};

export const UiButton: React.FC<UiButtonProps> = (props) => {
  const { className, variant, label, onClick, children, ...restProps } = props;
  const isActive = (key: UiButtonTypes) => variant === key;

  return (
    <button
      className={clsx("uiButton", className, {
        uiButton__primary: isActive("primary"),
        uiButton__secondary: isActive("secondary"),
        uiButton__danger: isActive("danger"),
        uiButton__ghost: isActive("ghost"),
        uiButton__link: isActive("link"),
      })}
      type="button"
      onClick={onClick}
      {...restProps}
    >
      {children || label}
    </button>
  );
};
