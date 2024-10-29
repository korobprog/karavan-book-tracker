import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import { GeolocationControl, Map, Placemark, SearchControl } from "react-yandex-maps";

type MapSearchProps = {
  setDataCoordModal: (newDataCordModal: number[]) => void;
  setDataAdressModal: (newDataAdressModal: string) => void;
  setAddressCoord: (newDataCord: number[]) => void;
  setAddress: string;
  locationSearchString: string;
};

export const MapSearch = forwardRef((Props: React.PropsWithChildren<MapSearchProps>, ref) => {
  const {
    locationSearchString,
    setAddress,
    setDataCoordModal,
    setDataAdressModal,
    setAddressCoord,
  } = Props;

  const searchControlRef = useRef<ymaps.control.SearchControl | null>;

  const [mapConstructor, setMapConstructor] = useState(null);

  const [addressCoord, setAddressCoordMap] = useState();

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
    const fetchAddressCoordStateMap = async () => {
      if (mapConstructor) {
        try {
          // @ts-ignore
          const result = await mapConstructor.geocode(locationSearchString);
          // @ts-ignore

          const coordstate = await result.geoObjects.get(0).geometry.getCoordinates();
          setAddressCoordMap(coordstate);
        } catch (error) {
          console.error("Error fetching address coordinates Map:", error);
        }
      }
    };
    fetchAddressCoordStateMap();
  });

  useEffect(() => {
    const fetchAddressCoord = async () => {
      if (mapConstructor) {
        try {
          // @ts-ignore
          const result = await mapConstructor.geocode(setAddress);

          // @ts-ignore
          const coord = await result.geoObjects.get(0).geometry.getCoordinates();
          setAddressCoord(coord); //не работает
        } catch (error) {
          console.error("Error fetching address coordinates:", error);
        }
      }
    };
    fetchAddressCoord();
  });

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

              const newadress = selectedResult.properties.get("LocalityName");
              console.log("🚀 ~ awaitsearchControl.events.add ~ newadress:", newadress);

              const newcoordinates = selectedResult.geometry.getCoordinates();

              setDataAdressModal(newadress);
              setDataCoordModal(newcoordinates);
            }
          });
        } catch (error) {
          console.error("Error fetching search :", error);
        }
      }
    };
    fetchSearchControl();
  });

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
});
