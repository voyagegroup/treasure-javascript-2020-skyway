import 'ace-builds/src-noconflict/ace';
import 'ace-builds/src-noconflict/mode-c_cpp';
import 'ace-builds/src-noconflict/theme-chaos';
import React from 'react';
import AceEditor from 'react-ace';

let editorInstance = null;
const Editor = React.memo((props) => {
  console.log('start Editor')
  const text = props.text;
  const onChange = () => {
    const editText = editorInstance.getValue()
    // console.log("editText=", editText);
    /* 親コンポーネントのeditTextを更新 */
    props.setEditText(editText);

  };
  /* editorInstance作成後 */
  const onLoad = (newEditorInstance) => {
    editorInstance = newEditorInstance;
  };

  return (
  <div className="bg-gray-900 flex-auto">
      <h2>Share Code</h2>
      <AceEditor
      editorProps={{ $blockScrolling: 'true' }}
      fontSize="16px"
      height="500px"
      highlightActiveLine={false}
      mode="c_cpp"
      name="UNIQUE_ID_OF_DIV"
      onChange={onChange}
      onLoad={onLoad}
      showPrintMargin={false}
      tabSize={4}
      theme="chaos"
      value={text}
      width="100%"
      wrapEnabed={false}
      />
  </div>
  );
},
// Props.editTextが変更されない限り, 再レンダリングしない
  (prevProps, nextProps) => prevProps.text === nextProps.text,
);


export default Editor;
