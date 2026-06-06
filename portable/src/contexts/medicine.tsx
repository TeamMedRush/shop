import { useCallback, useContext, useEffect, useState } from "preact/hooks";
import { ComponentChildren, createContext } from "preact";

import { useData } from "@data/index";

interface MedicineMeta {
  ready: boolean;
}

function createMedicineContext() {
  const MedicineContext = createContext<MedicineMeta | null>(null);

  function MedicineProvider({ children }: { children: ComponentChildren }) {
    const { dataDump, subscribe, refreshApi } = useData();
    const [subscribed, setSubscribed] = useState(false);
    const [ready, setReady] = useState(false);

    const processData = useCallback(() => {
      setReady(true);
    }, [dataDump]);

    useEffect(() => {
      setSubscribed(true);
      const unsubscribe = subscribe("", () => {});

      return () => {
        setSubscribed(false);
        unsubscribe();
      };
    }, [processData, subscribe]);

    useEffect(() => {
      if (!subscribed) return;
      refreshApi("cpStatLeetcode");
    }, [subscribed]);

    const value = {
      ready,
    };

    return <MedicineContext.Provider value={value}>
      {children}
    </MedicineContext.Provider>
  }

  function useMedicine(): MedicineMeta {
    return useContext(MedicineContext)!;
  }

  return { useMedicine, MedicineProvider };
}

export const {
  useMedicine,
  MedicineProvider,
} = createMedicineContext();

