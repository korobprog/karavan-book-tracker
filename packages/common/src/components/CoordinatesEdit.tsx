import React, { useState } from "react";
import { Button, InputNumber, Space, Input } from "antd";
import { CheckOutlined, EditOutlined } from "@ant-design/icons";
import { LocationDoc, setCoordinates } from "common/src/services/api/locations";

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

  const displayedCoordinates = coordinates ? `${coordinates?.[0]}, ${coordinates?.[1]}` : "";
  const onInputChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    const value = event.target.value;
    const numbers = value.replace("[", "").replace("]", "").split(",");
    const [x, y] = numbers.map((val) => Number(Number(val).toFixed(6)));
    if (x && y) {
      setX(x);
      setY(y);
    }
  };

  return (
    <>
      {isEdit ? (
        <Space direction="vertical">
          <Space>
            <InputNumber value={x} onChange={(value) => setX(value || 0)} />
            <InputNumber value={y} onChange={(value) => setY(value || 0)} />
            <Button icon={<CheckOutlined />} onClick={saveCoordinates} />
          </Space>
          <Input placeholder="[0.0000,0.0000]" onChange={onInputChange} autoFocus />
        </Space>
      ) : (
        <Space>
          {displayedCoordinates}
          <Button icon={<EditOutlined />} onClick={toggleEdit} />
        </Space>
      )}
    </>
  );
};
