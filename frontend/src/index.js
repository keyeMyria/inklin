import React from 'react';
import ReactDOM from 'react-dom';
import { ForceGraph3D } from 'react-force-graph'
import { ForceGraph2D } from 'react-force-graph'
import MenuAppBar from './MenuAppBar'
import VolumeChart from './VolumeChart';
import InfoSnackBar from './InfoSnackBar'
import { MuiThemeProvider, createMuiTheme } from 'material-ui/styles';
import ActionsButton from './ActionsButton';
import ContractChooser from './ContractChooser';
import Toggles from './Toggles';
import SearchDialog from './SearchDialog';
import Pagination from './Pagination';

import './index.css';

const theme = createMuiTheme({
  palette: {
    type: 'dark',
  },
});

class Inklin extends React.Component {


  constructor(props) {
    super(props);
    this.handleLuis = this.handleLuis.bind(this);
    this.handleSpeak = this.handleSpeak.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.handleCloseSearch = this.handleCloseSearch.bind(this);

    this.addData = this.addData.bind(this);
    this.handleContractChooserClose = this.handleContractChooserClose.bind(this);
    this.handleToggle = this.handleToggle.bind(this)

    this.state = {
      FG2DIsHidden: false,
      FG3DIsHidden: true,
      volumeIsHidden: true,
      showSearch: false,
      placeholder: 'What do you want to know? (e.g. Show all EOS transactions today)',
      searchResults: [{ name: "One" }, { name: "two" }, { name: "three" }],
      showContractChooser: false,
      contract: "",
      shouldRedraw: false,
      showSnackbar: true,
      messageSnackbar: "Showing all Ethereum Transactions",
      current_block: 0,
      volume_options: {
        animation: false
      },
      volume_data: {
        labels: [],
        datasets: [
          {
            label: 'tx/block',
            backgroundColor: '#40c4ff',
            borderWidth: 1,
            data: []
          }
        ]
      },
      data: {
        nodes: [{ id: 0 }, { id: 1 }],
        links: []
      }
    };

  }



  showContract(searchTerm, timing) {

    if (searchTerm != "") {
      const url = 'http://localhost:7071/api/inklin/search/' + searchTerm

      console.log(url);

      fetch(url).then(res => res.json()).then(data => {
        if (data.length == 1) {
          this.state.contract = data[0]["address"]
          this.state.current_block = 0

          console.log(this.state.contract);
          clearInterval(this.state.timer);

          this.state.data = {
            nodes: [{ id: 0 }],
            links: []
          }
          this.componentDidMount()
        } else if (data.length > 1) {
          console.log("Found ", data.length, " opening chooser")
          this.setState({ searchResults: data })
          this.setState({ showContractChooser: true })
        } else if (data.length == 0) {
          console.log("No results");
        }
      });

    }
  }

  handleSpeak() {
    console.log("Speak")
    this.setState({ placeholder: "Start Speaking..." })
  }

  handleCloseSearch() {
    console.log("Close Search")
    this.setState({ showSearch: false })
  }


  handleSearch() {
    console.log("Search")
    this.setState({ showSearch: true })
  }

  handleLuis(resp) {

    if (resp["topScoringIntent"]["intent"] == "Show Contract") {
      var token = ""
      var timing = ""

      for (var i in resp["entities"]) {
        if (resp["entities"][i]["type"] == "token") {
          token = resp["entities"][i]["entity"].toUpperCase()
        }


        if (resp["entities"][i]["type"] == "builtin.datetimeV2.date") {
          timing = resp["entities"][i]["resolution"]["values"][0]["value"]
        }

        if (resp["entities"][i]["type"] == "builtin.datetimeV2.datetimerange" || resp["entities"][i]["type"] == "builtin.datetimeV2.daterange") {
          timing = resp["entities"][i]["resolution"]["values"][0]["start"]
        }
        this.showContract(token, timing)

      }
    } else {
      this.setState({ messageSnackbar: "Sorry I don't understand" });
    }
  }

  addData(data) {
    var vd = this.state.volume_data

    vd.labels.push("")
    vd.datasets[0].data.push(data)
    // {
    //   labels: this.state.volume_data.labels,
    //   datasets: [
    //     {
    //       label: 'tx/block',
    //       backgroundColor: '#40c4ff',
    //       borderWidth: 1,
    //       data: this.state.volume_data.datasets[0].data
    //     }
    //   ]
    // }


    // vd.datasets[0].data.push(data)
    // vd.labels.push("")

    //  if (vd.labels.length > 100) {
    //   vd.datasets[0].data.shift();
    //   vd.labels.shift();
    //  }

    this.setState({ volume_data: vd, shouldRedraw: true })

  }

  handleContractChooserClose(val) {

    this.state.contract = val.address
    this.state.current_block = 0

    clearInterval(this.state.timer);

    this.state.data = {
      nodes: [],
      links: []
    }
    this.componentDidMount()
    this.setState({ showContractChooser: false })



  }

  getAll() {
    const url = "http://localhost:7071/api/inklin/transactions/2017-06-19/2017-06-20"
    //const url = "http://52.234.227.0/api/inklin/transactions/2017-06-19/2017-06-20"
    const nodes = []
    const links = []

    fetch(url).then(res => res.json()).then(data => {
      console.log(`Got ${data.docs.length} results`);


      for (let y = 0; y < data.docs.length; y++) {
        const from = data.docs[y]["from"];
        const to = data.docs[y]["to"];
        //const value = data[y]["value"];

        let exists = false;
        if (from != null && to != null) {
          for (let i = 0; i < nodes.length; i++) {
            if (to === nodes[i].id) {
              exists = true;
            }
          }
          nodes.push({ id: from, color: "white", name: from });
          // Only add the node if it doesn't exist
          if (!exists) {
            nodes.push({ id: to, color: "white", name: to });
          }

          links.push({ source: from, target: to, color: "#2aaee2" })
        }
      }

      this.setState({ data: { nodes, links } })

    });
  }


