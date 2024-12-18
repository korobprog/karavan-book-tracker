import React, { forwardRef, useEffect, useRef, useState } from "react";
import { GeolocationControl, Map, Placemark, SearchControl } from "react-yandex-maps";
import { Button } from "antd";

type Adress = {
  address: string;
  coordinates: number[];
};

type MapSearchProps = {
  setAddressAntd: string;
  handleOpen: () => void;
  setNewSearchData: (searchData: Adress) => void;
  handleCancel: () => void;
  onAddNewLocation: () => void;
};

export const MapSearch = forwardRef((Props: React.PropsWithChildren<MapSearchProps>, ref) => {
  const { setAddressAntd, setNewSearchData, handleCancel, onAddNewLocation, handleOpen } = Props;
  console.log("🚀 ~ MapSearch ~ setAddressAntd:", setAddressAntd);

  const searchControlRef = useRef<ymaps.control.SearchControl | null>;

  const [mapConstructor, setMapConstructor] = useState(null);

  const [addressCoord, setAddressCoordMap] = useState();

  const [searchData, setSearchData] = useState<Adress>({
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
      if (mapConstructor && setAddressAntd) {
        try {
          // тут принимает название города и конвертирует  его в coords
          // @ts-ignore
          const result = await mapConstructor.geocode(setAddressAntd);
          // @ts-ignore
          const coordstate = await result.geoObjects.get(0).geometry.getCoordinates();
          setAddressCoordMap(coordstate);

          setSearchData({
            address: setAddressAntd,
            coordinates: coordstate,
          });
        } catch (error) {
          console.error("Error fetching address coordinates Map:", error);
        }
      } else {
        console.log("Ошиька получения локации");
      }
    };
    fetchAddressCoordStateMap();
  }, [handleOpen]);

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
      navigator.geolocation.getCurrentPosition(async (position) => {
        if (mapConstructor) {
          const searchmapnewcoordinates: any = [
            position.coords.latitude,
            position.coords.longitude,
          ];

          // Обратное геокодирование
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

  const trimAdress = (str: string, maxLength: number) => {
    if (str.length > maxLength) {
      return str.slice(0, maxLength) + "...";
    }
    return str;
  };
  const str: string = searchData.address;
  const trimmedString: string = trimAdress(str, 10);

  const onAddNewLocationClick = () => {
    if (searchData) {
      setNewSearchData(searchData);
      setSearchData({
        address: "",
        coordinates: [],
      });
      handleCancel();
      onAddNewLocation();
    } else {
      alert("Ошибка сервера, попробуйте еще раз");
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
        disabled={trimmedString ? false : true}
      >
        {`Выбрать ${trimmedString}`}
      </Button>
    </Map>
  );
});
