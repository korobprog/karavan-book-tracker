import React, { useState, useRef } from "react";
import { useStore } from "effector-react";
import { Select, RefSelectProps, SelectProps, Form, notification } from "antd";
import { useDebouncedCallback } from "use-debounce";

import { addLocation, useLocations } from "common/src/services/api/locations";
import { $isOnline } from "../../app/offline/lib/isOnlineStore";
import { LocationSelect } from "../../components/LocationSelect";
import { InfoCircleOutlined } from "@ant-design/icons";

type Adress = {
  address: string;
  coordinates: number[];
};

type SelectLocationProps = SelectProps & {
  name: string;
  coordinates: number[];
};

export const SelectLocation = React.forwardRef<RefSelectProps, SelectLocationProps>(
  ({ name, ...props }, ref) => {
    const isOnline = useStore($isOnline);
    const { setFieldValue } = Form.useFormInstance();
    const localRef = useRef<RefSelectProps | null>(null);

    const [searchdata, setSearchData] = useState<Adress>({
      address: "",
      coordinates: [],
    });

    const [locationSearchString, setLocationSearchString] = useState("");
    const { locations, loading } = useLocations({
      searchString: locationSearchString,
    });
    const [creationLoading, setCreationLoading] = useState(false);

    const onLocationSearchChange = useDebouncedCallback((value: string) => {
      const trimmedValue = value.trim();
      setLocationSearchString(trimmedValue.charAt(0).toUpperCase() + trimmedValue.slice(1));
    }, 1000);

    let locationname = searchdata.address;

    let locationcord = searchdata.coordinates;

    const onAddNewLocation = () => {
      const existingLocation = locations.find((product) => product.name === locationname);

      if (!existingLocation?.name) {
        setCreationLoading(true);
        addLocation({ name: locationname, coordinates: locationcord })
          .then(({ id }) => {
            setFieldValue(name, id);
            localRef.current?.blur();
            setSearchData({
              address: "",
              coordinates: [],
            });
          })
          .finally(() => {
            setCreationLoading(false);
          });
      } else {
        notification.success({ message: "Такой город уже есть", icon: <InfoCircleOutlined /> });
        setSearchData({
          address: "",
          coordinates: [],
        });
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
        searchdata={searchdata}
        {...props}
      >
        {locationOptions}
      </LocationSelect>
    );
  }
);