  stream() {
    const url = "http://localhost:7071/api/inklin/live/0"

    const nodes = []
    const links = []

    fetch(url).then(res => res.json()).then(data => {
      console.log(`Got ${data.docs.length} results`);


      for (let y = 0; y < data.length; y++) {
        const from = data[y]["from"];
        const to = data[y]["to"];
        //const value = data[y]["value"];

        let exists = false;
        if (from != null && to != null) {
          for (let i = 0; i < nodes.length; i++) {
            if (to === nodes[i].id) {
              exists = true;
            }
          }
          nodes.push({ id: from, color: "white", name: from });
          // Only add the node if it doesn't exist
          if (!exists) {
            nodes.push({ id: to, color: "white", name: to });
          }

          links.push({ source: from, target: to, color: "#2aaee2" })
        }
      }

      this.setState({ data: { nodes, links } })

    });
  }


  handleToggle(action) {
    switch (action) {
      case "live":
        console.log("Handle Live")
        break;
      case "perspective":
        console.log("Handle Perspective")
        const data = this.state.data
        console.log(data)
        this.setState({data: {
          nodes: [{ id: 0 }, { id: 1 }],
          links: []
        }})

        this.setState({ FG2DIsHidden: !this.state.FG2DIsHidden, FG3DIsHidden: !this.state.FG3DIsHidden })

        this.getAll()

        break;
      case "volume":
        this.setState({ volumeIsHidden: !this.state.volumeIsHidden })
        break;

    }

    console.log(action)
  }

  componentDidMount() {

    // if (this.state.contract != "") {
    //   var url = "http://localhost:7071/api/contracts/" + this.state.current_block + "/" + this.state.contract
    // } else {
    //   var url = 'http://localhost:7071/api/transactions/' + this.state.current_block
    //   //var url = "https://inklin.azurewebsites.net/api/transactions/" + this.state.current_block + "?code=Dj1xvN87Vb7/pm9afRunrq9UaUFz8uLfWG/vqaQj8dGwqsEfwuz46Q=="
    // }

    // fetch(url).then(res => res.json()).then(data => {
    //   var current_tx = 0;

    //   this.addData(data.length)

    //   this.state.shouldRedraw = false

    //   this.state.timer = setInterval(() => {

    //     const from = parseInt(data[current_tx]["from"], 16);
    //     const to = parseInt(data[current_tx]["to"], 16);

    //     const value = data[current_tx]["value"];
    //     const block_time = data[current_tx]["block_time"];
    //     const nodes = this.state.data.nodes
    //     const links = this.state.data.links


    //     if (from != null && to != null) {

    //       var exists = false;

    //       for (var i = 0; i < nodes.length; i++) {
    //         if (to === nodes[i].id) {
    //           exists = true;
    //         }
    //       }
    //       nodes.push({ id: from, color: "white" });
    //       // Only add the node if it doesn't exist
    //       //if (!exists) {
    //       nodes.push({ id: to, color: "white" });
    //       //}

    //       links.push({ source: from, target: to, color: "#2aaee2" })

    //       //console.log(data.length - current_tx)
    //       //if (current_tx % 10 == 0) {
    //       // this.setState({data: {nodes, links}})

    //       // }


    //     }

    //     if (current_tx == data.length - 1) {

    //       console.log(data[current_tx]["block_number"])

    //       clearInterval(this.state.timer);

    //       this.setState({ data: { nodes, links } })

    //       this.setState(({ current_block: current_block }) => {
    //         return {
    //           current_block: data[current_tx]["block_number"]
    //         };
    //       });

    //       current_tx = 0;
    //       // this.componentDidMount()
    //     }

    //     current_tx++;
    //   }, 50);
    // });


    this.getAll()
  }

  render() {
    const { data } = this.state;

    return (
      <MuiThemeProvider theme={theme}>

        <div>
          <MenuAppBar onLuis={this.handleLuis} onSpeak={this.handleSpeak} handleFocus={this.handleSearch} placeholder={this.state.placeholder} />

        
          {!this.state.FG3DIsHidden && <ForceGraph3D enableNodeDrag={false} graphData={data} cooldownTime={5000} />}
          {!this.state.FG2DIsHidden && <ForceGraph2D enableNodeDrag={false} graphData={data} cooldownTime={5000} />}


          {!this.state.volumeIsHidden && <VolumeChart data={this.state.volume_data} options={this.state.volume_options} shouldRedraw={this.state.shouldRedraw} />}

          <InfoSnackBar open={this.state.showSnackbar} message={this.state.messageSnackbar} onClose={this.s} />
          {/* <ActionsButton onSearch={this.handleSearch} /> */}

          <ContractChooser
            choices={this.state.searchResults}
            selectedValue={this.state.contract}
            open={this.state.showContractChooser}
            onClose={this.handleContractChooserClose}
          />


         {!this.state.paginationIsHidden && <Pagination pages={this.state.pages} />} 

          <Toggles handleToggle={this.handleToggle} />
          <SearchDialog open={this.state.showSearch} closeDrawer={this.handleCloseSearch} />
        </div>
      </MuiThemeProvider>

    );
  }
}


ReactDOM.render(
  <Inklin />,
  document.getElementById('root')
);
