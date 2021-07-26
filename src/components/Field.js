import React, {Component} from "react";
import '../style/Field.css'; // style sheet for the Field and Cells

/**
 * Field is the Component that handles drawing the cells and path
 */
class Field extends Component {
    /// Constructor
    constructor(props){
        super(props);

        this.cellSize = 30;
        this.drawing = false;

        this.state = {
            height: 0,
            width: 0,
            nCellsHigh: 0,
            nCellsWide: 0,
            cells: []
        }
    }

    /// Called after the component is inserted into the tree
    componentDidMount() {
        const cellSize = this.cellSize;
        const height = this.divElement.clientHeight;
        const width = this.divElement.clientWidth;
        const nCellsHigh = Math.ceil(height / cellSize);
        const nCellsWide = Math.ceil(width / cellSize);
        const cells = this.state.cells.slice();

        for(let j = 0; j < nCellsHigh; j++){
            for(let i = 0; i < nCellsWide; i++){
                cells.push({
                    x: i,
                    y: j,
                    state: 0
                })
            }
        }

        this.setState({
            height: height,
            width: width,
            nCellsHigh: nCellsHigh,
            nCellsWide: nCellsWide,
            cells: cells
        })
    }

    /// Called by the <svg /> component when the mouse is pressed
    handleMouseDown(event){
        const coords = this.toGridCoords(event.pageX, event.pageY);
        //console.log("mouseDown (" + coords[0] + ", " + coords[1] + ")-feild");
        this.drawing=true;
    }

    /// Called by the <svg /> component when the mouse is released
    handleMouseUp(event){
        const coords = this.toGridCoords(event.pageX, event.pageY);
        //console.log("MouseUp-feild");
        this.drawing=false;
    }

    /// Called by the <svg /> component when the mouse is moved
    handleMouseMove(event){
        if(!this.drawing){
            return;
        }
        const coord = this.toGridCoords(event.pageX, event.pageY);
        //console.log("MouseMove (" + coord[0] + ", " + coord[1] + ")-feild");
        const cells = this.state.cells.slice();

        cells[(coord[1] * this.state.nCellsWide) + coord[0]].state = 1;

        this.setState({
            height: this.state.height,
            width: this.state.width,
            nCellsHigh: this.state.nCellsHigh,
            nCellsWide: this.state.nCellsWide,
            cells: cells
        })
    }

    /// Converts screen coords to grid coords, 
    ///     only works if element is in upper left corner
    toGridCoords(x, y){
        const rect = this.divElement.getBoundingClientRect();
        //console.log(rect);
        return([
            Math.floor((x - rect.x)/this.cellSize), 
            Math.floor((y + rect.y)/this.cellSize)
        ]);
        
    }

    /// Called to render all cells
    renderCells(){
        var cells = []
        for(let i = 0; i < this.state.cells.length; i++){
            let classes = 'cell'
            switch(this.state.cells[i].state){
                case 0:
                    classes += ' cell-air';
                    break;
                case 1:
                    classes += ' cell-wall';
                    break;
                default:
                    break;
            }

            cells.push(
                <rect 
                    x={this.state.cells[i].x*this.cellSize + (0 * this.cellSize)}
                    y={this.state.cells[i].y*this.cellSize + (0 * this.cellSize)}
                    r={this.cellSize * 0.25 * 0}
                    width={this.cellSize} height={this.cellSize}
                    class={classes}
                />
            )
        }
        return cells;
    }
    
    /// Called to render the component
    render(){
        return (
            <div 
                class="field-div" ref={(divElement) => this.divElement = divElement}
            >
                <svg 
                    height={this.state.height} 
                    width={this.state.width} 
                    style={{overflow:'hidden', top:'0px', left:'0px', position:'absolute'}}
                    xmlns="http://www.w3.org/2000/svg"
                    onMouseMove={(event) => this.handleMouseMove(event)}
                    onMouseDown={(event) => this.handleMouseDown(event)}
                    onMouseUp={(event) => this.handleMouseUp(event)}
                >
                    {this.renderCells()}
                </svg>
            </div>
        )
    }
}

export default Field