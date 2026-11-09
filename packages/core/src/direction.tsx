import * as React from "react";
import { Direction as RadixDirection } from "radix-ui";

export type DirectionType = "ltr" | "rtl";

interface DirectionContextValue {
  dir: DirectionType;
  isRTL: boolean;
}

const DirectionContext = React.createContext<DirectionContextValue>({
  dir: "ltr",
  isRTL: false,
});

export interface DirectionProviderProps {
  dir: DirectionType;
  children: React.ReactNode;
}

export function DirectionProvider({ dir, children }: DirectionProviderProps) {
  const isRTL = dir === "rtl";

  return (
    <RadixDirection.Provider dir={dir}>
      <DirectionContext.Provider value={{ dir, isRTL }}>
        <div dir={dir} className="gl-direction-root">
          {children}
        </div>
      </DirectionContext.Provider>
    </RadixDirection.Provider>
  );
}

export function useDirection(): DirectionContextValue {
  return React.useContext(DirectionContext);
}

export interface DirectionProps {
  dir: DirectionType;
  children: React.ReactNode;
}

export function Direction({ dir, children }: DirectionProps) {
  return <DirectionProvider dir={dir}>{children}</DirectionProvider>;
}
