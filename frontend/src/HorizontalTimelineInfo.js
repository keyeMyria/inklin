import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import ReactGA from 'react-ga';
import WorkIcon from '@material-ui/icons/Mail';
import SchoolIcon from '@material-ui/icons/Mail';


import { HorizontalTimeline } from 'react-horizontal-timeline';



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




class HorizontalTimelineInfo extends React.Component {


  render() {
    const { classes } = this.props;

    return (
        <div>
          {/* Bounding box for the Timeline */}
          <div style={{ width: '60%', height: '100px', margin: '0 auto' }}>
            <HorizontalTimeline
              index={this.state.value}
              indexClick={(index) => {
                this.setState({ value: index, previous: this.state.value });
              }}
              values={ VALUES } />
          </div>
          <div className='text-center'>
            {/* any arbitrary component can go here */}    
            {this.state.value}
          </div>
        </div>
    );
  }
}

HorizontalTimelineInfo.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(HorizontalTimelineInfo);