import React from "react";
import styled from "styled-components";

const App = () => {

    return (
        <StageDiv>
            <canvas
                id="draw-area"
                width="400px"
                height="400px"
                style={{ border: "1px solid blue", position: "absolute" }}></canvas>
        </StageDiv>

    );
};
export default App;


const StageDiv = styled.div`
  border: 1px solid red;
  width: 100%;
  height: 100%;
  z-index: 9999;

`;

