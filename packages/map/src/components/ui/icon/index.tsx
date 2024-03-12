import { svg } from "assets";

export type IconType = keyof typeof svg;

export type UiIconProps = React.SVGProps<SVGSVGElement> & {
  icon: IconType;
};

export const UiIcon: React.FC<UiIconProps> = (props) => {
  const { icon, width = 20, height = 20, ...restProps } = props;

  const Image = svg[icon];

  return <Image width={width} height={height} {...restProps} />;
};
