import { ComponentChildren, createContext } from "preact";
import { useCallback, useContext, useRef } from "preact/hooks";

import {
  type Callback,
  type SubscriptionMeta,
  type Unsubscribe,
  useSubscription,
} from "@utils/subscription";

type DataContextSubscribe = (
  apiId: string,
  callback: Callback,
) => Unsubscribe;

  interface DataContextMeta {
  subscribe: DataContextSubscribe;
}

interface Subscriptions {
  [apiId: string]: SubscriptionMeta;
}

function createDataContext() {
  const DataContext = createContext<DataContextMeta | null>(null);
  
  function DataProvider({ children }: { children: ComponentChildren }) {
    const subscriptions = useRef<Subscriptions>({}).current;
    
    const subscribe = useCallback<DataContextSubscribe>((apiId, callback) => {
      if (!subscriptions[apiId])
        subscriptions[apiId] = useSubscription();

      return subscriptions[apiId].subscribe(callback);
    }, []);

    const values = { subscribe };
    
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

