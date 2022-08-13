import React, { useState } from "react";
import { Button, InputNumber, Space } from "antd";
import { LocationDoc, setCoordinates } from "../../firebase/useLocations";
import { CheckOutlined, EditOutlined } from "@ant-design/icons";

type CoordinatesEditProps = {
  location: LocationDoc & { key: string };
  locations: LocationDoc[];
};

export const CoordinatesEdit: React.FC<CoordinatesEditProps> = (props) => {
  const { coordinates, ...location } = props.location;

  const [x, setX] = useState(coordinates?.[0] || 0);
  const [y, setY] = useState(coordinates?.[1] || 0);
  const [isEdit, setIsEdit] = useState(false);

  const toggleEdit = () => {
    setIsEdit(!isEdit);
  };

  const saveCoordinates = () => {
    const newLocation = props.locations.find((loc) => loc.id === location.key);
    if (newLocation && x && y) {
      setCoordinates(x, y, newLocation);
    }
    setIsEdit(false);
  };

  const displayedCoordinates = coordinates
    ? `${coordinates?.[0]}, ${coordinates?.[1]}`
    : "";

  return (
    <>
      {isEdit ? (
        <Space>
          <InputNumber defaultValue={x} onChange={setX} />
          <InputNumber defaultValue={y} onChange={setY} />
          <Button icon={<CheckOutlined />} onClick={saveCoordinates}></Button>
        </Space>
      ) : (
        <Space>
          {displayedCoordinates}
          <Button icon={<EditOutlined />} onClick={toggleEdit}></Button>
        </Space>
      )}
    </>
  );
};
