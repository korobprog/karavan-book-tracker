import React, { useState } from "react";
import { useStore } from "effector-react";
import { Select } from "antd";
import { useDebouncedCallback } from "use-debounce";

import { addLocation, useLocations } from "common/src/services/api/locations";
import { $isOnline } from "../../app/offline/lib/isOnlineStore";
import { LocationSelect } from "../../components/LocationSelect";

export const SelectLocation: React.FC = (props) => {
  const isOnline = useStore($isOnline);

  const [locationSearchString, setLocationSearchString] = useState("");
  const { locations, loading } = useLocations({
    searchString: locationSearchString,
  });

  const onLocationChange = useDebouncedCallback((value: string) => {
    const trimmedValue = value.trim();
    setLocationSearchString(trimmedValue.charAt(0).toUpperCase() + trimmedValue.slice(1));
  }, 1000);

  const onAddNewLocation = () => {
    addLocation({ name: locationSearchString });
    setLocationSearchString("");
  };

  const locationOptions = locations.map((d) => <Select.Option key={d.id}>{d.name}</Select.Option>);

  return (
    <LocationSelect
      onSearch={onLocationChange}
      onAddNewLocation={onAddNewLocation}
      locationSearchString={locationSearchString}
      isOnline={isOnline}
      loading={loading}
    >
      {locationOptions}
    </LocationSelect>
  );
};
