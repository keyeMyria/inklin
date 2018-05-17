import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListSubheader from '@material-ui/core/ListSubheader';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';


import Switch from '@material-ui/core/Switch';
import PerspectiveIcon from '@material-ui/icons/ThreeDRotation';
// import GoLive from '@material-ui/icons/FiberSmartRecord';
// import ShowVolume from '@material-ui/icons/Assessment';

import ReactGA from 'react-ga';

ReactGA.initialize('UA-64729178-1');
ReactGA.pageview(window.location.pathname + window.location.search);

const styles = theme => ({
  root: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: 'rgba(0,0,0,0.5)',
    fontColor: "white",
    position: 'absolute',
    bottom: theme.spacing.unit * 2,
    left: theme.spacing.unit * 3,

  },
});

class Toggles extends React.Component {

  handleChange = name => event => {
    ReactGA.event({
      category: 'Toggle',
      action: 'Change',
      value: name
    });
    
    this.props.handleToggle(name)
  };

  render() {
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        <List subheader={<ListSubheader>View Settings</ListSubheader>}>
        <ListItem>
            <ListItemIcon>
              <PerspectiveIcon />
            </ListItemIcon>
            <ListItemText primary="Change Perspective" />
            <ListItemSecondaryAction>
              <Switch
                onChange={this.handleChange('perspective')}
              />
            </ListItemSecondaryAction>
          </ListItem>
{/* 
          <ListItem>
            <ListItemIcon>
              <ShowVolume />
            </ListItemIcon>
            <ListItemText primary="Show Volume" />
            <ListItemSecondaryAction>
              <Switch
                onChange={this.handleChange('volume')}
              />
            </ListItemSecondaryAction>
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <GoLive />
            </ListItemIcon>
            <ListItemText primary="Live View" />
            <ListItemSecondaryAction>
              <Switch
                onChange={this.handleChange('live')}
              />
            </ListItemSecondaryAction>
          </ListItem>
*/}
        </List>
      </div>
    );
  }
}

Toggles.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Toggles);