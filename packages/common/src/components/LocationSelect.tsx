import React, { useEffect, useRef, useState } from "react";
import { PlusOutlined } from "@ant-design/icons";
import { Select, SelectProps, Typography, RefSelectProps, Modal, Button } from "antd";
import { MapSearch } from "./MapSearch";

type LocationSelectProps = SelectProps & {
  onAddNewLocation: () => void;
  locationSearchString: string;
  isOnline?: boolean;
  loading?: boolean;
};

export const LocationSelect = React.forwardRef<RefSelectProps, LocationSelectProps>(
  (props, ref) => {
    const { onAddNewLocation, locationSearchString, children, isOnline, loading, ...restProps } =
      props;
    const [newcordmodal, setDataCoord] = useState<string>("");
    console.log("🚀 ~ newcordmodal:", newcordmodal);

    const [newadressmodal, setDataAdressModal] = useState<string>("");
    console.log("🚀 ~ newadressmodal:", newadressmodal);

    const [newadress, setDataAdress] = useState<string>("");
    console.log("🚀 ~ newadress:", newadress);

    const [modal1Open, setModal1Open] = useState(false);

    const [loadingCity, setLoading] = useState(false);

    <Typography.Link onClick={onAddNewLocation} style={{ whiteSpace: "nowrap" }}>
      <PlusOutlined />
      Добавить "{locationSearchString}"
    </Typography.Link>;

    const handleOkCordModal = (newData: string) => {
      setDataCoord(newData);
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
      }, 3000);
    };

    const handleOkAdressModal = (newData: string) => {
      setDataAdressModal(newData);
    };

    const handleOkAdress = (newData: string) => {
      setDataAdress(newData);
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
            <Button key="submit" type="primary" loading={loadingCity} onClick={onAddNewLocation}>
              {`Выбрать место локации где были распространены книги`}
            </Button>,
          ]}
        >
          {modal1Open && (
            <MapSearch
              locationSearchString={locationSearchString}
              setDataCoordModal={handleOkCordModal}
              setDataAdressModal={handleOkAdressModal}
              setAddressCoord={handleOkAdress}
            />
          )}
        </Modal>
      </>
    );
  }
);
