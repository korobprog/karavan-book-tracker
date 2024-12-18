import React, { useState } from "react";
import { PlusOutlined } from "@ant-design/icons";
import { Select, SelectProps, Typography, RefSelectProps, Modal } from "antd";
import { MapSearch } from "./MapSearch";

type Adress = {
  address: string;
  coordinates: number[];
};

type LocationSelectProps = SelectProps & {
  onAddNewLocation: () => void;
  setSearchData: (searchData: Adress) => void;
  locationSearchString: string;
  isOnline?: boolean;
  loading?: boolean;
};

export const LocationSelect = React.forwardRef<RefSelectProps, LocationSelectProps>(
  (props, ref) => {
    const {
      onAddNewLocation,
      setSearchData,
      locationSearchString,
      children,
      isOnline,
      loading,
      ...restProps
    } = props;

    const [modal1Open, setModal1Open] = useState(false);

    const [adressantd, setAddressAntd] = useState("");

    const handleCancel = () => {
      setModal1Open(false);
    };

    const handleOpen = () => {
      setAddressAntd(locationSearchString);
    };

    return (
      <>
        <Select
          ref={ref}
          showSearch
          placeholder="Начните вводить..."
          defaultActiveFirstOption={false}
          autoClearSearchValue={false}
          suffixIcon={null}
          filterOption={false}
          allowClear
          notFoundContent={
            !loading && (
              <>
                <Typography.Paragraph style={{ whiteSpace: "nowrap" }}>
                  Такого места пока нет
                </Typography.Paragraph>

                {isOnline ? (
                  <Typography.Link
                    onClick={() => {
                      setModal1Open(true);
                      handleOpen();
                    }}
                    style={{ whiteSpace: "nowrap" }}
                  >
                    <PlusOutlined /> Добавить "{locationSearchString}"
                  </Typography.Link>
                ) : (
                  <Typography.Text>
                    Пока вы оффлайн нельзя добавить город, подключите интернет и проверьте, возможно
                    такой город уже есть в базе
                  </Typography.Text>
                )}
              </>
            )
          }
          {...restProps}
        >
          {children}
        </Select>
        <Modal
          style={{ top: 20 }}
          open={modal1Open}
          onCancel={handleCancel}
          okButtonProps={{ style: { display: "none" } }}
          cancelButtonProps={{ style: { display: "none" } }}
        >
          {modal1Open && (
            <MapSearch
              setAddressAntd={adressantd}
              setNewSearchData={(location) => setSearchData(location)}
              handleCancel={handleCancel}
              onAddNewLocation={onAddNewLocation}
              handleOpen={handleOpen}
            />
          )}
        </Modal>
      </>
    );
  }
);
