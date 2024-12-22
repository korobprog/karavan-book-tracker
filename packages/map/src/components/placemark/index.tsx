import clsx from "clsx";
import React from "react";
import {
  Placemark as YPlacemark,
  GeoObjectProps,
  PlacemarkGeometry,
  AnyObject,
  YMapsApi,
} from "react-yandex-maps";
import { BOOK_DECLENSIONS, declension } from "shared/utils/declision";

import "./index.less";

type PlacemarkProps = GeoObjectProps<PlacemarkGeometry, AnyObject, AnyObject> & {
  ymaps: YMapsApi;
  place: string;
  coordinates: [number, number];
  isActive?: boolean;
  count?: number;
};

const getPlacemarkProperties = (place: string, count?: number) => ({
  balloonContentHeader: place,
  balloonContent: `
  <div class="balloon">
    <div class="balloon__address">Распространено ${count || 0} ${declension(
    count || 0,
    BOOK_DECLENSIONS
  )}</div>
  </div>
`,
  openBalloonOnClick: true,
  count,
});

export const Placemark: React.FC<PlacemarkProps> = ({
  ymaps,
  place,
  coordinates,
  isActive,
  count,
  ...restProps
}) => {
  const placemarkOptions = {
    // iconLayout: "default#image",
    // iconImageHref: "https://image.flaticon.com/icons/png/512/64/64113.png",
    iconLayout: "default#imageWithContent",
    iconContentLayout: ymaps.templateLayoutFactory.createClass(
      `<div class="${clsx("placemark", {
        placemark_inactive: !isActive,
      })}"
      >
      ${count || 0}
      </div>`
    ),
    iconImageHref: "none",
    iconImageSize: [45, 40],
    iconImageOffset: [-19, -44],
  };

  return (
    <YPlacemark
      modules={["layout.ImageWithContent", "geoObject.addon.balloon"]}
      className="placemark"
      properties={getPlacemarkProperties(place, count)}
      options={placemarkOptions}
      geometry={coordinates}
      {...restProps}
    />
  );
};
