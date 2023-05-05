import { useEffect, useState } from "react";

export const usePreloadedData = <D extends any>(data: D, isLoading?: boolean): D => {
  const [preloadedData, setPreloadedData] = useState(data);

  useEffect(() => {
    if (!isLoading) {
      setPreloadedData(data);
    }
  }, [isLoading, data]);

  return preloadedData;
};
