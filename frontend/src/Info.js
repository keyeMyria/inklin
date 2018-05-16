
import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import AddressIcon from '@material-ui/icons/Mail';
import ImageIcon from '@material-ui/icons/Image';
import WorkIcon from '@material-ui/icons/Work';
import FormatAlignJustify from '@material-ui/icons/FormatAlignJustify';

import BeachAccessIcon from '@material-ui/icons/BeachAccess';

const styles = theme => ({
  root: {
    width: '100%',
    maxWidth: 450,
    backgroundColor: "black",
    fontColor: "white",
  },
});

const style = {backgroundColor: "black", color: "white"};


class Info extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {

    return (
      <div className="infoPane">
        <List>
          <ListItem>
            <Avatar style={style}>
              <AddressIcon />
            </Avatar>
            <ListItemText primary="Address" secondary={this.props.address} />
          </ListItem>
          <ListItem>
            <Avatar style={style}>
              <FormatAlignJustify />
            </Avatar>
            <ListItemText primary="Block" secondary="Jan 7, 2014" />
          </ListItem>
          <ListItem>
            <Avatar style={style}>
              <BeachAccessIcon />
            </Avatar>
            <ListItemText primary="Vacation" secondary="July 20, 2014" />
          </ListItem>
        </List>
      </div>
    );
  }
}



export default withStyles(styles)(Info);