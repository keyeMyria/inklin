import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';


import  ListItem  from '@material-ui/core/ListItem'
import  ListItemIcon  from '@material-ui/core/ListItemIcon' 
import  ListItemText  from '@material-ui/core/ListItemText'
import SearchField from './SearchField'
import Mic from '@material-ui/icons/Mic';
import Chat from '@material-ui/icons/Chat';
import IconButton from '@material-ui/core/IconButton';

const styles = {
    list: {
        width: "360px",
    },
    fullList: {
        width: '200px',
    }
};

class SearchDialog extends React.Component {

    constructor(props) {
        super(props);
    }

    state = {
        showDrawer: this.props.open,
        searchValue: ""
    };

    closeDrawer() {
        this.setState({
            showDrawer: false,
        });

    }

    render() {
        const { classes } = this.props;


        return (
            <div>
                <Drawer anchor="right" open={this.props.open} onClose={this.props.closeDrawer}>
                        <div className={classes.list}>

                            <List>
                                <div>
                                    <ListItem>
                                        <SearchField handleLuis={this.props.onLuis} placeholder={this.props.placeholder} value={this.state.searchValue} ref="search" />
                                        <IconButton onClick={this.props.onSpeak} color="inherit">
                                            <Mic />
                                        </IconButton>

                                    </ListItem>
                                    <ListItem button onClick={this.state.searchValue = "Show me all Ethereum transactions"}>
                                        <ListItemIcon>
                                            <Chat />
                                        </ListItemIcon>

                                        <ListItemText secondary="Show me all Ethereum transactions" />
                                    </ListItem>
                                    <ListItem button >
                                    <ListItemIcon>
                                            <Chat />
                                        </ListItemIcon>

                                        <ListItemText secondary="Show me all TRX transactions from two weeks ago" />
                                    </ListItem>
                                    <ListItem button>                                        <ListItemIcon>
                                            <Chat />
                                        </ListItemIcon>

                                        <ListItemText secondary="Show all EOS transactions" />
                                    </ListItem>
                                </div>

                            </List>

                        </div>
                </Drawer>
            </div>
        );
    }
}

SearchDialog.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(SearchDialog);
