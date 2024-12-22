import React from "react";
import { Map as YMap, YMapsProps } from "react-yandex-maps";
import "./index.less";

export const Map: React.FC<YMapsProps> = (props) => {
  return <YMap {...props} className="map" />;
};
