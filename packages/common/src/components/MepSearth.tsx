/* import React, { useState, useEffect } from "react";
import { YMaps, Map, Placemark, useYMaps } from "@pbe/react-yandex-maps";


const App = () => {
  const [center, setCenter] = useState([55.751574, 37.573856]);
  const [zoom, setZoom] = useState(12);
  const [placemark, setPlacemark] = useState(null);

  useEffect(() => {
    const ymaps = useYMaps(['Map']);
    if (!ymaps) {
      return;
    }
    ymaps.ready(() => {
      const myMap = new ymaps.Map("map", {
        center: center,
        zoom: zoom,
      });
      const myPlacemark = new ymaps.Placemark(
        center,
        {
          iconCaption: "searching...",
        },
        {
          preset: "islands#violetDotIconWithCaption",
          draggable: true,
        }
      );
      myMap.geoObjects.add(myPlacemark);
      myMap.events.add("click", (e) => {
        const coords = e.get("coords");
        setCenter(coords);
        getAddress(coords);
      });
    });
  }, []);

  const getAddress = (coords) => {
    const ymaps = useYMaps(['Map']);
    if (!ymaps) {
      return;
    }
    if (!ymaps) {
      return;
    }
    ymaps.geocode(coords).then((res) => {
      const firstGeoObject = res.geoObjects.get(0).;
      setPlacemark({
 
      });
    });
  };

  return (
    <YMaps version="2.1" query={{ apikey: "YOUR_API_KEY" }}>
      <div>
        <Map modules={["geocode"]} state={{ center, zoom }} width="100%" height="500px">
          {placemark && <Placemark geometry={center} properties={placemark.properties} />}
        </Map>
      </div>
    </YMaps>
  );
};

export default App;
 */
