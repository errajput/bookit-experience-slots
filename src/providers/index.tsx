"use client";

import {
  createContext,
  useState,
  ReactNode,
  Dispatch,
  SetStateAction,
} from "react";

export const UserContext = createContext<{
  search?: string;
  setSearch?: Dispatch<SetStateAction<string>>;
}>({});

const Providers = ({ children }: { children: ReactNode }) => {
  const [search, setSearch] = useState("");

  return (
    <>
      <UserContext.Provider value={{ search, setSearch }}>
        {children}
      </UserContext.Provider>
    </>
  );
};

export default Providers;
