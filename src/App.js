import { Component } from 'react';
import Field from './components/Field'
import Panel from './components/Panel'
import HexField from './components/HexField'
import * as Hex from './hex/Hex'
import './App.css';
var StateMachine = require('javascript-state-machine')

class App extends Component {
  constructor(props){
    super(props);

    this.state = {
      hexMap: new Map(),
      offset: [0, 0],
      mapWidth: 0,
      mapHeight: 0,
      hexSize: 20,
      button1Text: "State 1",
      button2Text: "State 2",
      button3Text: "State 3",
      button1Callback: null,
      button2Callback: null,
      button3Callback: null
    }

    this.stateMachine = new StateMachine({
      init: 'none',
      transitions: [
        {name: 'start',     from: 'none',   to: 'ready'},
        {name: 'drawWall',    from: 'ready',  to: 'drawingWalls'},
        {name: 'eraseWall',   from: 'ready',  to: 'erasingWalls'},
        {name: 'finishDraw',  from:['drawingWalls', 'erasingWalls'], to: 'ready'}
      ],
      methods: [

      ]
    })

    this.oldStateMachine = new StateMachine({
      init: 'none',
      transitions: [
        { name: 'start',       from: 'none', to:'state1'},
        { name: 'state1tran', from: ['state2', 'state3', 'state4'],    to:'state1'},
        { name: 'state2tran', from: ['state1', 'state3', 'state4'],    to:'state2'},
        { name: 'state3tran', from: ['state1', 'state2', 'state4'],    to:'state3'},
        { name: 'state4tran', from: ['state1', 'state2', 'state3'],    to:'state4'}
      ],
      methods: {
        onState1: () => this.onState1(),
        onState2: () => this.onState2(),
        onState3: () => this.onState3(),
        onState4: () => this.onState4()
      }
    })
    /*
    this.state.hexMap.set([0, 0, 0 ].toString(), new Hex.Hex(0, 0, 0) );
    this.state.hexMap.set([0, 1, -1].toString(), new Hex.Hex(0, 1, -1));
    this.state.hexMap.set([0, -1, 1].toString(), new Hex.Hex(0, -1, 1));
    this.state.hexMap.set([1, -1, 0].toString(), new Hex.Hex(1, -1, 0));
    this.state.hexMap.set([-1, 1, 0].toString(), new Hex.Hex(-1, 1, 0));
    this.state.hexMap.set([1, 0, -1].toString(), new Hex.Hex(1, 0, -1));
    this.state.hexMap.set([-1, 0, 1].toString(), new Hex.Hex(-1, 0, 1));
    */
  }

  componentDidMount(){
    this.oldStateMachine.start();
    this.stateMachine.start();
    const mapWidth = this.divElement.clientWidth;
    const mapHeight = this.divElement.clientHeight;

    const hexWidth = Math.ceil(mapWidth / (Math.sqrt(3) * this.state.hexSize)) + 1;
    const hexHeight = Math.ceil(mapHeight / (0.75 * 2 * this.state.hexSize)) + 1;
    console.log(hexHeight);
    for(let r = 0; r < hexHeight; r++){
      let r_off = Math.floor(r/2);
      for(let q = -r_off; q < hexWidth - r_off; q++){
        this.state.hexMap.set([q, r, -q-r].toString(), new Hex.Hex(q, r, -q-r));
      }
    }

    this.setState({
      hexMap: this.state.hexMap,
      offset: this.state.offset,
      mapWidth: mapWidth,
      mapHeight: mapHeight,
      hexSize: this.state.hexSize,
      button1Text: this.state.button1Text,
      button2Text: this.state.button2Text,
      button3Text: this.state.button3Text,
      button1Callback: this.state.button1Callback,
      button2Callback: this.state.button2Callback,
      button3Callback: this.state.button3Callback
    });
  }

  onState1(){
    const button1Text = "State2";
    const button2Text = "State3";
    const button3Text = "State4";

    this.setState({
      button1Text: button1Text,
      button2Text: button2Text,
      button3Text: button3Text,
      button1Callback: ()=>{this.oldStateMachine.state2tran()},
      button2Callback: ()=>{this.oldStateMachine.state3tran()},
      button3Callback: ()=>{this.oldStateMachine.state4tran()}
    })
  }

