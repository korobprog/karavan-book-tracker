import React, { useState, useRef } from "react";
import { useStore } from "effector-react";
import { Select, RefSelectProps, SelectProps, Form } from "antd";
import { useDebouncedCallback } from "use-debounce";

import { addLocation, useLocations } from "common/src/services/api/locations";
import { $isOnline } from "../../app/offline/lib/isOnlineStore";
import { LocationSelect } from "../../components/LocationSelect";

type Adress = {
  address: string;
  coordinates: Number[];
};

type SelectLocationProps = SelectProps & { name: string; coordinates: number[] };

export const SelectLocation = React.forwardRef<RefSelectProps, SelectLocationProps>(
  ({ ...props }, ref) => {
    const isOnline = useStore($isOnline);
    const { setFieldValue } = Form.useFormInstance();
    const localRef = useRef<RefSelectProps | null>(null);

    const [locationSearchString, setLocationSearchString] = useState("");
    const { locations, loading } = useLocations({
      searchString: locationSearchString,
    });

    const [creationLoading, setCreationLoading] = useState(false);

    const [datacord, setSearchData] = useState<Adress>();
    console.log("🚀 ~ родительский:", datacord);

    const onLocationSearchChange = useDebouncedCallback((value: string) => {
      const trimmedValue = value.trim();
      setLocationSearchString(trimmedValue.charAt(0).toUpperCase() + trimmedValue.slice(1));
    }, 1000);

    const onAddNewLocation = () => {
      setCreationLoading(true);
      addLocation({
        name: locationSearchString,
      })
        .then(({ id }) => {
          // eslint-disable-next-line no-restricted-globals
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
        setSearchData={(searchData) => setSearchData(searchData)}
        ref={ref}
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
