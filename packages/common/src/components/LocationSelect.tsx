import React, { useState } from "react";
import { PlusOutlined } from "@ant-design/icons";
import { Select, SelectProps, Typography, RefSelectProps, Modal, Button } from "antd";
import { MapSearch } from "./MapSearch";

type LocationSelectProps = SelectProps & {
  onAddNewLocation: () => void;

  setDataAdressModal: (newDataAdress: string) => void;
  setDataCordModal: (newDataCord: []) => void;
  setAddressCoord: (newDataCord: []) => void;
  locationSearchString: string;
  isOnline?: boolean;
  loading?: boolean;
};

export const LocationSelect = React.forwardRef<RefSelectProps, LocationSelectProps>(
  (props, ref) => {
    const {
      onAddNewLocation,
      setDataAdressModal,
      setDataCordModal,
      setAddressCoord,
      locationSearchString,
      children,
      isOnline,
      loading,
      ...restProps
    } = props;

    //const [newadressmodal, setDataAdressModal] = useState("");

    //const [newadresscord, setDataCordModal] = useState([]);

    //const [cord, setAddressCoord] = useState([]);

    const [modal1Open, setModal1Open] = useState(false);

    const [loadingCity, setLoading] = useState(false);

    <Typography.Link onClick={onAddNewLocation} style={{ whiteSpace: "nowrap" }}>
      <PlusOutlined />
      Добавить "{locationSearchString}"
    </Typography.Link>;

    const onAddNewLocationMap = () => {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
      }, 3000);
    };

    const handleOkAdressModal = (newDataAdress: string) => {
      setDataAdressModal(newDataAdress);
    };

    const handleOkCordModal = (newDataCord: []) => {
      setDataCordModal(newDataCord);
    };

    const handleOkAdressCord = (newDataCord: []) => {
      setAddressCoord(newDataCord);
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
            <Button key="submit" type="primary" loading={loadingCity} onClick={onAddNewLocationMap}>
              {`Выбрать место локации где были распространены книги`}
            </Button>,
          ]}
        >
          {modal1Open && (
            <MapSearch
              //тут передается только true modal1Open (((   )))
              locationSearchString={locationSearchString}
              setDataCoordModal={handleOkCordModal}
              setDataAdressModal={handleOkAdressModal}
              setAddressCoord={handleOkAdressCord}
            />
          )}
        </Modal>
      </>
    );
  }
);
