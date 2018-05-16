import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import SpeedDial from '@material-ui/lab/SpeedDial';
import SpeedDialIcon from '@material-ui/lab/SpeedDialIcon';
import SpeedDialAction from '@material-ui/lab/SpeedDialAction';
import ContentCopyIcon from '@material-ui/icons/ContentCopy';
import SaveIcon from '@material-ui/icons/Save';
import LaunchIcon from '@material-ui/icons/Launch';
import ShareIcon from '@material-ui/icons/Share';
import AllOutIcon from '@material-ui/icons/AllOut';
import SearchIcon from '@material-ui/icons/Search';

const styles = theme => ({
  root: {
    height: 380,
    backgroundColor: "black"
  },
  speedDial: {
    position: 'absolute',
    bottom: theme.spacing.unit * 2,
    right: theme.spacing.unit * 3,
  },
});

const actions = [
  { icon: <ShareIcon />, name: 'Share' },
  { icon: <AllOutIcon />, name: 'Zoom to Fit' },
  { icon: <SearchIcon />, name: 'Search' },
];

class ActionsButton extends React.Component {

  constructor(props) {
    super(props);
  }

  state = {
    open: false,
    hidden: false,
  };

  handleVisibility = () => {
    this.setState({
      open: false,
      hidden: !this.state.hidden,
    });
  };

  handleClick = () => {

    this.setState({
      open: !this.state.open,
    });
  };

  handleOpen = () => {
    if (!this.state.hidden) {
      this.setState({
        open: true,
      });
    }
  };

  handleClose = () => {
    this.setState({
      open: false,
    });
  };

  render() {
    const { classes } = this.props;
    const { hidden, open } = this.state;

    return (
      <div className={classes.root}>
        <Button onClick={this.handleVisibility}>Toggle Speed Dial</Button>
        <SpeedDial
          ariaLabel="SpeedDial openIcon example"
          className={classes.speedDial}
          hidden={hidden}
          icon={<SpeedDialIcon openIcon={<LaunchIcon />} />}
          onBlur={this.handleClose}
          onClick={this.props.onSearch}
          onClose={this.handleClose}
          onFocus={this.handleOpen}
          onMouseEnter={this.handleOpen}
          onMouseLeave={this.handleClose}
          open={open}
        >
          {actions.map(action => (
            <SpeedDialAction
              key={action.name}
              icon={action.icon}
              tooltipTitle={action.name}
              onClick={this.props.onSearch}
            />
          ))}
        </SpeedDial>
      </div>
    );
  }
}

ActionsButton.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ActionsButton);