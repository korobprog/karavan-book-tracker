import React, { useState, useRef } from "react";
import { useStore } from "effector-react";
import { Select, RefSelectProps, SelectProps, Form } from "antd";
import { useDebouncedCallback } from "use-debounce";

import { addLocation, useLocations } from "common/src/services/api/locations";
import { $isOnline } from "../../app/offline/lib/isOnlineStore";
import { LocationSelect } from "../../components/LocationSelect";

type SelectLocationProps = SelectProps & { name: string };

export const SelectLocation = React.forwardRef<RefSelectProps, SelectLocationProps>(
  ({ name, ...props }, ref) => {
    const isOnline = useStore($isOnline);
    const { setFieldValue } = Form.useFormInstance();
    const localRef = useRef<RefSelectProps | null>(null);

    const [locationSearchString, setLocationSearchString] = useState("");
    const { locations, loading } = useLocations({
      searchString: locationSearchString,
    });
    const [creationLoading, setCreationLoading] = useState(false);

    const [cords, setAddressCoord] = useState<number[]>([]); //работает
    console.log("🚀 ~ cords:", cords);

    const [adressmodal, setDataAdressModal] = useState(""); //работает
    console.log("🚀 ~ adressmodal:", adressmodal);

    const [coordinatesmodal, setDataCoordModal] = useState<number[]>([]); // работает
    console.log("🚀 ~ coordinatesmodal:", coordinatesmodal);

    const onLocationSearchChange = useDebouncedCallback((value: string) => {
      const trimmedValue = value.trim();
      setLocationSearchString(trimmedValue.charAt(0).toUpperCase() + trimmedValue.slice(1));
    }, 1000);

    const onAddNewLocation = () => {
      setCreationLoading(true);
      addLocation({ name: locationSearchString })
        .then(({ id }) => {
          setFieldValue(name, id);
          localRef.current?.blur();
          setLocationSearchString("");
        })
        .finally(() => {
          setCreationLoading(false);
        });
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
        onSearch={onLocationSearchChange}
        onAddNewLocation={onAddNewLocation}
        locationSearchString={locationSearchString}
        isOnline={isOnline}
        loading={loading || creationLoading}
        autoClearSearchValue
        setDataAdressModal={setDataAdressModal}
        setDataCordModal={setDataCoordModal}
        setAddressCoord={setAddressCoord}
        {...props}
      >
        {locationOptions}
      </LocationSelect>
    );
  }
);