  onState2(){
    const button1Text = "State1";
    const button2Text = "State3";
    const button3Text = "State4";

    this.setState({
      button1Text: button1Text,
      button2Text: button2Text,
      button3Text: button3Text,
      button1Callback: ()=>{this.oldStateMachine.state1tran()},
      button2Callback: ()=>{this.oldStateMachine.state3tran()},
      button3Callback: ()=>{this.oldStateMachine.state4tran()}
    })
  }

  onState3(){
    const button1Text = "State1";
    const button2Text = "State2";
    const button3Text = "State4";

    this.setState({
      button1Text: button1Text,
      button2Text: button2Text,
      button3Text: button3Text,
      button1Callback: ()=>{this.oldStateMachine.state1tran()},
      button2Callback: ()=>{this.oldStateMachine.state2tran()},
      button3Callback: ()=>{this.oldStateMachine.state4tran()}
    })
  }

  onState4(){
    const button1Text = "State1";
    const button2Text = "State2";
    const button3Text = "State3";

    this.setState({
      button1Text: button1Text,
      button2Text: button2Text,
      button3Text: button3Text,
      button1Callback: ()=>{this.oldStateMachine.state1tran()},
      button2Callback: ()=>{this.oldStateMachine.state2tran()},
      button3Callback: ()=>{this.oldStateMachine.state3tran()}
    })
  }

  handelClick(i){
    switch(i){
      case 1:
        this.state.button1Callback();
        break;
      case 2:
        this.state.button2Callback();
        break;
      case 3:
        this.state.button3Callback();
        break;
      default:
        console.log("ERROR");
        break;
    }
  }

  hexFieldMouseMove(event){
    var x = event.pageX - this.state.offset[0];
    var y = event.pageY - this.state.offset[1];
    if(this.stateMachine.is('drawingWalls')){
      this.hexDraw(Hex.worldToHex(x, y, this.state.hexSize), 1);
    }
    else if(this.stateMachine.is('erasingWalls')){
      this.hexDraw(Hex.worldToHex(x, y, this.state.hexSize), 0);
    }
    /*
    for(let hex of this.state.hexMap.values()){
      hex.state = 0;
    }
    if(hex){
      hex.state = 1;
    }
    this.forceUpdate();
    */
    
  }

  hexFieldMouseDown(event){
    const x = event.pageX; const y = event.pageY;
    const hex = this.state.hexMap.get(Hex.worldToHex(x, y, this.state.hexSize).toString());
    if(hex){
      if(this.stateMachine.can('drawWall') && hex.state === 0){
        this.stateMachine.drawWall();

        hex.state=1;
        this.forceUpdate();
      }
      else if(this.stateMachine.can('eraseWall') && hex.state !== 0){
        this.stateMachine.eraseWall();

        hex.state=0;
        this.forceUpdate();
      }
    }
  }

  hexFieldMouseUp(){
    if(this.stateMachine.can('finishDraw')){
      this.stateMachine.finishDraw();
    }
  }

  hexDraw(coords, state){
    const hex = this.state.hexMap.get(coords.toString());
    if(hex){
      hex.state = state;
    }
    this.forceUpdate();
  }

  render() {
    return (
      <div 
        class="App" 
        style={{top: "0px", bottom:"0px", width:"100%", position:'absolute'}}
        ref={(divElement) => this.divElement = divElement}
      >
        <div class="header" />
          <HexField 
            width={this.state.mapWidth} height ={this.state.mapHeight}
            size={this.state.hexSize}
            hexes={this.state.hexMap}
            viewOffset={this.state.offset}
            onMouseDown={(e) => this.hexFieldMouseDown(e)}
            onMouseMove={(e) => this.hexFieldMouseMove(e)}
            onMouseUp=  {(e) => this.hexFieldMouseUp(e)}
          />
          <Panel header={this.stateMachine.state}>
            <button 
              class="panel-button"
              onClick={() => this.handelClick(1)}
            >
              {this.state.button1Text}
            </button>
            <button 
              class="panel-button"
              onClick={() => this.handelClick(2)}
            >
              {this.state.button2Text}
            </button>
            <button 
              class="panel-button"
              onClick={() => this.handelClick(3)}
            >
              {this.state.button3Text}
            </button>
          </Panel>
      </div>
    );
  }
}

export default App;
