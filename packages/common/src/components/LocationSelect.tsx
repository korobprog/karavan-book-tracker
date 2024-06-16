import React, { useEffect, useRef, useState } from "react";
import { PlusOutlined } from "@ant-design/icons";
import { Select, SelectProps, Typography, RefSelectProps, Modal } from "antd";
import { GeolocationControl, Map, YMaps, ZoomControl, Placemark } from "react-yandex-maps";
import { EnvironmentTwoTone } from "@ant-design/icons";

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

    const [modal1Open, setModal1Open] = useState(false);

    <Typography.Link onClick={onAddNewLocation} style={{ whiteSpace: "nowrap" }}>
      <PlusOutlined />
      Добавить "{locationSearchString}"
    </Typography.Link>;

    const mapOptions = {
      modules: ["geocode", "SuggestView"],
      defaultOptions: { suppressMapOpenBlock: true },
      width: "auto",
      height: 400,
    };
    const mapState = {
      center: [55.76, 37.64],
      zoom: 8,
      controls: [],
    };

    const geolocationOptions = {
      defaultOptions: { maxWidth: 128 },
      defaultData: { content: "Determine" },
    };

    const [mapConstructor, setMapConstructor] = useState(null);
    const [addressCoord, setAddressCoord] = useState();

    console.log("🚀 ~ setMapConstructor:", setMapConstructor);

    useEffect(() => {
      if (mapConstructor) {
        // @ts-ignore
        mapConstructor.geocode(locationSearchString).then((result) => {
          const coord = result.geoObjects.get(0).geometry.getCoordinates();
          setAddressCoord(coord);
        });
      }
    }, [mapConstructor]);

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
          title="20px to Top"
          style={{ top: 20 }}
          open={modal1Open}
          onOk={() => setModal1Open(false)}
          onCancel={() => setModal1Open(false)}
        >
          <Map
            {...mapOptions}
            // @ts-ignore
            state={addressCoord ? { ...mapState, center: addressCoord } : mapState}
            // @ts-ignore
            onLoad={setMapConstructor}
            defaultState={{
              center: [55.751574, 37.573856],
              zoom: 5,
            }}
          >
            {addressCoord && <Placemark geometry={addressCoord} />}
            <GeolocationControl {...geolocationOptions} />
          </Map>
        </Modal>
      </>
    );
  }
);
