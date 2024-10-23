import React, { useState, useRef } from "react";
import { useStore } from "effector-react";
import { Select, RefSelectProps, SelectProps, Form } from "antd";
import { useDebouncedCallback } from "use-debounce";

import { addLocation, useLocations } from "common/src/services/api/locations";
import { $isOnline } from "../../app/offline/lib/isOnlineStore";
import { LocationSelect } from "../../components/LocationSelect";

type SelectLocationProps = SelectProps & { name: string; coordinates: number[] };

export const SelectLocation = React.forwardRef<RefSelectProps, SelectLocationProps>(
  ({ name, coordinates, ...props }, ref) => {
    const isOnline = useStore($isOnline);
    const { setFieldValue } = Form.useFormInstance();
    const localRef = useRef<RefSelectProps | null>(null);
    const [adressmodal, setDataAdressModal] = useState("");
    const [locationSearchString, setLocationSearchString] = useState("");
    const { locations, loading } = useLocations({
      searchString: locationSearchString ? locationSearchString : adressmodal,
    });

    const [creationLoading, setCreationLoading] = useState(false);

    const [cords, setDataCord] = useState<number[]>();
    console.log("🚀 ~ cords:", cords);

    const [coordinatesmodal, setDataCoordModal] = useState<number[]>();

    const onLocationSearchChange = useDebouncedCallback((value: string) => {
      const trimmedValue = value.trim();
      setLocationSearchString(trimmedValue.charAt(0).toUpperCase() + trimmedValue.slice(1));
    }, 1000);

    const onAddNewLocation = () => {
      setCreationLoading(true);
      addLocation({
        name: locationSearchString ? locationSearchString : adressmodal,
        coordinates: cords ? cords : coordinatesmodal,
      })
        .then(({ id }) => {
          setFieldValue(name, id);
          localRef.current?.blur();
          setLocationSearchString("");
          setDataCord([]);
          setDataAdressModal("");
          setDataCoordModal([]);
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
        ref={ref}
        setDataCoordModalClick={(newDataCordModal: number[]) => setDataCoordModal(newDataCordModal)}
        setDataAdressModalClick={(newDataAdressModal: string) =>
          setDataAdressModal(newDataAdressModal)
        }
        setDataCoordClick={(newDataCordClick: number[]) => setDataCord(newDataCordClick)}
        onSearch={onLocationSearchChange}
        onAddNewLocation={onAddNewLocation}
        locationSearchString={locationSearchString}
        isOnline={isOnline}
        loading={loading || creationLoading}
        autoClearSearchValue
        {...props}
      >
        {locationOptions}
      </LocationSelect>
    );
  }
);
