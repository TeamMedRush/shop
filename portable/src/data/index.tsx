import { useCallback, useContext, useRef } from "preact/hooks";
import { ComponentChildren, createContext } from "preact";

import { APIS } from "@data/api";
import {
  type Callback,
  type SubscriptionMeta,
  type Unsubscribe,
  useSubscription,
} from "@utils/subscription";

type ApiKey = keyof typeof APIS;

type DataContextSubscribe = (
  apiId: string,
  callback: Callback,
) => Unsubscribe;

interface DataDump {
  [apiId: string]: unknown;
}

interface DataContextMeta {
  dataDump: DataDump;
  subscribe: DataContextSubscribe;
  refreshApi: (apiId: ApiKey, params?: any[]) => Promise<void>;
}

interface Subscriptions {
  [apiId: string]: SubscriptionMeta;
}

function createDataContext() {
  const DataContext = createContext<DataContextMeta | null>(null);

  function DataProvider({ children }: { children: ComponentChildren }) {
    const dataDump = useRef<DataDump>({}).current;
    const subscriptions = useRef<Subscriptions>({}).current;

    for (const apiId in APIS)
      subscriptions[apiId] = useSubscription();

    const subscribe = useCallback<DataContextSubscribe>((apiId, callback) => {
      return subscriptions[apiId].subscribe(callback);
    }, []);

    const refreshApi = useCallback(async (
      apiId: ApiKey,
      params: any[] = [],
    ) => {
      if (!(apiId in APIS)) return;
      const { caller } = APIS[apiId] as {
        caller: (...params: any[]) => unknown
      };

      dataDump[apiId] = await caller(...params);
      subscriptions[apiId].notify();
    }, []);

    const values = {
      dataDump,
      subscribe,
      refreshApi,
    };

    return <DataContext.Provider value={values}>
      {children}
    </DataContext.Provider>
  }

  function useData(): DataContextMeta {
    return useContext(DataContext)!;
  }

  return { useData, DataProvider };
}

export const {
  useData,
  DataProvider,
} = createDataContext();

