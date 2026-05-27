import { useCallback, useRef } from "preact/hooks";
import { randomId } from "@utils/generators";

export type Callback = () => void;
export type Unsubscribe = () => void;
export type Subscribe = (callback: Callback) => Unsubscribe;
export type Subscriptions = {
  [id: string]: Callback;
}

export interface SubscriptionMeta {
  subscribe: Subscribe;
  count: () => number;
  notify: () => void;
}

export function useSubscription(): SubscriptionMeta {
  const subscriptions = useRef<Subscriptions>({}).current;
  const counter = useRef<number>(0);

  const subscribe = useCallback<Subscribe>((callback) => {
    const id = randomId();
    subscriptions[id] = callback;
    counter.current++;

    return () => {
      delete subscriptions[id];
      counter.current--;
    };
  }, []);

  const notify = () => {
    for (const id in subscriptions)
      subscriptions[id]();
  };

  const count = () => counter.current;

  return { subscribe, count, notify };
}

