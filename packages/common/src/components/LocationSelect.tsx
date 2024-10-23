import React, { useState } from "react";
import { PlusOutlined } from "@ant-design/icons";
import { Select, SelectProps, Typography, RefSelectProps, Modal, Button } from "antd";
import { MapSearch } from "./MapSearch";

type LocationSelectProps = SelectProps & {
  onAddNewLocation: () => void;
  setDataCoordModalClick: (newDataCordModalClick: number[]) => void;
  setDataAdressModalClick: (newDataAdressModalClick: string) => void;
  setDataCoordClick: (newDataCordClick: number[]) => void;
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
      locationSearchString,
      children,
      isOnline,
      loading,
      ...restProps
    } = props;

    const [modal1Open, setModal1Open] = useState(false);

    const [loadingCity, setLoading] = useState(false);

    const [cords, setAddressCoord] = useState<number[]>();

    const [adressmodal, setDataAdressModal] = useState("");

    const [coordinatesmodal, setDataCoordModal] = useState<number[]>();

    <Typography.Link onClick={onAddNewLocation} style={{ whiteSpace: "nowrap" }}>
      <PlusOutlined />
      Добавить "{locationSearchString}"
    </Typography.Link>;

    const onAddNewLocationClick = () => {
      setDataAdressModalClick(adressmodal);
      if (coordinatesmodal) {
        setDataCoordModalClick(coordinatesmodal);
      }

      if (cords) {
        setDataCoordClick(cords);
      }
      setTimeout(() => {
        setLoading(false);
        setModal1Open(false);
      }, 3000);
      setAddressCoord([]);
      setDataAdressModal("");
      setDataCoordModal([]);
    };

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
        <Modal
          style={{ top: 20 }}
          open={modal1Open}
          onCancel={handleCancel}
          footer={[
            <Button
              key="submit"
              type="primary"
              loading={loadingCity}
              onClick={() => {
                onAddNewLocationClick();
                setLoading(true);
                console.log("hello");
              }}
            >
              {`Выбрать место локации где были распространены книги`}
            </Button>,
          ]}
        >
          {modal1Open && (
            <MapSearch
              //тут передается только true modal1Open (((   )))
              locationSearchString={locationSearchString}
              setDataAdressModal={(newDataAdressModal: string) =>
                setDataAdressModal(newDataAdressModal)
              }
              setDataCoordModal={(newDataCordModal: number[]) =>
                setDataCoordModal(newDataCordModal)
              }
              setAddressCoord={(newDataCord: number[]) => setAddressCoord(newDataCord)}
            />
          )}
        </Modal>
      </>
    );
  }
);
