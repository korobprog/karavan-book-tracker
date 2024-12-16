import React, { useState } from "react";
import { PlusOutlined } from "@ant-design/icons";
import { Select, SelectProps, Typography, RefSelectProps, Modal } from "antd";
import { MapSearch } from "./MapSearch";

type LocationSelectProps = SelectProps & {
  onAddNewLocation: () => void;
  setDataCoordModalClick: (newDataCordModalClick: number[]) => void;
  setDataAdressModalClick: (newDataAdressModalClick: string) => void;
  setDataCoordClick: (newDataCordClick: number[]) => void;
  setAddressClick: (newDataAddressClick: string) => void;
  locationSearchString: string;
  isOnline?: boolean;
  loading?: boolean;
};

export const LocationSelect = React.forwardRef<RefSelectProps, LocationSelectProps>(
  (props, ref) => {
    const {
      onAddNewLocation,
      setDataAdressModalClick,
      setDataCoordModalClick,
      setDataCoordClick,
      setAddressClick,
      locationSearchString,
      children,
      isOnline,
      loading,
      ...restProps
    } = props;

    const [modal1Open, setModal1Open] = useState(false);

    /*     const [loadingCity, setLoading] = useState(false);

    const [cords, setAddressCoord] = useState<number[]>(); */

    const [adress, setAddress] = useState("");

    const [adressmodal, setDataAdressModal] = useState("");

    const [coordinatesmodal, setDataCoordModal] = useState<number[]>();

    const handleButtonClick = () => {
      setAddress(locationSearchString);
    };

    <Typography.Link onClick={handleButtonClick} style={{ whiteSpace: "nowrap" }}>
      <PlusOutlined />
      Добавить "{locationSearchString}"
    </Typography.Link>;

    const handleCancel = () => {
      setModal1Open(false);
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
                    onClick={() => setModal1Open(true)}
                    style={{ whiteSpace: "nowrap" }}
                  >
                    <PlusOutlined />
                    Добавить "{locationSearchString}"
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
        <Modal style={{ top: 20 }} open={modal1Open} onCancel={handleCancel}>
          {modal1Open && (
            <MapSearch
              //тут передается только true modal1Open (((   )))
              setDataAdressModal={(newDataAdressModal: string) =>
                setDataAdressModal(newDataAdressModal)
              }
              setDataCoordModal={(newDataCordModal: number[]) =>
                setDataCoordModal(newDataCordModal)
              }
              setAddress={adress}
              locationSearchString={locationSearchString}
            />
          )}
        </Modal>
      </>
    );
  }
);
