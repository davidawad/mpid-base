import React from "react";
import styled from "styled-components";
import { SCROLLBAR_WIDTH } from "../../../lib/constants";

const Wrapper = styled.div`
  width: ${SCROLLBAR_WIDTH}px;
  background-color: var(--slate-200);
  display: flex;
  flex-direction: column;
  -webkit-tap-highlight-color: transparent;
`;

function Scrollbar() {
  return <Wrapper />;
}

export default Scrollbar;
