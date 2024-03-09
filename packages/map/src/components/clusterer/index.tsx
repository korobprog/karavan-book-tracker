import React from "react";
import {
  Clusterer as YClusterer,
  ClustererProps as YClustererProps,
  YMapsApi,
} from "react-yandex-maps";

import "./index.less";

type ClustererProps = YClustererProps & {
  ymaps: YMapsApi;
};

export const Clusterer: React.FC<ClustererProps> = ({ ymaps, ...restProps }) => {
  const createIconShape = () => {
    return {
      type: "Circle",
      coordinates: [19, 25],
      radius: 25,
    };
  };

  const createCluster = () => {
    if (ymaps) {
      return ymaps.templateLayoutFactory.createClass(
        `<div id='counter'
          {% if properties.count %}
            class="clusterer"
          {% endif %}
        >
        {{ properties.count }}
        </div>`,
        {
          build: function () {
            this.constructor.superclass.build.call(this);
            let count = 0;
            const data = this.getData();

            for (let obj in data.properties._data.geoObjects) {
              count += parseInt(data.properties._data.geoObjects[obj].properties._data.count);
            }

            data.properties.set("count", count);
          },
        }
      );
    }
  };

  return (
    <YClusterer
      options={{
        // preset: "islands#invertedVioletClusterIcons",
        groupByCoordinates: false,
        // gridSize: 180,
        zoomMargin: 100,
        clusterIconLayout: createCluster(),
        clusterIconShape: createIconShape(),
        iconImageSize: [45, 40],
        iconImageOffset: [-19, -44],
      }}
      {...restProps}
    />
  );
};
