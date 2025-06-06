import React from "react";
import styled, { keyframes } from "styled-components";
import UnstyledButton from "../UnstyledButton/UnstyledButton";
import {
  querySmallScreen,
  queryVerySmallScreen,
  SCROLLBAR_WIDTH,
  ITEM_HEIGHT,
  WIDTH_TO_SHOW_DOUBLE_HEIGHT,
} from "../../../lib/constants";
import { ClipboardCopy, Star } from "../Icons";

const BaseButton = styled(UnstyledButton)`
  height: 100%;
  aspect-ratio: 1;
  cursor: pointer;
  padding: 0;
  transition:
    transform 0.1s ease-in-out,
    color 0.1s ease-in-out;

  @media ${querySmallScreen} {
    height: 60%;
  }

  &:focus {
    outline: none;
    background-color: transparent;
  }

  &:selected {
    background-color: transparent;
  }

  user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  -webkit-tap-highlight-color: transparent;
`;

const CopyButton = styled(BaseButton)`
  grid-area: copy;

  color: var(--slate-700);

  @media (hover: hover) {
    &:hover {
      color: var(--slate-900);
    }
  }

  transform: ${(props) => (props.$rowMouseDown ? "scale(0.8)" : "none")};

  &:active {
    transform: scale(0.8);
  }
`;

const SpinStretch = keyframes`
  0% {
    transform: scale(1) rotate(0deg);
  }

  20% {
    transform: scale(0.8) rotate(-40deg);
  }


  100% {
    transform: scale(1) rotate(360deg);
  }
`;

const FavoriteButton = styled(BaseButton)`
  grid-area: favorite;

  color: var(--yellow-700);

  --fill-color: ${(props) =>
    props.$isFaved ? "var(--yellow-500)" : "transparent"};

  &[data-just-faved="true"] {
    animation: ${SpinStretch} 0.8s cubic-bezier(0.25, 0.8, 0.25, 1) both;
  }

  @media (hover: hover) {
    &:hover {
      color: ${(props) =>
        props.$isFaved ? "var(--yellow-100)" : "var(--yellow-500)"};
    }
  }
`;

const Wrapper = styled.div`
  flex: 1;
  min-height: 0;
  position: relative;
  outline: none;
  overflow-y: auto;
  margin: 0 18rem;

  --text-size: 0.875rem;

  @media ${queryVerySmallScreen} {
    --text-size: 0.75rem;
  }
`;

const List = styled.div`
  height: 100%;
  padding-bottom: 2rem;
`;

const HeaderRow = styled.div`
  display: grid;
  padding: 0.25rem 0;
  grid-template-areas: "type mpid brokerName clearingBroker favorite copy copied";
  grid-template-columns: 0.5fr 1fr 3fr 1fr 0.5fr 0.5fr 0.5fr;
  gap: 0.25rem 0.5rem;
  align-items: center;
  font-family: monospace;
  white-space: nowrap;
  font-size: var(--text-size);
  border-bottom: 1px solid var(--border-color);
  height: ${ITEM_HEIGHT}px;
  position: sticky;
  top: 0;
  background: var(--slate-200);
  z-index: 1;
`;

const RowWrapper = styled.div`
  display: grid;
  padding: 0.25rem 0;

  grid-template-areas: "type mpid brokerName clearingBroker favorite copy copied";
  grid-template-rows: 100%;
  grid-template-columns: 0.5fr 1fr 3fr 1fr 0.5fr 0.5fr 0.5fr;
  gap: 0.25rem 0.5rem;
  align-items: center;

  font-family: monospace;
  white-space: nowrap;
  font-size: var(--text-size);
  border-bottom: 1px solid var(--border-color);
  height: ${ITEM_HEIGHT}px;

  @media (hover: hover) {
    &:hover {
      background-color: var(--slate-400);
    }
  }

  background-color: var(--row-background, transparent);
  transition: background-color 0.1s ease-in-out;

  @media ${querySmallScreen} {
    grid-template-columns: 1fr 1fr;
    grid-template-areas:
      "type mpid"
      "brokerName clearingBroker"
      "favorite copy";
    grid-template-rows: auto auto auto;
    height: auto;
    justify-content: center;
    gap: 0.25rem 0.5rem;
    padding: 0.5rem 0;
    margin-left: 0;
    white-space: normal;
  }
`;

const FadeOutDown = keyframes`
  0% {
    opacity: 0;
  }

  15% {
    opacity: 1;
  }

  40% {
    opacity: 1;
  }

  100% {
    opacity: 0;
  }
`;

const FadeOutSide = keyframes`
  0% {
    opacity: 0;
    transform: translateX(0);
  }

  30% {
    opacity: 1;
    transform: translateX(-110%);
  }

  50% {
    opacity: 1;
    transform: translateX(-110%);
  }

  100% {
    transform: translateX(0);
  }
`;

