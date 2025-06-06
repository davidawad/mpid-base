import React from "react";
import styled from "styled-components";
import Header from "../Header/Header";
import MPIDDisplay from "../MPIDDisplay/MPIDDisplay";
import SearchWidget from "../SearchWidget/SearchWidget";
import FavoritesWidget from "../FavoritesWidget";
import { useMpidSearch } from "../../../hooks/use-mpid-search";
import { mpidData } from "../../../lib/mpid-data";
import Scrollbar from "../Scrollbar/Scrollbar";

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  height: 100svh;
  max-height: 100svh;
  height: 100dvh;
  max-height: 100dvh;
  overflow: hidden;
  overscroll-behavior: none;
`;

const HeaderAndContent = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
`;

const Content = styled.div`
  overflow: hidden;
  display: flex;
  flex-direction: row;
  flex: 1;
  min-height: 0;
  overscroll-behavior: none;
`;

function App() {
  const [showFavorites, setShowFavorites] = React.useState(false);
  const { search, results, searchMpins } = useMpidSearch();
  const [favedMPIDs, setFavedMPIDs] = React.useState(
    localStorage.getItem("favedMPIDs")
      ? JSON.parse(localStorage.getItem("favedMPIDs"))
      : {}
  );

  const toggleFavedMPID = (mpid) => {
    setFavedMPIDs((prev) => {
      const newFavedMPIDs = { ...prev };
      if (newFavedMPIDs[mpid]) {
        delete newFavedMPIDs[mpid];
      } else {
        newFavedMPIDs[mpid] = true;
      }
      localStorage.setItem("favedMPIDs", JSON.stringify(newFavedMPIDs));
      return newFavedMPIDs;
    });
  };

  const displayedMpids = React.useMemo(() => {
    if (search) {
      return results;
    }
    if (showFavorites) {
      return mpidData.filter((mpid) => favedMPIDs[mpid.mpid]);
    }
    return mpidData;
  }, [search, results, showFavorites, favedMPIDs]);

  return (
    <>
      <SearchWidget search={search} setSearch={searchMpins} />
      <FavoritesWidget
        setShowFavorites={setShowFavorites}
        isShowingFavorites={showFavorites}
      />
      <Wrapper>
        <HeaderAndContent>
          <Header />
          <Content>
            <MPIDDisplay
              mpids={displayedMpids}
              favedMPIDs={favedMPIDs}
              toggleFavedMPID={toggleFavedMPID}
              search={search}
            />
          </Content>
        </HeaderAndContent>
        <Scrollbar />
      </Wrapper>
    </>
  );
}

export default App;
