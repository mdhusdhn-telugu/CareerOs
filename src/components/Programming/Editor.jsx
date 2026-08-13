import React from 'react';
import Editor from 'react-simple-code-editor';
import Prism from 'prismjs';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-java';
import 'prismjs/components/prism-c';
import 'prismjs/components/prism-cpp';
// Import a Prism theme for colors
import 'prismjs/themes/prism-tomorrow.css'; 

export const CodeEditor = ({ code, onChange, language }) => {
  const highlight = (code) => {
    return Prism.highlight(code, Prism.languages[language] || Prism.languages.javascript, language);
  };

  return (
    <div style={{height: '100%', fontFamily: '"Fira Code", monospace', fontSize: 14, background: '#1e293b'}}>
       <Editor
          value={code}
          onValueChange={onChange}
          highlight={highlight}
          padding={20}
          style={{ minHeight: '100%' }}
        />
    </div>
  );
};