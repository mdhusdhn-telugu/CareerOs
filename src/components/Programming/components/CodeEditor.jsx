import React from 'react';
import Editor from 'react-simple-code-editor';
import Prism from 'prismjs';

import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-java';
import 'prismjs/components/prism-c';
import 'prismjs/components/prism-cpp';
import 'prismjs/components/prism-csharp';
import 'prismjs/components/prism-go';
import 'prismjs/components/prism-rust';
import 'prismjs/components/prism-sql';

import 'prismjs/themes/prism-tomorrow.css'; 

export const CodeEditor = ({ code, onChange, language, readOnly = false }) => {
  const highlight = (code) => {
    const grammar = Prism.languages[language] || Prism.languages.clike;
    return Prism.highlight(code, grammar, language);
  };

  return (
    <div className="editor-wrapper">
       <Editor
          value={code}
          onValueChange={onChange ? onChange : () => {}}
          highlight={highlight}
          padding={20}
          readOnly={readOnly}
          className="code-editor-input"
          style={{
            fontFamily: '"Fira Code", "JetBrains Mono", monospace',
            fontSize: 14,
            backgroundColor: readOnly ? 'transparent' : '#0f172a',
            minHeight: '100%',
          }}
          textareaClassName="focus:outline-none"
        />
    </div>
  );
};