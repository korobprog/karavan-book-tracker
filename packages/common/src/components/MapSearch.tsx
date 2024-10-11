import React, { useEffect, useRef, useState } from "react";
import { GeolocationControl, Map, Placemark, SearchControl } from "react-yandex-maps";

type MapSearchProps = {
  locationSearchString: string;
};

export const MapSearch = (Props: React.PropsWithChildren<MapSearchProps>) => {
  const { locationSearchString } = Props;
  const searchControlRef = useRef<ymaps.control.SearchControl | null>;
  console.log("🚀 ~ MapSearch ~ locationSearchString:", locationSearchString);
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

  useEffect(() => {
    const fetchSearchControl = async () => {
      // @ts-ignore
      const searchControl = searchControlRef.current;
      if (searchControl) {
        try {
          // @ts-ignore
          await searchControl.events.add("resultselect", (e) => {
            const index = e.get("index");
            // @ts-ignore
            const results = searchControl.getResultsArray();
            // @ts-ignore
            if (results && results.length > 0) {
              const selectedResult = results[index];

              const address = selectedResult.properties.get("name");
              const coordinates = selectedResult.geometry.getCoordinates();

              console.log("Выбранный адрес:", address);
              console.log("Координаты:", coordinates);
            }
          });
        } catch (error) {
          console.error("Error fetching search :", error);
        }
      }
    };
    fetchSearchControl();
  }, [searchControlRef]);

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
      <SearchControl
        instanceRef={(ref) => {
          // @ts-ignore
          searchControlRef.current = ref;
        }}
        options={{ float: "left", size: "large", provider: "yandex#map" }}
      />
    </Map>
  );
};
