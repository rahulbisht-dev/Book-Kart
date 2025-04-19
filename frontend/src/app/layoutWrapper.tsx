"use client";
import BookLoader from "@/lib/BookLoader";
import { Provider } from "react-redux";
import { Toaster } from "react-hot-toast";
import AuthCheck from "@/store/provider/authProvider";
import { persistor, store } from "../store/Store";
import { PersistGate } from "redux-persist/integration/react";

export default function LayoutWrapper({children}: {children: React.ReactNode}){

  return (
    <Provider store={store}>
    <PersistGate persistor={persistor} loading={<BookLoader/>}>

        <Toaster/>
        
        <AuthCheck>
        {children}
        </AuthCheck>

    </PersistGate>
    </Provider>
  );
}
