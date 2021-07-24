import { Component } from 'react';
import Field from './components/Field'
import Panel from './components/Panel'
import './App.css';
var StateMachine = require('javascript-state-machine')

class App extends Component {
  constructor(props){
    super(props);

    this.state = {
      button1Text: "State 1",
      button2Text: "State 2",
      button3Text: "State 3",
      button1Callback: null,
      button2Callback: null,
      button3Callback: null,
    }

    this.stateMachine = new StateMachine({
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
  }

  componentDidMount(){
    this.stateMachine.start();
  }

  onState1(){
    console.log("State1 Trigger")
    const button1Text = "State2";
    const button2Text = "State3";
    const button3Text = "State4";

    this.setState({
      button1Text: button1Text,
      button2Text: button2Text,
      button3Text: button3Text,
      button1Callback: ()=>{this.stateMachine.state2tran()},
      button2Callback: ()=>{this.stateMachine.state3tran()},
      button3Callback: ()=>{this.stateMachine.state4tran()}
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
      button1Callback: ()=>{this.stateMachine.state1tran()},
      button2Callback: ()=>{this.stateMachine.state3tran()},
      button3Callback: ()=>{this.stateMachine.state4tran()}
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
      button1Callback: ()=>{this.stateMachine.state1tran()},
      button2Callback: ()=>{this.stateMachine.state2tran()},
      button3Callback: ()=>{this.stateMachine.state4tran()}
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
      button1Callback: ()=>{this.stateMachine.state1tran()},
      button2Callback: ()=>{this.stateMachine.state2tran()},
      button3Callback: ()=>{this.stateMachine.state3tran()}
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

  render() {
    return (
      <div class="App">
          <Field />
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
