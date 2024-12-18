import React, { useState, useRef } from "react";
import { useStore } from "effector-react";
import { Select, RefSelectProps, SelectProps, Form } from "antd";
import { useDebouncedCallback } from "use-debounce";

import { addLocation, useLocations } from "common/src/services/api/locations";
import { $isOnline } from "../../app/offline/lib/isOnlineStore";
import { LocationSelect } from "../../components/LocationSelect";

type Adress = {
  address: string;
  coordinates: number[];
};

type SelectLocationProps = SelectProps & { name: string; coordinates: number[] };

export const SelectLocation = React.forwardRef<RefSelectProps, SelectLocationProps>(
  ({ name, ...props }, ref) => {
    const isOnline = useStore($isOnline);
    const { setFieldValue } = Form.useFormInstance();
    const localRef = useRef<RefSelectProps | null>(null);

    const [datacord, setSearchData] = useState<Adress>();
    console.log("🚀 ~ datacord:", datacord);

    const [locationSearchString, setLocationSearchString] = useState("");
    const { locations, loading } = useLocations({
      searchString: locationSearchString,
    });
    const [creationLoading, setCreationLoading] = useState(false);

    const onLocationSearchChange = useDebouncedCallback((value: string) => {
      const trimmedValue = value.trim();
      setLocationSearchString(trimmedValue.charAt(0).toUpperCase() + trimmedValue.slice(1));
    }, 1000);

    let locationname = datacord?.address ? datacord?.address : locationSearchString;
    let locationcord = datacord?.coordinates;

    const onAddNewLocation = () => {
      if (locationname && locationcord) {
        setCreationLoading(true);
        addLocation({ name: locationname, coordinates: locationcord })
          .then(({ id }) => {
            setFieldValue(name, id);
            localRef.current?.blur();
            setLocationSearchString("");
            setSearchData(datacord);
          })
          .finally(() => {
            setCreationLoading(false);
          });
      } else {
        console.log("Ошибка локации");
      }
    };

    const locationOptions = locations.map((d) => (
      <Select.Option key={d.id}>{d.name}</Select.Option>
    ));

    return (
      <LocationSelect
        ref={(node) => {
          localRef.current = node;
          if (typeof ref === "function") {
            ref(node);
          } else if (ref) {
            ref.current = node;
          }
        }}
        // ref={ref}
        onSearch={onLocationSearchChange}
        onAddNewLocation={onAddNewLocation}
        locationSearchString={locationSearchString}
        isOnline={isOnline}
        loading={loading || creationLoading}
        autoClearSearchValue
        setSearchData={(searchData) => setSearchData(searchData)}
        {...props}
      >
        {locationOptions}
      </LocationSelect>
    );
  }
);
