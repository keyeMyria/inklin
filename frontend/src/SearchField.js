import React from 'react';
import TextField from '@material-ui/core/TextField';
import { withStyles } from '@material-ui/core/styles';

import ReactGA from 'react-ga';

ReactGA.initialize('UA-64729178-1');
ReactGA.pageview(window.location.pathname + window.location.search);





const styles = theme => ({
  input: {
    color: "white",
    width: "600px"
  }
});

class SearchField extends React.Component {
  constructor(props) {
    super(props);
    // this.handleFocus = this.props.handleFocus.bind(this);

    this.state = {
      SearchField: ''
    };
  }
  askLuis = () => {

    ReactGA.event({
      category: 'Search',
      action: 'Term',
      label: this.state.SearchField
    });

    console.log(this.state.SearchField.length)
    if (this.state.SearchField.length === 42 && this.state.SearchField.startsWith("0x")) {
      console.log("Address/Contract Lookup")
      this.props.handleLuis(this.state.SearchField, "Address")
    } else if (!isNaN(this.state.SearchField)) {
      console.log("Block Lookup")
      this.props.handleLuis(this.state.SearchField, "Block")
    } else {
      fetch("https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/6b784922-f81a-40af-b616-afb200c5634e?subscription-key=d40e1e70cc734cc09cdd5f669d90c708&verbose=true&timezoneOffset=0&q=" + this.state.SearchField)
        .then(response => response.json())
        .then(data => this.props.handleLuis(data, "Natural"))
    }
  }

  handleChange = event => {
    this.setState({
      SearchField: event.target.value,
    });
  };




  handleTextFieldChange = ({ ev }) => {
    console.log(`Pressed keyCode ${ev.key}`);

    if (ev.key === 'Enter') {
      // Do code here
      console.log("Submit ", SearchField)

      //this.askLuis(this.state.SearchField)
      ev.preventDefault();
    }

  }


  render() {
    const { classes } = this.props;

    const inputProps = {
      classes,
      placeholder: 'Find Contract/Address...',
      value: this.state.value
    }

    return (
      <TextField
        fullWidth
        InputProps={{
          classes,
          placeholder: this.props.placeholder,
        }}
        onFocus={this.props.handleFocus}
        onChange={this.handleChange}
        onKeyPress={(ev) => {
          if (ev.key === 'Enter') {
            this.askLuis()
            ev.preventDefault();
          }
        }}

      />);
  }
}



export default withStyles(styles)(SearchField);
