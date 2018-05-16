import React from 'react';
import ReactDOM from 'react-dom';
import { ForceGraph3D } from 'react-force-graph'
import { ForceGraph2D } from 'react-force-graph'
import MenuAppBar from './MenuAppBar'
import VolumeChart from './VolumeChart';
import InfoSnackBar from './InfoSnackBar'
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import ActionsButton from './ActionsButton';
import ContractChooser from './ContractChooser';
import Toggles from './Toggles';
import SearchDialog from './SearchDialog';
import Info from './Info'
import ProgressIndicator from './ProgressIndicator'
import ReactGA from 'react-ga';

import './index.css';


// Setup GA
ReactGA.initialize('UA-64729178-1');
ReactGA.pageview(window.location.pathname + window.location.search);


const theme = createMuiTheme({
  palette: {
    type: 'dark',
  },
});

class Inklin extends React.Component {

  static NODE_R = 8;

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
      displayProgress: false,
      address: "0x274F3c32C90517975e29Dfc209a23f315c1e5Fc7",
      previousaddress: "0x274F3c32C90517975e29Dfc209a23f315c1e5Fc7", 
      highlightNodes: [],
      highlightLink: null,
      cameraOrbit: 0,
      FG2DIsHidden: false,
      FG3DIsHidden: true,
      volumeIsHidden: true,
      showSearch: false,
      placeholder: 'Find Contract/Address...',
      searchResults: [{ name: "One" }, { name: "two" }, { name: "three" }],
      showContractChooser: false,
      contract: "",
      shouldRedraw: false,
      showSnackbar: true,
      messageSnackbar: "Loading...",
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

  showContract = (searchTerm, timing) => {

    if (searchTerm !== "") {
      const url = 'http://api.inkl.in/api/inklin/search/' + searchTerm

      console.log(url);

      fetch(url).then(res => res.json()).then(data => {
        if (data.length === 1) {
          this.setState({contract: data[0]["address"], current_block: 0})

          console.log(this.state.contract);
          clearInterval(this.state.timer);

          this.setState({data: {
            nodes: [{ id: 0 }],
            links: []
          }})

          this.componentDidMount()
        } else if (data.length > 1) {
          console.log("Found ", data.length, " opening chooser")
          this.setState({ searchResults: data })
          this.setState({ showContractChooser: true })
        } else if (data.length === 0) {
          console.log("No results");
        }
      });

    }
  }

