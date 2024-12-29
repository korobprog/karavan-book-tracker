import React, { forwardRef, useEffect, useState } from "react";
import { GeolocationControl, Map, Placemark, SearchControl, YMapsApi } from "react-yandex-maps";
import { Button, notification } from "antd";

type Adress = {
  address: string;
  coordinates: number[];
  country: string;
};

type MapSearchProps = {
  locationName: string;
  setSearchData: (searchData: Adress) => void;
  handleClose: () => void;
  onAddNewLocation: () => void;
  searchData: Adress;
};

export const MapSearch = forwardRef((Props: React.PropsWithChildren<MapSearchProps>, ref) => {
  const { locationName, handleClose, onAddNewLocation, setSearchData, searchData } = Props;

  const [searchControl, setSearchControl] = useState<ymaps.control.SearchControl | null>(null);
  const [mapConstructor, setMapConstructor] = useState<YMapsApi | null>(null);

  const [addressCoord, setAddressCoordMap] = useState<number[]>();

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
        const result = await mapConstructor.geocode(locationName);
        const coordstate = result.geoObjects.get(0)?.geometry.getCoordinates();
        const firstGeoObject = result.geoObjects.get(0);
        const searchMapNewAdress = firstGeoObject?.getLocalities(0);
        const searchMapCountry = firstGeoObject?.getCountryCode();

        if (coordstate && searchMapNewAdress) {
          setSearchData({
            address: searchMapNewAdress,
            coordinates: coordstate,
            country: searchMapCountry,
          });
        } else {
          notification.info({ message: "Город не найден, воспользуйтесь поиском" });
        }
        setAddressCoordMap(coordstate);
      } catch (error) {
        console.error("Error fetching address coordinates Map:", error);
      }
    };
    fetchAddressCoordStateMap();
  }, [locationName, mapConstructor]);

  useEffect(() => {
    if (searchControl) {
      try {
        searchControl.events.add("resultselect", (e) => {
          const index = e.get("index");
          const results = searchControl.getResultsArray();
          if (results && results.length > 0) {
            const selectedResult = results[index];
            // @ts-ignore
            const searchMapNewAdress = selectedResult.properties.get(
              "metaDataProperty.GeocoderMetaData.AddressDetails.Country.AdministrativeArea.SubAdministrativeArea.Locality.LocalityName"
            );
            // @ts-ignore
            const searchMapNewCoordinates = selectedResult.geometry.getCoordinates();
            // @ts-ignore
            const country = selectedResult.getCountryCode();

            if (searchMapNewCoordinates && searchMapNewAdress && country) {
              setSearchData({
                address: searchMapNewAdress,
                coordinates: searchMapNewCoordinates,
                country: country,
              });
            }
          }
        });
      } catch (error) {
        console.error("Error fetching search :", error);
      }
    }
  }, [searchControl]);

  const handleGeolocationClick = async () => {
    try {
      navigator.geolocation.getCurrentPosition(async (position) => {
        if (mapConstructor) {
          const searchMapNewCoordinates = [position.coords.latitude, position.coords.longitude];
          // @ts-ignore
          const result = await mapConstructor.geocode(searchMapNewCoordinates);

          const firstGeoObject = result.geoObjects.get(0);
          const searchMapNewAdress = firstGeoObject.getLocalities(0);
          const searchMapCountry = firstGeoObject?.getCountryCode();

          if (searchMapNewCoordinates && searchMapNewAdress && searchMapCountry) {
            setSearchData({
              address: searchMapNewAdress,
              coordinates: searchMapNewCoordinates,
              country: searchMapCountry,
            });
          } else {
            notification.info({ message: "Город не найден, воспользуйтесь поиском" });
          }
        }
      });
    } catch (error) {
      notification.info({ message: "Ошибка получения геолокации" });
      console.error("Ошибка получения геолокации:", error);
    }
  };

  const onAddNewLocationClick = async () => {
    try {
      await onAddNewLocation();
      setSearchData({
        address: "",
        coordinates: [],
        country: "",
      });
      handleClose();
    } catch (error) {
      console.error("Ошибка при добавлении новой локации:", error);
    }
  };

  return (
    <Map
      {...mapOptions}
      state={addressCoord ? { ...mapState, center: addressCoord } : mapState}
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
          if (ref) {
            // @ts-ignore
            setSearchControl(ref);
          }
        }}
        options={{ float: "left", size: "small", provider: "yandex#map" }}
      />{" "}
      <Button
        key="submit"
        type="primary"
        onClick={() => {
          onAddNewLocationClick();
        }}
        disabled={searchData.address ? false : true}
      >
        {`Выбрать ${searchData.address || "Выберете город или поселок"}`}
      </Button>
    </Map>
  );
});