const CopiedText = styled.div`
  grid-area: copied;
  font-size: var(--text-size);
  color: var(--green-900);
  animation: ${FadeOutDown} 0.6s ease-in both;
  user-select: none;

  @media ${querySmallScreen} {
    position: absolute;
    backdrop-filter: blur(10px);
    background-color: var(--slate-100);
    border-radius: 0.5rem;
    padding: 0.5rem;
    left: 100%;
    animation: ${FadeOutSide} 1s ease-out both;
  }
`;

const Cell = styled.span`
  display: block;
  width: fit-content;
`;

const Highlight = styled.span`
  background-color: yellow;
`;

function Row({ mpid, isFaved, toggleFavedMPID, search }) {
  const [justFaved, setJustFaved] = React.useState(null);
  const [mouseDown, setMouseDown] = React.useState(false);
  const [justCopied, setJustCopied] = React.useState(0);
  const timeoutRef = React.useRef(null);

  const handleCopy = React.useCallback(async () => {
    clearTimeout(timeoutRef.current);
    await navigator.clipboard
      .writeText(mpid.brokerName)
      .catch((e) => {
        console.error("error copying to clipboard", e);
        setJustCopied(0);
      })
      .then(() => {
        setJustCopied((prev) => prev + 1);
        timeoutRef.current = setTimeout(() => {
          setJustCopied(0);
        }, 1000);
      });
  }, [mpid.mpid]);

  React.useEffect(() => {
    if (justFaved && justFaved !== mpid.mpid) {
      setJustFaved(null);
    }
  }, [justFaved, mpid.mpid]);

  React.useEffect(() => {
    const handleMouseUp = () => {
      if (mouseDown) {
        setMouseDown(false);
        handleCopy();
      }
    };

    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [mouseDown, handleCopy]);

  const highlight = (text) => {
    if (!search || !text.toLowerCase().includes(search.toLowerCase())) {
      return text;
    }
    const start = text.toLowerCase().indexOf(search.toLowerCase());
    const end = start + search.length;
    return (
      <>
        {text.slice(0, start)}
        <Highlight>{text.slice(start, end)}</Highlight>
        {text.slice(end)}
      </>
    );
  };

  return (
    <RowWrapper
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) {
          setMouseDown(true);
        }
      }}
      style={{
        backgroundColor: mouseDown ? "var(--slate-500)" : null,
      }}
    >
      <Cell style={{ gridArea: "type" }}>{highlight(mpid.type)}</Cell>
      <Cell style={{ gridArea: "mpid" }}>{highlight(mpid.mpid)}</Cell>
      <Cell style={{ gridArea: "brokerName" }}>
        {highlight(mpid.brokerName)}
      </Cell>
      <Cell style={{ gridArea: "clearingBroker" }}>
        {highlight(mpid.clearingBroker)}
      </Cell>
      <CopyButton onClick={handleCopy} $rowMouseDown={mouseDown}>
        <ClipboardCopy style={{ height: "100%", aspectRatio: 1 }} />
      </CopyButton>
      <FavoriteButton
        $isFaved={isFaved}
        data-just-faved={isFaved && justFaved === mpid.mpid}
        onClick={() => {
          if (!isFaved) {
            setJustFaved(mpid.mpid);
          }
          toggleFavedMPID(mpid.mpid);
        }}
      >
        <Star
          fill="var(--fill-color)"
          style={{ height: "100%", aspectRatio: 1 }}
        />
      </FavoriteButton>
      {justCopied !== 0 && <CopiedText key={justCopied}>copied!</CopiedText>}
    </RowWrapper>
  );
}

function MPIDDisplay({ mpids, favedMPIDs, toggleFavedMPID, search }) {
  return (
    <Wrapper>
      <HeaderRow>
        <Cell style={{ gridArea: "type" }}>Type</Cell>
        <Cell style={{ gridArea: "mpid" }}>MPID</Cell>
        <Cell style={{ gridArea: "brokerName" }}>Broker Name</Cell>
        <Cell style={{ gridArea: "clearingBroker" }}>Clearing Broker</Cell>
        <Cell style={{ gridArea: "favorite" }}>Favorite</Cell>
        <Cell style={{ gridArea: "copy" }}>Copy</Cell>
        <Cell style={{ gridArea: "copied" }}></Cell>
      </HeaderRow>
      <List>
        {mpids.map((mpid, index) => {
          return (
            <Row
              key={`${mpid.mpid}-${index}`}
              mpid={mpid}
              isFaved={favedMPIDs[mpid.mpid]}
              toggleFavedMPID={toggleFavedMPID}
              search={search}
            />
          );
        })}
      </List>
    </Wrapper>
  );
}

export default MPIDDisplay;
