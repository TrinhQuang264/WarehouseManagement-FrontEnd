/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useState, useCallback } from "react";

export const HeaderContext = createContext({
  searchValue: "",
  setSearchValue: () => {},
  actionButton: null,
  setActionButton: () => {},
  extraActions: [], // Mảng các nút action phụ
  setExtraActions: () => {},
  onSearch: null,
  setOnSearch: () => {},
  title: "",
  setTitle: () => {},
  subtitle: "",
  setSubtitle: () => {},
  resetHeader: () => {},
});

function HeaderProvider({ children }) {
  const [searchValue, setSearchValue] = useState("");
  const [actionButton, setActionButton] = useState(null);
  const [extraActions, setExtraActions] = useState([]);
  const [onSearch, setOnSearch] = useState(null);
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");

  const resetHeader = useCallback(() => {
    setSearchValue("");
    setActionButton(null);
    setExtraActions([]);
    setOnSearch(null);
    setTitle("");
    setSubtitle("");
  }, []);

  return (
    <HeaderContext.Provider
      value={{
        searchValue,
        setSearchValue,
        actionButton,
        setActionButton,
        extraActions,
        setExtraActions,
        onSearch,
        setOnSearch,
        title,
        setTitle,
        subtitle,
        setSubtitle,
        resetHeader,
      }}
    >
      {children}
    </HeaderContext.Provider>
  );
}

// Custom hook to use header context
function useHeader() {
  const context = React.useContext(HeaderContext);
  if (!context) {
    throw new Error("useHeader must be used within HeaderProvider");
  }
  return context;
}

export { HeaderProvider, useHeader };
