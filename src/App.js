import { Component } from 'react';
import Queue from './Queue'
import Panel from './components/Panel'
import HexField from './components/HexField'
import SidePanel from './components/SidePanel'
import Sidebar from './test/Sidebar'
import Content from './test/Content'
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
      searchResults: new Queue(),
      startNode: null,
      endNode: null,
      button1Text: null,
      button2Text: null,
      button3Text: null,
      button1Enabled: false,
      button2Enabled: false,
      button3Enabled: false,
      button1Callback: null,
      button2Callback: null,
      button3Callback: null
    }

    this.stateMachine = new StateMachine({
      init: 'none',
      transitions: [
        // start
        {name: 'start',       from: 'none',   to: 'ready'},

        // drawing
        {name: 'drawWall',    from: 'ready',  to: 'drawingWalls'},                  // drawing new walls
        {name: 'eraseWall',   from: 'ready',  to: 'erasingWalls'},                  // erasing walls
        {name: 'dragStart',   from: 'ready',  to: 'draggingStart'},                 // moving the start node
        {name: 'dragEnd',     from: 'ready',  to: 'draggingEnd'},                   // moving the end node
        {name: 'finishDraw',  from:['drawingWalls', 'erasingWalls', 'draggingStart', 'draggingEnd'], to: 'ready'},  // done drawing, ready to visualize

        // pathfinding
        {name: 'start',       from: 'ready',                                to: 'visualizing'},     // the algorithm is running
        {name: 'pause',       from: 'visualizing',                          to: 'paused'},          // the visualization is paused
        {name: 'cancel',      from: ['paused', 'finished'],                 to: 'ready'},           // cancel the search
        {name: 'resume',      from: 'paused',                               to: 'visualizing'},     // the visualization is resumed
        {name: 'finish',      from: 'visualizing',                          to: 'finished'},        // the program has vinished visualizing
        {name: 'restart',     from: ['finished', 'paused', 'visualizing'],  to: 'visualizing'},     // the program is restarting the visualization
        {name: 'clear',       from: ['ready', 'visualizing', 'paused', 'finished'],   to: 'ready'}

      ],
      methods: {
        onAfterTransition: () => this.forceUpdate(),
        onReady: () => this.onReady(),
        onVisualizing: () => this.onVisualizing(),
        onPaused: () => this.onPaused(),
        onFinished: () => this.onFinished(),

        onStart: () => this.onStart(),
        onRestart: () => this.onRestart(),
        onClear: () => this.onClear(),
        onCancel: () => this.onCancel()
      }
    })
  }


  /// --==== Initiliazation ====--

  hexFieldDidMount(e){
    this.stateMachine.start();

    const hexWidth = Math.ceil(e.width / (Math.sqrt(3) * this.state.hexSize));
    const hexHeight = Math.ceil(e.height / (0.75 * 2 * this.state.hexSize));
    console.log(hexHeight);
    for(let r = 0; r < hexHeight; r++){
      let r_off = Math.floor(r/2);
      for(let q = -r_off; q < hexWidth - r_off; q++){
        this.state.hexMap.set([q, r, -q-r].toString(), new Hex.Hex(q, r, -q-r));
      }
    }

    let halfHeight = Math.floor(hexHeight / 2);

    this.setState({
      mapWidth:   e.width,
      mapHeight:  e.height,
      mapPosX:    e.posX,
      mapPosY:    e.posY,
      startNode:  [0, halfHeight, -halfHeight],
      endNode:    [hexWidth - halfHeight, halfHeight, -hexWidth]
    });

    return({
      width: e.width,
      height: e.height,
      posX: e.posX,
      posY: e.posY,
      size: this.state.hexSize,
    });
  }

  /// --==== State Maching ====--


  // Called on any transition
  onTranstition(){
    this.forceUpdate();
  }

  onReady(){
    this.setButtonStates(
      'Start Search', () => this.startSearch(), true,
      'Pause Search', () => this.pauseSearch(), false,
      'Clear Walls', () => this.clearWalls(), true);
  }

  onVisualizing(){
    this.setButtonStates(
      'Restart Search', () => this.restartSearch(), true,
      'Pause Search', () => this.pauseSearch(), true,
      'Clear Walls', () => this.clearWalls(), true);
    setTimeout(() => this.visualizeStep(), 100);
  }

  visualizeStep(){
    if(this.stateMachine.is('visualizing')){
      // if the list is not empty
      if(this.state.searchResults.length() !== 0){
        this.hexSetVisited(this.state.searchResults.dequeue());
              // now that the list is empty
        if(this.state.searchResults.length() === 0){
          // visualize path
          if(this.stateMachine.can('finish')){
            this.stateMachine.finish();
          }
        }
        setTimeout(() => this.visualizeStep(), 100);
      }
    }
  }

  onPaused(){
    this.setButtonStates(
      'Cancel Search', () => this.cancelSearch(), true,
      'Resume Search', () => this.resumeSearch(), true,
      'Clear Walls', () => this.clearWalls(), true);
  }

  onFinished(){
    this.setButtonStates(
      'Restart Search', () => this.restartSearch(), true,
      'Clear Path', () => this.cancelSearch(), true,
      'Clear Walls', () => this.clearWalls(), true);
  }

  
  onStart(){
    console.log('pathfinding');
    this.state.searchResults.clear();
    //TODO: Pathfind stuffs
    for( let r = 0; r < 10; r++){
      this.state.searchResults.enqueue([0, r, -r]);
    }
  }

  onRestart(){
    console.log('restarting');
    for(let hex of this.state.hexMap.values()){
      hex.visited = false;
    }
    this.onStart();
  }

  onClear(){
    console.log('clearing');
    for(let hex of this.state.hexMap.values()){
      hex.state = 0;
      hex.visited = false;
    }
  }

  onCancel(){
    console.log('canceled');
    for(let hex of this.state.hexMap.values()){
      hex.visited = false;
    }
  }


  /// --==== Button Methods ====--


  setButtonStates(
    button1Text, button1Callback, button1Enabled, 
    button2Text, button2Callback, button2Enabled, 
    button3Text, button3Callback, button3Enabled
    ){
    this.setState({
      button1Text: button1Text,
      button2Text: button2Text,
      button3Text: button3Text,
      button1Enabled: button1Enabled,
      button2Enabled: button2Enabled,
      button3Enabled: button3Enabled,
      button1Callback: button1Callback,
      button2Callback: button2Callback,
      button3Callback: button3Callback
    });
  }

  startSearch(){
    if(this.stateMachine.can('start')){
      this.stateMachine.start();
    }
  }

  pauseSearch(){
    if(this.stateMachine.can('pause')){
      this.stateMachine.pause();
    }
  }

  resumeSearch(){
    if(this.stateMachine.can('resume')){
      this.stateMachine.resume();
    }
  }

  restartSearch(){
    if(this.stateMachine.can('restart')){
      this.stateMachine.restart();
    }
  }

  cancelSearch(){
    if(this.stateMachine.can('cancel')){
      this.stateMachine.cancel();
    }
  }

  clearWalls(){
    if(this.stateMachine.can('clear')){
      this.stateMachine.clear();
    }
  }


  /// --==== Hex Field Interaction ====--


  hexFieldMouseMove(event){
    event.target.classList.add("hex-wall");
    //this.hexSet(event.target.id, 1);
    /*
    const x = event.pageX - this.state.mapPosX; 
    const y = event.pageY - this.state.mapPosY;
    var hexCoords = Hex.worldToHex(x, y, this.state.hexSize);
    if(this.stateMachine.is('draggingStart')){
      this.setState({ startNode: hexCoords, })
    }
    else if(this.stateMachine.is('draggingEnd')){
      this.setState({ endNode: hexCoords, })
    }
    else if(this.stateMachine.is('drawingWalls')){
      this.hexSet(hexCoords, 1);
    }
    else if(this.stateMachine.is('erasingWalls')){
      this.hexSet(hexCoords, 0);
    }
    */
  }

  hexFieldMouseDown(event){
    console.log(event);
    /*
    const x = event.pageX - this.state.mapPosX; 
    const y = event.pageY - this.state.mapPosY;
    const hex = this.state.hexMap.get(Hex.worldToHex(x, y, this.state.hexSize).toString());
    console.log([x, y]);
    console.log(hex);
    if(hex){
      if(hex){
        if(this.stateMachine.can('dragStart') && hex.equals(this.state.startNode)){
          this.stateMachine.dragStart();
        }
        else if(this.stateMachine.can('dragEnd') && hex.equals(this.state.endNode)){
          this.stateMachine.dragEnd();
        }
        else if(this.stateMachine.can('drawWall') && hex.state === 0){
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
    */
  }

  hexFieldMouseUp(){
    if(this.stateMachine.can('finishDraw')){
      this.stateMachine.finishDraw();
    }
  }

  hexSet(coords, state){
    const hex = this.state.hexMap.get(coords.toString());
    if(hex){
      hex.state = state;
    }
    this.forceUpdate();
  }

  hexSetVisited(coords, visited = true){
    const hex = this.state.hexMap.get(coords.toString());
    if(hex){
      hex.visited = visited;
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
        <SidePanel
          state={this.stateMachine.state}
        >
        </SidePanel>
        <HexField
          hexes={this.state.hexMap}
          startNode={this.state.startNode}
          endNode={this.state.endNode}
          onMouseDown={(e) => this.hexFieldMouseDown(e)}
          onMouseMove={(e) => this.hexFieldMouseMove(e)}
          onMouseUp={(e) => this.hexFieldMouseUp(e)}
          onMount={(e) => this.hexFieldDidMount(e)}
        />
      </div>
    );
    /*
    return(
      <div>
        <Sidebar />
        <Content />
                <Panel header={this.stateMachine.state}>
          <button 
            class="panel-button"
            onClick={() => this.state.button1Callback()}
            disabled={!this.state.button1Enabled}
          >
            {this.state.button1Text}
          </button>
          <button 
            class="panel-button"
            onClick={() => this.state.button2Callback()}
            disabled={!this.state.button2Enabled}
          >
            {this.state.button2Text}
          </button>
          <button 
            class="panel-button"
            onClick={() => this.state.button3Callback()}
            disabled={!this.state.button3Enabled}
          >
            {this.state.button3Text}
          </button>
        </Panel>
      </ div>
    );
    */
  }
}

export default App;
