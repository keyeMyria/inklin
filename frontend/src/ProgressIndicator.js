import React from 'react';

import LinearProgress from '@material-ui/core/LinearProgress';


class ProgressIndicator extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
    <div className="progressIndicator">
        <LinearProgress color="secondary"/>
    </div>
    )
  };

}

export default (ProgressIndicator);

