import React, {Component} from "react";

class Field extends Component {
    constructor(props){
        super(props);

        this.cellSize = 30;
        this.srawing = false;

        this.state = {
            height: 0,
            width: 0,
            nCellsHigh: 0,
            nCellsWide: 0,
            cells: []
        }
    }

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

    handleMouseDown(event){
        const coords = this.toGridCoords(event.pageX, event.pageY);
        console.log("mouseDown (" + coords[0] + ", " + coords[1] + ")");
        this.drawing=true;
    }

    handleMouseUp(event){
        const coords = this.toGridCoords(event.pageX, event.pageY);
        console.log("MouseUp");
        this.drawing=false;
    }

    handleMouseMove(event){
        if(!this.drawing){
            return;
        }
        const coord = this.toGridCoords(event.pageX, event.pageY);
        //console.lg("MouseMove (" + coords[0] + ", " + coords[1] + ")");
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

    toGridCoords(x, y){
        return [Math.floor(x/this.cellSize), Math.floor(y/this.cellSize)];
    }

    renderCells(){
        var cells = []
        for(let i = 0; i < this.state.cells.length; i++){
            cells.push(
                <rect 
                    x={this.state.cells[i].x*this.cellSize}
                    y={this.state.cells[i].y*this.cellSize}
                    width="30" height="30" 
                    r="0" rx="0" ry="0" 
                    style={{
                        fill:(this.state.cells[i].state === 0 ? "white" : "gray"), 
                        stroke:"#000", 
                        strokeOpacity:"0.2",
                    }}
                />
            )
        }
        return cells;
    }
    
    render(){
        return (
            <div 
                class="field-div" ref={(divElement) => this.divElement = divElement}
            >
                <svg 
                    height={this.state.height} 
                    width={this.state.width} 
                    style={{overflow:'hidden', position:"relative"}}
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