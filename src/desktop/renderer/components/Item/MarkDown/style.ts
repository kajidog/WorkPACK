import styled from "styled-components"

export const Style = styled.div`
    width: 100%;
    height: 100%;
    .editor-toolbar{
        display: flex;
        overflow: scroll;
        &>*{
            flex: 0 0 auto;
        }
    }
    .EasyMDEContainer{
        height: 100%;
    }
    .editor-toolbar.fullscreen{
        padding-right: 10%;
    }
    .editor-toolbar{
        border: none;
    }
    .EasyMDEContainer .CodeMirror{
        border: none;
        border-top: 1px solid #d9d9d9;
    }
    `