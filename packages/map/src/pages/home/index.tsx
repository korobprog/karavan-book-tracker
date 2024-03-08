import React, { useState } from "react";
import YMaps from "yandex-maps";

import { Layout } from "components/layout";
import { Header } from "components/header";
import { Map } from "components/map";
import { Placemark } from "components/placemark";
import { Clusterer } from "components/clusterer";
// import { TeamPlacemark } from "components/team";
// import { useGetSheetQuery, googleSheetKey } from "shared/services";
import { Regions } from "features/regions";
import { useLocations } from "shared/services/firebase/useLocations";

// import { useTeams } from "shared/services/firebase/teams";

export const HomePage: React.FC = () => {
  const currentYear = String(new Date().getFullYear());
  const [ymaps, setYmaps] = useState<typeof YMaps>();
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const { locations } = useLocations({});
  // const { teams } = useTeams({});

  const [isShowRegions, setIsShowRegions] = useState(false);
  const toggleRegions = () => {
    setIsShowRegions(!isShowRegions);
  };

  const [checkedSP, setCheckedSP] = useState(true);

  const handleSPChange = (nextChecked: boolean) => {
    setCheckedSP(nextChecked);
  };

  const [checkedOther, setCheckedOther] = useState(true);
  const handleOtherChange = (nextChecked: boolean) => {
    setCheckedOther(nextChecked);
  };

  // const isShowTeams = selectedYear === currentYear;

  const onLoad = (ymap: typeof YMaps) => {
    setYmaps(ymap);
  };

  const getFirebaseMarks = (year: string) =>
    ymaps
      ? locations.map((location) => {
          const statistic = location.statistic?.[year];

          const count = (statistic?.totalPrimaryCount || 0) + (statistic?.totalOtherCount || 0);

          if (!location.coordinates || count === 0) {
            return null;
          }

          return (
            <Placemark
              key={location.id}
              ymaps={ymaps}
              place={location.name}
              coordinates={location.coordinates as [number, number]}
              count={count}
              isActive
            />
          );
        })
      : null;

  // const getTeamMarks2022 = () =>
  //   ymaps && isShowTeams
  //     ? teams.map((team) => {
  //         const teamCurrentLocation = locations.find(
  //           (location) => location.id === team.currentLocation
  //         );

  //         if (!teamCurrentLocation) {
  //           return null;
  //         }

  //         return (
  //           <TeamPlacemark
  //             key={team.id}
  //             ymaps={ymaps}
  //             name={team.name}
  //             place={teamCurrentLocation.name}
  //             coordinates={teamCurrentLocation.coordinates as [number, number]}
  //             isActive
  //           />
  //         );
  //       })
  //     : null;

  // const teamMarks = getTeamMarks2022();

  const marks = getFirebaseMarks(selectedYear);

  return (
    <Layout
      contentClassName="homePage"
      ui={
        <Header
          // totalCount={Number(totalCount)}
          // totalSP={Number(totalSP)}
          // totalOther={Number(totalOther)}
          checkedSP={checkedSP}
          checkedOther={checkedOther}
          handleOtherChange={handleOtherChange}
          handleSPChange={handleSPChange}
          handleToggleRegions={toggleRegions}
          setYear={setSelectedYear}
          year={selectedYear}
          isShowRegions={isShowRegions}
        />
      }
    >
      <Map
        onLoad={onLoad}
        defaultState={{ center: [55.751574, 37.573856], zoom: 5 }}
        modules={[
          "templateLayoutFactory",
          "layout.ImageWithContent",
          "borders",
          "ObjectManager",
          "objectManager.addon.objectsBalloon",
          "objectManager.addon.objectsHint",
        ]}
      >
        {ymaps && (checkedSP || checkedOther) && <Clusterer ymaps={ymaps}>{marks}</Clusterer>}
        {/* {ymaps && (checkedSP || checkedOther) && <Clusterer ymaps={ymaps}>{teamMarks}</Clusterer>} */}
        {ymaps && <Regions ymaps={ymaps} isShowRegions={isShowRegions} />}
      </Map>
    </Layout>
  );
};
