import React, { useEffect, useState } from "react";
import { GeolocationControl, Map, Placemark } from "react-yandex-maps";

type MapSearchProps = {
  locationSearchString: string;
};

export const MapSearch = (Props: React.PropsWithChildren<MapSearchProps>) => {
  const { locationSearchString } = Props;
  const [mapConstructor, setMapConstructor] = useState(null);

  const [addressCoord, setAddressCoord] = useState();

  const mapOptions = {
    modules: ["geocode", "SuggestView"],
    defaultOptions: { suppressMapOpenBlock: true },
    width: "auto",
    height: 300,
  };
  const mapState = {
    center: [55.76, 37.64],
    zoom: 12,
    controls: [],
  };

  const geolocationOptions = {
    defaultOptions: { maxWidth: 128 },
    defaultData: { content: "Determine" },
  };

  useEffect(() => {
    const fetchAddressCoord = async () => {
      if (mapConstructor) {
        try {
          // @ts-ignore
          const result = await mapConstructor.geocode(locationSearchString);
          const coord = result.geoObjects.get(0).geometry.getCoordinates();
          setAddressCoord(coord);
        } catch (error) {
          console.error("Error fetching address coordinates:", error);
        }
      }
    };

    fetchAddressCoord();
  }, [locationSearchString, mapConstructor]);

  return (
    <Map
      {...mapOptions}
      // @ts-ignore
      state={addressCoord ? { ...mapState, center: addressCoord } : mapState}
      // @ts-ignore
      onLoad={setMapConstructor}
      defaultState={{
        center: [55.751574, 37.573856],
        zoom: 12,
      }}
    >
      {addressCoord && (
        <Placemark
          geometry={addressCoord}
          iconLayout={"islands#darkGreenStretchyIcon"}
          Clusterer
          options={{
            preset: "islands#yellowStretchyIcon",
          }}
        />
      )}
      <GeolocationControl {...geolocationOptions} />
    </Map>
  );
};
