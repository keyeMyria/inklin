import React from 'react';

import {Bar} from 'react-chartjs-2';


class VolumeChart extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
    <div className="volumechart">
      <Bar data={this.props.data} width={400} height={200} redraw={this.props.shouldRedraw} />
    </div>
    )
  };

}

export default (VolumeChart);
