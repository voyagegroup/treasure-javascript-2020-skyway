import React from 'react';

interface Props {
  myPeerId: string
  onChangeTheirId: (event: any) => void
  onClickCall: (event: any) => void
}

function ControlPanel(props: Props) {
  const copyMyPeerId = () => {
    navigator.clipboard.writeText(props.myPeerId)
  }

  return (
    <div id="control-panel">
      <div>
        <label htmlFor="my-id">Your ID: </label>
        <input
          id="my-id"
          className="peer-id"
          type="text"
          readOnly
          value={props.myPeerId}
        ></input>
        <button onClick={() => copyMyPeerId()}>Copy</button>
      </div>
      <div>
        <label htmlFor="their-id">Their ID: </label>
        <input
          id="their-id"
          className="peer-id"
          type="text"
          onChange={props.onChangeTheirId}
        ></input>
        <button onClick={props.onClickCall}>Call</button>
      </div>
    </div>
  );
}

export default ControlPanel;