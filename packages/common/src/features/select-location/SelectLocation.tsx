import React, { useState, useRef } from "react";
import { useStore } from "effector-react";
import { Select, RefSelectProps, SelectProps, Form, Modal, notification } from "antd";
import { useDebouncedCallback } from "use-debounce";

import { addLocation, useLocations } from "common/src/services/api/locations";
import { $isOnline } from "../../app/offline/lib/isOnlineStore";
import { LocationSelect } from "../../components/LocationSelect";
import { InfoCircleOutlined } from "@ant-design/icons";
import { MapSearch } from "../../components/MapSearch";

type Adress = {
  address: string;
  coordinates: number[];
  country: string;
};

type SelectLocationProps = SelectProps & {
  name: string;
};

export const SelectLocation = React.forwardRef<RefSelectProps, SelectLocationProps>(
  ({ name, ...props }, ref) => {
    const isOnline = useStore($isOnline);
    const { setFieldValue } = Form.useFormInstance();
    const localRef = useRef<RefSelectProps | null>(null);

    const [searchData, setSearchData] = useState<Adress>({
      address: "",
      coordinates: [],
      country: "",
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
    let locationName = searchData.address;
    let locationCord = searchData.coordinates;
    let locationCountry = searchData.country;
    const onAddNewLocation = () => {
      const existingLocation = locations.find((product) => product.name === locationName);

      if (!existingLocation?.name) {
        setCreationLoading(true);
        addLocation({ name: locationName, coordinates: locationCord, country: locationCountry })
          .then(({ id }) => {
            setFieldValue(name, id);
            localRef.current?.blur();
            setSearchData({
              address: "",
              coordinates: [],
              country: "",
            });
          })
          .finally(() => {
            setCreationLoading(false);
          });
      } else {
        notification.info({ message: "Такой город уже есть", icon: <InfoCircleOutlined /> });
        setSearchData({
          address: "",
          coordinates: [],
          country: "",
        });
      }
    };

    const [modalOpen, setModalOpen] = useState(false);
    const [modalSearchName, setModalSearchName] = useState("");

    const onAddLocation = (search: string) => {
      setModalOpen(true);
      setModalSearchName(search);
    };

    const handleClose = () => {
      setModalOpen(false);
      setModalSearchName("");
    };

    const locationOptions = locations.map((d) => (
      <Select.Option key={d.id}>{d.name}</Select.Option>
    ));

    return (
      <>
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
          onAddLocation={onAddLocation}
          {...props}
        >
          {locationOptions}
        </LocationSelect>

        <Modal
          style={{ top: 20 }}
          open={modalOpen}
          onCancel={handleClose}
          okButtonProps={{ style: { display: "none" } }}
          cancelButtonProps={{ style: { display: "none" } }}
        >
          {modalOpen && (
            <MapSearch
              locationName={modalSearchName}
              setSearchData={(searchData) => setSearchData(searchData)}
              handleClose={handleClose}
              onAddNewLocation={onAddNewLocation}
              searchData={searchData}
            />
          )}
        </Modal>
      </>
    );
  }
);