  showAddress = searchTerm => {

    if (searchTerm !== "") {
      this.setState({address: searchTerm})
      this.getAll(this.state.address)
    } else {
      console.log("Nothing to find...")
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

  handleLuis = (data, lookup) => {

    if (lookup === "Address") {
      if (data !== "") {
        ReactGA.event({
          category: 'Search',
          action: 'Address',
          value: data
        });

        this.setState({address: data})
        this.getAll(data)
      } else {
        console.log("Nothing to find...")
      }
  
    }

    if (lookup === "Block") {
        ReactGA.event({
          category: 'Search',
          action: 'Block',
          value: data
        });
    }

    if (lookup === "Natural") {


      if (data["topScoringIntent"]["intent"] === "Show Contract") {
        var token = ""
        var timing = ""

        for (var i in data["entities"]) {
          if (data["entities"][i]["type"] === "token") {
            token = data["entities"][i]["entity"].toUpperCase()
          }


          if (data["entities"][i]["type"] === "builtin.datetimeV2.date") {
            timing = data["entities"][i]["resolution"]["values"][0]["value"]
          }

          if (data["entities"][i]["type"] === "builtin.datetimeV2.datetimerange" || data["entities"][i]["type"] == "builtin.datetimeV2.daterange") {
            timing = data["entities"][i]["resolution"]["values"][0]["start"]
          }

          ReactGA.event({
            category: 'Search',
            action: 'Luis',
            value: `${token} within ${timing}`
          });
          this.showContract(token, timing)

        }
      } else {
        this.setState({ messageSnackbar: "Sorry I don't understand" });
        ReactGA.event({
          category: 'Search',
          action: 'Luis',
          value: "Don't Understand"
        });
      }
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

  handleContractChooserClose = val => {

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

  getAll(address) {
    this.setState({ data: {
      nodes: [{ id: 0, color: "black" }, { id: 1, color: "black" }],
      links: []
    }, displayProgress: true })

    const url = `${process.env.REACT_APP_API_SERVER}/api/inklin/txaddress/${address}`
    console.log(url)
    //const url = "http://localhost:7071/api/inklin/transactions/2018-02-06/2018-02-07"
    //const url = "http://52.234.227.0/api/inklin/transactions/2017-06-19/2017-06-20"
    const nodes = []
    const links = []

    fetch(url).then(res => res.json()).then(data => {
      console.log(`Got ${data.docs.length} results`);


      this.setState({ data: data.docs, displayProgress: false })
    });
  }

  stream() {
    const url = process.env.REACT_APP_API_SERVER + "/api/inklin/live/0"

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

  handleToggle = action => {
    switch (action) {
      case "live":
        console.log("Handle Live")
        break;
      case "perspective":
        console.log("Handle Perspective")
        const data = this.state.data
        console.log(data)
        this.setState({
          data: {
            nodes: [{ id: 0 }, { id: 1 }],
            links: []
          }
        })


        this.setState({ FG2DIsHidden: !this.state.FG2DIsHidden, FG3DIsHidden: !this.state.FG3DIsHidden })
        // if (!this.state.FG2DIsHidden) {
        //   clearInterval(this.state.cameraOrbit);
        // }

        !this.state.FG3DIsHidden ? clearInterval(this.state.cameraOrbit) : console.log("Going 3D...")

        this.getAll(this.state.address)

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


    this.getAll(this.state.address)
    // const distance = 600;

    // this.fg.cameraPosition({ z: distance });
    // // camera orbit
    // let angle = 0;
    // const cameraOrbit = setInterval(() => {
    //   this.fg.cameraPosition({
    //     x: distance * Math.sin(angle),
    //     z: distance * Math.cos(angle)
    //   });
    //   angle += Math.PI / 300;
    // }, 10);

    // this.setState({ cameraOrbit: cameraOrbit })
  }

  nodeClicked3d = node => {
    clearInterval(this.state.cameraOrbit);

    ReactGA.event({
      category: 'Graph',
      action: 'Click',
      label: node.id
    });

    this.setState({address: node.id})
    // Aim at node from outside it
    const distance = 100;
    const distRatio = 1 + distance / Math.hypot(node.x, node.y, node.z);
    this.fg.cameraPosition(
      { x: node.x * distRatio, y: node.y * distRatio, z: node.z * distRatio }, // new position
      node, // lookAt ({ x, y, z })
      3000  // ms transition duration
    );
  };

  nodeClicked2d = node => {
    clearInterval(this.state.cameraOrbit);
    if (this.fg.zoom() === 16) {
      ReactGA.event({
        category: 'Graph',
        action: 'Double Click',
        label: node.id
      });
      this.setState({address: node.id})
      this.fg.zoom(1, 100);
      this.getAll(node.id)

    } else {
      ReactGA.event({
        category: 'Graph',
        action: 'Click',
        label: node.id
      });

      this.setState({address: node.id})
      // Aim at node from outside it
      this.fg.centerAt(node.x, node.y, 1000);
      this.fg.zoom(16, 2000);
    }
  };


  nodeHover2d = node => {
    if (node) {
    this.setState({address: node.id})
    }
  };

  _handleNodeHover = node => {
    this.setState({ highlightNodes: node ? [node] : [] });
  };

  _handleLinkHover = link => {
    this.setState({
      highlightLink: link,
      highlightNodes: link ? [link.source, link.target] : []
    });
  };

  _paintNode = (node, ctx) => {
    const { NODE_R } = Inklin;
    const { highlightNodes } = this.state;
    if (highlightNodes.indexOf(node) !== -1) { // add ring
      ctx.beginPath();
      ctx.arc(node.x, node.y, NODE_R * 1.4, 0, 2 * Math.PI, false);
      ctx.fillStyle = 'red';
      ctx.fill();
    }
    ctx.beginPath();
    ctx.arc(node.x, node.y, NODE_R, 0, 2 * Math.PI, false);
    ctx.fillStyle = 'midnightblue';
    ctx.fill();
  };

  closeSnackbar = () => {
    console.log("Close trigger...")
    this.setState({showSnackbar: false})
  }

  render() {
    //    const { data } = this.state;
    const { data, highlightLink } = this.state;

    return (

      <div>
        <MuiThemeProvider theme={theme}>
          <MenuAppBar onLuis={this.handleLuis} onSpeak={this.handleSpeak} placeholder={this.state.placeholder} />


          {!this.state.FG3DIsHidden && <ForceGraph3D ref={el => { this.fg = el; }} enableNodeDrag={false} graphData={data} onNodeClick={this.nodeClicked3d}
            //  nodeRelSize={1}
            linkWidth={1}
            linkDirectionalParticles={4}
            linkDirectionalParticleWidth={2}
          // nodeCanvasObject={this._paintNode} 
          // onNodeHover={this._handleNodeHover}
          // onLinkHover={this._handleLinkHover} 
          />}


          {!this.state.FG2DIsHidden && <ForceGraph2D ref={el => { this.fg = el; }}  graphData={data} onNodeClick={this.nodeClicked2d}             
            linkWidth={1}
            linkDirectionalParticles={4}
            linkDirectionalParticleWidth={2}
            onNodeHover={this.nodeHover2d}
            />}


          {!this.state.volumeIsHidden && <VolumeChart data={this.state.volume_data} options={this.state.volume_options} shouldRedraw={this.state.shouldRedraw} />}

           {/* <InfoSnackBar open={this.state.showSnackbar} autoHideDuration={50} message={this.state.messageSnackbar} onClose={this.closeSnackbar} />  */}
          {/* <ActionsButton onSearch={this.handleSearch} /> */}

          {this.state.displayProgress && <ProgressIndicator />}

      {/*
          <ContractChooser
            choices={this.state.searchResults}
            selectedValue={this.state.contract}
            open={this.state.showContractChooser}
            onClose={this.handleContractChooserClose}
          />


      */} 

          <Toggles handleToggle={this.handleToggle} />
          <SearchDialog open={this.state.showSearch} closeDrawer={this.handleCloseSearch} />
          <Info address={this.state.address} blocknumber={this.state.blocknumber} blocktime={this.state.blocktime} /> 
        </MuiThemeProvider>
      </div>

    );
  }
}


ReactDOM.render(
  <Inklin />,
  document.getElementById('root')
);
