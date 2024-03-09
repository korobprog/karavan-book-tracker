import { useEffect, useState } from "react";
import {
  ObjectManager,
  ObjectManagerFeature,
  ObjectManagerFeatureCollection,
  YMapsApi,
} from "react-yandex-maps";

type Features = ObjectManagerFeature[];
type Props = {
  ymaps: YMapsApi;
  isShowRegions?: boolean;
};

export const Regions: React.FC<Props> = ({ ymaps, isShowRegions }) => {
  const [features, setFeatures] = useState<Features>();

  useEffect(() => {
    ymaps.borders
      .load("RU", {
        lang: "ru",
        quality: 2,
      })
      .then((result: ObjectManagerFeatureCollection) => {
        setFeatures(
          (result.features as ObjectManagerFeature[]).map((feature, index: number) => {
            const id = feature.properties?.iso3166;
            const options = {
              fillOpacity: 0.5,
              strokeColor: "#FFF",
              strokeOpacity: 0.5,
              fillColor: index % 2 === 0 ? "#b3c8cc" : "#e0d976",
            };

            return { ...feature, options, id };
          })
        );
      });
  }, [ymaps]);

  return (
    <>
      {features && (
        <ObjectManager
          filter={(object) => isShowRegions}
          features={features}
          objects={{
            openBalloonOnClick: true,
          }}
        />
      )}
    </>
  );
};
