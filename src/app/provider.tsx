"use client";

import { ThemeProvider } from "next-themes";
import { Provider as ReduxProvider } from "react-redux";

//Redux - Store
import { persistor, store } from "@/redux/store";
import { PersistGate } from "redux-persist/integration/react";

export function Provider({ children }: { children: React.ReactNode }) {
  return (
    <ReduxProvider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ThemeProvider attribute="class">{children}</ThemeProvider>
      </PersistGate>
    </ReduxProvider>
  );
}
