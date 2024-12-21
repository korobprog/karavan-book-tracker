import React, { forwardRef, useEffect, useRef, useState } from "react";
import { GeolocationControl, Map, Placemark, SearchControl } from "react-yandex-maps";
import { Button } from "antd";

type Adress = {
  address: string;
  coordinates: number[];
};

type MapSearchProps = {
  setAddressAntd: string;
  handleOpen: () => true;
  setSearchData: (searchData: Adress) => void;
  handleCancel: () => void;
  onAddNewLocation: () => void;
  searchdata: Adress;
};

export const MapSearch = forwardRef((Props: React.PropsWithChildren<MapSearchProps>, ref) => {
  const { setAddressAntd, handleCancel, onAddNewLocation, handleOpen, setSearchData, searchdata } =
    Props;

  const searchControlRef = useRef<ymaps.control.SearchControl | null>;

  const [mapConstructor, setMapConstructor] = useState(null);

  const [addressCoord, setAddressCoordMap] = useState<number[]>();

  const [hasFetched, setHasFetched] = useState<boolean>(true); // Состояние для отслеживания вызова функции

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
      if (!mapConstructor) return;
      try {
        // @ts-ignore
        const cords = await mapConstructor.geocode(setAddressAntd);
        // @ts-ignore
        const coordstate = cords.geoObjects.get(0).geometry.getCoordinates();

        const firstGeoObject = cords.geoObjects.get(0);

        const searchmapnewadress = firstGeoObject.getLocalities();

        if (coordstate && searchmapnewadress) {
          setSearchData({
            address: searchmapnewadress,
            coordinates: coordstate,
          });
        } else {
          alert("город не найден, воспользуйтесь поиском");
        }
        setAddressCoordMap(coordstate);
      } catch (error) {
        console.error("Error fetching address coordinates Map:", error);
      }
    };
    if (handleOpen() && hasFetched) {
      // Проверяем состояние и вызываем функцию
      fetchAddressCoordStateMap();
      setHasFetched(true); // Устанавливаем состояние в true после вызова функции
    }
  }, [mapConstructor]);

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

              const searchmapnewadress = selectedResult.properties.get(
                "metaDataProperty.GeocoderMetaData.AddressDetails.Country.AdministrativeArea.SubAdministrativeArea.Locality.LocalityName"
              );
              const searchmapnewcoordinates = selectedResult.geometry.getCoordinates();
              setSearchData({
                address: searchmapnewadress,
                coordinates: searchmapnewcoordinates,
              });
            }
          });
        } catch (error) {
          console.error("Error fetching search :", error);
        }
      }
    };
    fetchSearchControl();
  }, []);

  const handleGeolocationClick = async () => {
    try {
      navigator.geolocation.getCurrentPosition(async (position) => {
        if (mapConstructor) {
          const searchmapnewcoordinates: any = [
            position.coords.latitude,
            position.coords.longitude,
          ];

          // @ts-ignore

          const result = await mapConstructor.geocode(searchmapnewcoordinates);

          const firstGeoObject = result.geoObjects.get(0);
          const searchmapnewadress = firstGeoObject.getLocalities(); // Получаем полный адрес

          if (searchmapnewcoordinates && searchmapnewadress) {
            setSearchData({
              address: searchmapnewadress,
              coordinates: searchmapnewcoordinates,
            });
          } else {
            alert("город не найден, воспользуйтесь поиском");
          }
        }
      });
    } catch (error) {
      console.error("Ошибка получения геолокации:", error);
    }
  };

  const onAddNewLocationClick = async () => {
    try {
      await onAddNewLocation();
      setSearchData({
        address: "",
        coordinates: [],
      });
      handleCancel();
    } catch (error) {
      console.error("Ошибка при добавлении новой локации:", error);
    }
  };

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
      style={{ width: "100%", height: "600px" }}
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
      <GeolocationControl
        {...geolocationOptions}
        options={{ float: "right" }}
        onClick={handleGeolocationClick}
      />
      <SearchControl
        instanceRef={(ref) => {
          // @ts-ignore
          searchControlRef.current = ref;
        }}
        options={{ float: "left", size: "small", provider: "yandex#map" }}
      />{" "}
      <Button
        key="submit"
        type="primary"
        onClick={() => {
          onAddNewLocationClick();
        }}
        disabled={searchdata.address ? false : true}
      >
        {`Выбрать ${searchdata.address || "Выберете город или поселок"}`}
      </Button>
    </Map>
  );
});
