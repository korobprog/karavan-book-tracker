import React, { useState } from "react";
import { Button, Input, Space } from "antd";
import { CheckOutlined, EditOutlined } from "@ant-design/icons";
import { LocationDoc, updateLocation } from "common/src/services/api/locations";

type CityEditProps = {
  cityData: LocationDoc & { key: string };
};

export const CityNameEdit: React.FC<CityEditProps> = (props) => {
  const { name, ...cityData } = props.cityData;
  const [isEdit, setIsEdit] = useState(false);
  const [cityName, setcityName] = useState(name);

  const saveCityName = async () => {
    if(cityData.id && (name !== cityName)){
      await updateLocation(cityData.id, { name: cityName });
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
          <Input defaultValue={cityName} onChange={(value) => setcityName(value.target.value)} onPressEnter={saveCityName} />
          <Button icon={<CheckOutlined />} onClick={saveCityName}></Button>
        </Space>
      ) : (
        <Space>
          {cityName}
          <Button icon={<EditOutlined />} onClick={toggleEdit}></Button>
        </Space>
      )}
    </>
  );
};
