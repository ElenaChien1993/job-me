import { useState } from 'react';
import {
  Editor,
  EditorState,
  RichUtils,
  convertToRaw,
  convertFromRaw,
} from 'draft-js';
import 'draft-js/dist/Draft.css';
import styled from 'styled-components';

import firebase from '../../utils/firebase';

const StyledEditor = styled.div`
  border: 1px transparent solid;
  padding: 1.5em 2em 2.75em 2em;
  margin: 1.25em;
  font-size: 100%;
  letter-spacing: 1.2px;
  border-color: #999999;
  border-radius: 6px;
  text-align: left;
  line-height: 1.5em;
  color: black;
`;

const StyledButton = styled.button`
  border-radius: 2px;
  margin: 0.25em;
  width: 2.3em;
  font-family: 'Times';
  line-height: 200%;
  border-radius: 3px;
  background: floralwhite;
  border: solid 1px #999999;
  color: #263135;
  &#underline {
    text-decoration: underline;
  }
  &#bold {
    font-weight: 800;
  }
  &#italic {
    font-style: italic;
  }
  &#linethrough {
    text-decoration: line-through;
  }
`;

const EditorArea = ({ noteId, details, objectKey }) => {
  const [editorState, setEditorState] = useState(() =>
    details[objectKey] === '' || !details[objectKey]
      ? EditorState.createEmpty()
      : EditorState.createWithContent(convertFromRaw(JSON.parse(details[objectKey])))
  );

  const handleKeyCommand = (command, editorState) => {
    const newState = RichUtils.handleKeyCommand(editorState, command);

    if (newState) {
      setEditorState(newState);
      return 'handled';
    }

    return 'not-handled';
  };

  const onUnderlineClick = () => {
    setEditorState(RichUtils.toggleInlineStyle(editorState, 'UNDERLINE'));
  };

  const onBoldClick = () => {
    setEditorState(RichUtils.toggleInlineStyle(editorState, 'BOLD'));
  };

  const onItalicClick = () => {
    setEditorState(RichUtils.toggleInlineStyle(editorState, 'ITALIC'));
  };

  const onStrikeThroughClick = () => {
    setEditorState(RichUtils.toggleInlineStyle(editorState, 'STRIKETHROUGH'));
  };

  const handleChange = (editorState) => {
    setEditorState(editorState);
  };

  const onBlur = () => {
    const contentState = editorState.getCurrentContent();
    firebase.updateNoteDetails(noteId, {
      other: JSON.stringify(convertToRaw(contentState)),
    });
  };

  return (
    <>
      <StyledButton id="underline" onClick={onUnderlineClick}>
        U
      </StyledButton>
      <StyledButton id="bold" onClick={onBoldClick}>
        B
      </StyledButton>
      <StyledButton id="italic" onClick={onItalicClick}>
        I
      </StyledButton>
      <StyledButton id="linethrough" onClick={onStrikeThroughClick}>abc</StyledButton>
      <StyledEditor>
        <Editor
          editorState={editorState}
          onChange={handleChange}
          handleKeyCommand={handleKeyCommand}
          onBlur={onBlur}
        />
      </StyledEditor>
    </>
  );
};

export default EditorArea;
