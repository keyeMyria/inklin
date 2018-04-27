import React from 'react';
import PropTypes from 'prop-types';
import TextField from 'material-ui/TextField';
import Paper from 'material-ui/Paper';
import { MenuItem } from 'material-ui/Menu';
import { withStyles } from 'material-ui/styles';
import Snackbar from 'material-ui/Snackbar';
import Slide from 'material-ui/transitions/Slide';

function renderInput(inputProps) {
  const { classes, ref, ...other } = inputProps;

  return (

    <TextField
      fullWidth
      InputProps={{
        inputRef: ref,
        classes: {
          input: classes.input,
        },
        ...other,
      }}
      value={this.props.value}
      onKeyPress={(ev) => {
        console.log(`Pressed keyCode ${ev.key}`);
        if (ev.key == 'Enter') {
          console.log("Submit")
          // Do code here
          ev.preventDefault();
        }
      }}
    />


  );
}



const styles = theme => ({
  input: {
    color: "black",
    width: "300px"
  }
});

class SearchField extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      SearchField: ''
    };
  }
  askLuis = () => {

    fetch("https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/6b784922-f81a-40af-b616-afb200c5634e?subscription-key=d40e1e70cc734cc09cdd5f669d90c708&verbose=true&timezoneOffset=0&q=" + this.state.SearchField)
      .then(response => response.json())
      .then(data => this.props.handleLuis(data))
  };

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
      placeholder: 'What do you want to know? (e.g. Show all EOS transactions today)',
      value: this.state.value
    }

    return (
      <TextField
        fullWidth
        InputProps={{
          classes,
          placeholder: this.props.placeholder,
        }}
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
