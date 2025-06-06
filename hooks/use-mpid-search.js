import React from "react";
import { mpidData } from "../lib/mpid-data";

export function useMpidSearch() {
  const [search, setSearch] = React.useState("");
  const [results, setResults] = React.useState([]);

  const searchMpins = React.useCallback((input) => {
    setSearch(input);
    if (!input) {
      setResults([]);
      return;
    }

    const lowercasedInput = input.toLowerCase();
    const filtered = mpidData.filter(
      (mpid) =>
        mpid.mpid.toLowerCase().includes(lowercasedInput) ||
        mpid.brokerName.toLowerCase().includes(lowercasedInput) ||
        mpid.clearingBroker.toLowerCase().includes(lowercasedInput) ||
        mpid.type.toLowerCase().includes(lowercasedInput)
    );
    setResults(filtered);
  }, []);

  return {
    search,
    results,
    searchMpins,
  };
}
