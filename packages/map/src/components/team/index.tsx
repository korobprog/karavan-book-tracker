import clsx from "clsx";
import React from "react";
import {
  Placemark as YPlacemark,
  GeoObjectProps,
  PlacemarkGeometry,
  AnyObject,
  YMapsApi,
} from "react-yandex-maps";

import "./index.less";

type TeamPlacemarkProps = GeoObjectProps<PlacemarkGeometry, AnyObject, AnyObject> & {
  ymaps: YMapsApi;
  name: string;
  place: string;
  coordinates: [number, number];
  isActive?: boolean;
};

const getPlacemarkProperties = (name: string, place: string) => ({
  balloonContentHeader: name,
  balloonContent: `
  <div class="balloon">
    <div class="balloon__address">Сейчас в: ${place}</div>
    <div class="balloon__address">Скоро здесь появится больше информации о караване</div>
  </div>
`,
  openBalloonOnClick: true,
});

export const TeamPlacemark: React.FC<TeamPlacemarkProps> = ({
  ymaps,
  name,
  place,
  coordinates,
  isActive,
  ...restProps
}) => {
  const placemarkOptions = {
    iconLayout: "default#imageWithContent",
    iconContentLayout: ymaps.templateLayoutFactory.createClass(
      `<img
      class="${clsx("placemark", {
        placemark_inactive: !isActive,
      })}"
      src="https://firebasestorage.googleapis.com/v0/b/karavan-book-tracker.appspot.com/o/karavan-team.jpg?alt=media&token=e52eeb80-ad88-4fe0-b5fa-636cb2506d1e"
      width="65"
      height="65"
      alt="Team"
      >`
    ),
    iconImageHref: "none",
    iconImageSize: [65, 60],
    iconImageOffset: [-19, -34],
  };

  return (
    <YPlacemark
      modules={["layout.ImageWithContent", "geoObject.addon.balloon"]}
      className="placemark"
      properties={getPlacemarkProperties(name, place)}
      options={placemarkOptions}
      geometry={coordinates}
      {...restProps}
    />
  );
};
