import { createContext, Component, createSignal, useContext } from "solid-js";
import { Tokens } from "./models";

const AppContext = createContext();

interface AppContextValue {
  children: any;
}

export const Provider: Component<AppContextValue> = (props) => {
  const [tokens, setTokens] = createSignal({
    access: "",
    refresh: "",
  } as Tokens);
  const deleteTokens = () => {
    setTokens({
      access: "",
      refresh: "",
    });
  };
  return (
    <AppContext.Provider value={[tokens, setTokens, deleteTokens]}>
      {props.children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
