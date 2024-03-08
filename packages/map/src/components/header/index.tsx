import { UiButton } from "components/ui/button";
import React, { useState } from "react";
// import ReactSwitch from "react-switch";
import { BOOK_DECLENSIONS, declension } from "shared/utils/declision";
import "./header.less";

const nowYear = new Date().getFullYear();

const getAvailableYears = () => {
  const startYear = 2022;
  const availableYears = [];
  for (let year = startYear; year <= nowYear; year++) {
    availableYears.push(String(year));
  }
  return availableYears;
};

const availableYears = getAvailableYears();

type Props = {
  totalCount?: number;
  totalSP?: number;
  totalOther?: number;
  checkedSP: boolean;
  checkedOther: boolean;
  handleOtherChange: (next: boolean) => void;
  handleSPChange: (next: boolean) => void;
  handleToggleRegions: () => void;
  setYear: (next: string) => void;
  year: string;
  isShowRegions: boolean;
};

// TODO: rename to UiContainer
export const Header: React.FC<Props> = (props) => {
  const [isExtended] = useState(false);
  const {
    totalCount,
    totalSP,
    totalOther,
    checkedSP,
    checkedOther,
    handleSPChange,
    handleOtherChange,
    handleToggleRegions,
    setYear,
    year,
    isShowRegions,
  } = props;

  const heading = "Караван Прабхупады";
  const subtitle = `Распространено всего: ${totalCount} ${declension(
    totalCount || 0,
    BOOK_DECLENSIONS
  )}`;
  const titleSP = `Книг Шрилы Прабхупады: ${totalSP}`;
  const titleOther = `Других книг: ${totalOther}`;

  return (
    <div className="header">
      <div className="header__years">
        {availableYears.map((availableYear) => (
          <UiButton
            key={availableYear}
            type={"button"}
            variant={year === availableYear ? "primary" : "ghost"}
            label={availableYear}
            onClick={() => setYear(availableYear)}
          />
        ))}
      </div>

      {/* <div className={styles.header}>
        <div
          className={styles.header__toggle}
          // TODO: fixme
          // onClick={() => setIsExtended(!isExtended)}
        >
          <h1 className={styles.header__title}>{heading}</h1>
        </div>
        {isExtended && (
          <div className={styles.header__extended}>
            <div>
              <h4 className={styles.header__subtitle}>{subtitle}</h4>
            </div>

            <label className={styles.header__label}>
              <ReactSwitch
                onChange={handleSPChange}
                checked={checkedSP}
                className={styles.header__switch}
                height={20}
                width={35}
              />
              <span>{titleSP}</span>
            </label>

            <label className={styles.header__label}>
              <ReactSwitch
                onChange={handleOtherChange}
                checked={checkedOther}
                className={styles.header__switch}
                height={20}
                width={35}
              />
              <span>{titleOther}</span>
            </label>

            <label className={styles.header__label}>
              <ReactSwitch
                onChange={handleToggleRegions}
                checked={isShowRegions}
                className={styles.header__switch}
                height={20}
                width={35}
              />
              <span>Показать регионы</span>
            </label>
          </div>
        )}
      </div> */}
    </div>
  );
};
