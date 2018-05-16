import React from 'react';
import { withStyles } from 'material-ui/styles';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/core/Typography';
import IconButton from 'material-ui/IconButton';
import LogoIcon from '@material-ui/icons/BlurOn';
import SettingsVoice from '@material-ui/icons/SettingsVoice';
import Switch from 'material-ui/Switch';
import { FormControlLabel, FormGroup } from 'material-ui/Form';
import SearchField from './SearchField'
import { MuiThemeProvider, createMuiTheme } from 'material-ui/styles';



const theme = createMuiTheme({
  palette: {
    type: 'dark', // Switching the dark mode on is a single property value change.
  },
});

const style = {
  backgroundColor: 'rgba(0,0,0,0.5)'
};

const styles = {
  root: {
    flexGrow: 1,
  },
  flex: {
    flex: 1,
    fontWeight: "lighter"
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
  },
};

class MenuAppBar extends React.Component {
  constructor(props) {
    super(props);
   // this.handleFocus = this.props.handleFocus.bind(this);

  }

  handleLuis(info) {
    this.props.onLuis(info);
  }


  render() {
    const { classes } = this.props;
    
    return (
      <div className="menu">

        <AppBar position="static" style={style}>
          <Toolbar>
            {/* <IconButton className={classes.menuButton} color="inherit" aria-label="Menu">
              <MenuIcon />
            </IconButton>
             */}

            <IconButton className={classes.logoIcon} color="inherit" aria-label="Logo">
              <LogoIcon />
            </IconButton>
            <Typography variant="title" color="inherit" className={classes.flex}>
              Inklin
            </Typography>
              <IconButton
    
                  onClick={this.props.onSpeak}
                  color="inherit"
                >
                  <SettingsVoice />
                </IconButton>              <div>
                <SearchField handleFocus={this.props.handleFocus} handleLuis={this.props.onLuis} placeholder={this.props.placeholder} />
              </div>

          </Toolbar>
        </AppBar>
      </div>
    );
  }
}



export default withStyles(styles)(MenuAppBar);
//export default MenuAppBar;

