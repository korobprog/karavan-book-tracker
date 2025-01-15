import React, { useState } from "react";
import { Button, Input, Space } from "antd";
import { CheckOutlined, EditOutlined, CloseOutlined } from "@ant-design/icons";
import { LocationDoc, updateLocation } from "common/src/services/api/locations";

type LocationEditProps = {
  locationData: LocationDoc & { key: string };
};

export const LocationCountryEdit: React.FC<LocationEditProps> = (props) => {
  const { country, ...locationData } = props.locationData;

  const [isEdit, setIsEdit] = useState(false);
  const [locationCountry, setLocationCountry] = useState(country);

  const saveLocationCountry = async () => {
    if (locationData.id && country !== locationCountry) {
      await updateLocation(locationData.id, { country: locationCountry });
    }
    setIsEdit(false);
  };

  const toggleEdit = () => {
    setIsEdit(!isEdit);
  };

  return (
    <>
      {isEdit ? (
        <Space>
          <Input
            defaultValue={country}
            onChange={(value) => setLocationCountry(value.target.value)}
            onPressEnter={saveLocationCountry}
          />
          <Button icon={<CheckOutlined />} onClick={saveLocationCountry} />
          <Button icon={<CloseOutlined />} onClick={toggleEdit} />
        </Space>
      ) : (
        <Space>
          {country}
          <Button icon={<EditOutlined />} onClick={toggleEdit} />
        </Space>
      )}
    </>
  );
};
