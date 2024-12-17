import React, { forwardRef, useEffect, useRef, useState } from "react";
import { GeolocationControl, Map, Placemark, SearchControl } from "react-yandex-maps";
import { Button, Tooltip } from "antd";

type Adres = {
  address: string;
  coordinates: Number[];
};

type MapSearchProps = {
  setAddressAntd: string;
  setSearchData: (searchData: Adres) => void;
};

export const MapSearch = forwardRef((Props: React.PropsWithChildren<MapSearchProps>, ref) => {
  const { setAddressAntd } = Props;
  // Получаю разовый адрес с ANTD
  const adressantd = setAddressAntd;

  const searchControlRef = useRef<ymaps.control.SearchControl | null>;

  const [mapConstructor, setMapConstructor] = useState(null);

  const [addressCoord, setAddressCoordMap] = useState();

  const [searchData, setSearchData] = useState({
    address: "",
    coordinates: [],
  });

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
          // тут принимает название города и конвертирует  его в coords
          // @ts-ignore
          const result = await mapConstructor.geocode(adressantd);
          // @ts-ignore
          const coordstate = await result.geoObjects.get(0).geometry.getCoordinates();
          setAddressCoordMap(coordstate);

          setSearchData({
            address: adressantd,
            coordinates: coordstate,
          });
        } catch (error) {
          console.error("Error fetching address coordinates Map:", error);
        }
      }
    };
    fetchAddressCoordStateMap();
  }, [adressantd]);

  const onAddNewLocationClick = () => {
    setSearchData(searchData);
  };

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
              // Получение название города
              const searchmapnewadress = selectedResult.properties.get(
                "metaDataProperty.GeocoderMetaData.AddressDetails.Country.AdministrativeArea.SubAdministrativeArea.Locality.LocalityName"
              );
              // Новые координаты с карты яд
              const searchmapnewcoordinates = selectedResult.geometry.getCoordinates();
              if (searchmapnewadress && selectedResult) {
                setSearchData({
                  address: searchmapnewadress,
                  coordinates: searchmapnewcoordinates,
                });
              } else console.error("Только город или поселение");
            }
          });
        } catch (error) {
          console.error("Error fetching search :", error);
        }
      }
    };
    fetchSearchControl();
  });

  const handleGeolocationClick = async () => {
    try {
      await navigator.geolocation.getCurrentPosition(async (position) => {
        if (mapConstructor) {
          const coords = [position.coords.latitude, position.coords.longitude];

          // Обратное геокодирование
          // @ts-ignore
          const result = await mapConstructor.geocode(coords);

          const firstGeoObject = result.geoObjects.get(0);
          const newAddress = firstGeoObject.getLocalities(); // Получаем полный адрес
          if (newAddress) {
            console.log(
              "🚀 ~ await navigator.geolocation.getCurrentPosition ~ newAddress:",
              newAddress,
              coords
            );
          } else {
            alert("город не найден, воспользуйтесь поиском");
          }
        }
      });
    } catch (error) {
      console.error("Ошибка получения геолокации:", error);
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
        options={{ float: "left", size: "large", provider: "yandex#map" }}
      />{" "}
      <Button
        key="submit"
        type="primary"
        onClick={() => {
          onAddNewLocationClick();
        }}
      >
        {`Выбрать место локации где были распространены книги`}
      </Button>
    </Map>
  );
});
