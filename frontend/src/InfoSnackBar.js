import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Snackbar from 'material-ui/Snackbar';


class SimpleSnackbar extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <Snackbar
                    open={this.props.open}
                    autoHideDuration={1000}
                    message={<span id="message-id">{this.props.message}</span>}
                />
            </div>
        );
    }
}

SimpleSnackbar.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default (SimpleSnackbar);
