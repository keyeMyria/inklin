/* eslint-disable react/no-multi-comp */

import React from 'react';
import Button from '@material-ui/core/Button';
import Avatar from '@material-ui/core/Avatar';
import List, { ListItem, ListItemAvatar, ListItemText } from '@material-ui/core/List';
import Dialog, { DialogTitle } from '@material-ui/core/Dialog';
import PersonIcon from '@material-ui/icons/Person';
import AddIcon from '@material-ui/icons/Add';
import Typography from '@material-ui/core/Typography';



class SimpleDialog extends React.Component {
  handleClose = () => {
    this.props.onClose(this.props.selectedValue);
  };

  handleListItemClick = value => {
    this.props.onClose(value);
  };

  render() {
    const { classes, onClose, selectedValue, ...other } = this.props;

    return (
      <Dialog onClose={this.handleClose} aria-labelledby="simple-dialog-title" {...other}>
        <DialogTitle id="simple-dialog-title">Choose a Contract</DialogTitle>
        <div>
          <List>
            {this.props.choices.map(contract => (
              <ListItem button onClick={() => this.handleListItemClick(contract)} key={contract.symbol}>
                <ListItemText primary={contract.name} />
              </ListItem>
            ))}

          </List>
        </div>
      </Dialog>
    );
  }
}



export default SimpleDialog;