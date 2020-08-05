import React from 'react';
import { Button, TextField } from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      position: 'fixed',
      right: 0,
      top: 0,
      '& .MuiTextField-root': {
        margin: theme.spacing(1),
        width: '25ch',
      },
    },
    row: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
  }),
);

interface Props {
  myPeerId: string
  onChangeTheirId: (event: any) => void
  onClickCall: (event: any) => void
}

function ControlPanel(props: Props) {
  const classes = useStyles();

  const copyMyPeerId = () => {
    navigator.clipboard.writeText(props.myPeerId)
  }

  return (
    <form id="control-panel" className={classes.root} noValidate autoComplete="off">
      <div className={classes.row}>
        <TextField
          id="my-id"
          className="peer-id"
          label="My ID"
          type="text"
          InputProps={{
            readOnly: true,
          }}
          variant="filled"
          value={props.myPeerId}
        ></TextField>
        <Button onClick={() => copyMyPeerId()}>Copy</Button>
      </div>
      <div className={classes.row}>
        <TextField
          id="their-id"
          className="peer-id"
          label="Their ID"
          type="text"
          required
          onChange={props.onChangeTheirId}
        ></TextField>
        <Button onClick={props.onClickCall} color="primary">Call</Button>
      </div>
    </form>
  );
}

export default ControlPanel;