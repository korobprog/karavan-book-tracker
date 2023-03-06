import React, { useState } from "react";
import { Button, Input, Space } from "antd";
import { CheckOutlined, EditOutlined, CloseOutlined } from "@ant-design/icons";
import { LocationDoc, updateLocation } from "common/src/services/api/locations";

type LocationEditProps = {
  locationData: LocationDoc & { key: string };
};

export const LocationNameEdit: React.FC<LocationEditProps> = (props) => {
  const { name, ...locationData } = props.locationData;
  const [isEdit, setIsEdit] = useState(false);
  const [locationName, setLocationName] = useState(name);

  const saveLocationName = async () => {
    if(locationData.id && (name !== locationName)){
      await updateLocation(locationData.id, { name: locationName });
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
          <Input defaultValue={name} onChange={(value) => setLocationName(value.target.value)} onPressEnter={saveLocationName} />
          <Button icon={<CheckOutlined />} onClick={saveLocationName} />
          <Button icon={<CloseOutlined />} onClick={toggleEdit} />
        </Space>
      ) : (
        <Space>
          {name}
          <Button icon={<EditOutlined />} onClick={toggleEdit} />
        </Space>
      )}
    </>
  );
};
