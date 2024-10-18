import './highlight';

import PropTypes from 'prop-types';
import ReactQuill from 'react-quill';

import { alpha } from '@mui/material/styles';

import { StyledEditor } from './styles';
import Toolbar, { formats } from './toolbar';
import { useEffect, useRef, useState } from 'react';
import { Typography } from '@mui/material';

// ----------------------------------------------------------------------

export default function Editor ({
  id = 'minimal-quill',
  initialValue,
  setValue,
  error,
  simple = false,
  helperText,
  disabled = false,
  sx,
  ...other
}) {
  const modules = {
    toolbar: {
      container: `#${id}`,
    },
    history: {
      delay: 500,
      maxStack: 100,
      userOnly: true,
    },
    syntax: true,
    clipboard: {
      matchVisual: false,
    },
  };

  function getTextLengthWithoutHTML (htmlString) {
    // Create a temporary element
    const tempElement = document.createElement('div');
    // Set the HTML content of the temporary element
    tempElement.innerHTML = htmlString;
    // Get the text content without HTML tags
    const textWithoutHTML = tempElement.textContent || tempElement.innerText || '';
    // Measure the length of the text
    const textLength = textWithoutHTML.length;
    return textLength;
  }

  const [length, setLength] = useState(getTextLengthWithoutHTML(initialValue || ''));
  const quillRef = useRef(null);
  const handleProcedureContentChange = (content) => {
    if (quillRef.current) {
      const quill = quillRef.current.getEditor();
      const length = quill.getLength() - 1;
      setLength(length);
      if (length > 5000) {
        quill.deleteText(5000, length);
      } else if (length === 0) {
        setValue(null);
      } else {
        setValue(content);
      }
    }
  };
  useEffect(() => {
    setLength(getTextLengthWithoutHTML(initialValue || ''));
  }, [initialValue]);

  return (
    <>
      <StyledEditor
        sx={{
          ...(error && {
            border: (theme) => `solid 1px ${theme.palette.error.main}`,
            '& .ql-editor': {
              bgcolor: (theme) => alpha(theme.palette.error.main, 0.08),
            },
          }),
          ...sx,
        }}
      >
        <Toolbar id={id} simple={simple} />

        <ReactQuill
          modules={modules}
          formats={formats}
          ref={quillRef}
          onChange={handleProcedureContentChange}
          value={initialValue}

          readOnly={disabled}
          placeholder="Write something for the description..."
          {...other}
        />
        <Typography variant="body2" mr={2} fontWeight={400} color="GrayText" fontStyle={'italic'} textAlign="right">{length} / 5000 words</Typography>
      </StyledEditor>

      {helperText && helperText}
    </>
  );
}

Editor.propTypes = {
  error: PropTypes.bool,
  helperText: PropTypes.object,
  id: PropTypes.string,
  simple: PropTypes.bool,
  sx: PropTypes.object,
};
