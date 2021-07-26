import { Component } from 'react';
import '../style/HexField.css'

class HexField extends Component {
    constructor(props){
        super(props)
        this.props = props;

        this.handleMouseMove = (e) => this.props.onMouseMove(e);
        this.handleMouseDown = (e) => this.props.onMouseDown(e);
        this.handleMouseUp   = (e) => this.props.onMouseUp(e);
    }

    render() {
        let coords = []
        let svgHexes = []

        for(let [key, hex] of this.props.hexes){
            const x = this.props.size * (Math.sqrt(3) * hex.q + Math.sqrt(3)/2 * hex.r) + this.props.viewOffset[0];
            const y = this.props.size * (3/2 * hex.r) + this.props.viewOffset[1];
            const w = Math.sqrt(3) * this.props.size;
            const h = 2 * this.props.size;
            coords.push([x, y]);
            let points = [
                [             x,    y +  (0.5  * h)],
                [-(0.5 * w) + x,    y +  (0.25 * h)],
                [-(0.5 * w) + x,    y + -(0.25 * h)],
                [             x,    y + -(0.5  * h)],
                [ (0.5 * w) + x,    y + -(0.25 * h)],
                [ (0.5 * w) + x,    y +  (0.25 * h)]
            ]

            let classes = "hex"
            classes += (hex.state === 0 ? " hex-air": " hex-wall")

            svgHexes.push(
                    <polygon
                        points={points}
                        class = {classes}
                    />
            );
        }

        return(
            <svg
                height={this.props.height}
                width = {this.props.width}
                style={{overflow:'hidden', top:'0px', left:'0px', position:'absolute'}}
                xmlns="http://www.w3.org/2000/svg"
                onMouseMove={this.handleMouseMove}
                onMouseDown={this.handleMouseDown}
                onMouseUp=  {this.handleMouseUp}
            >
                <polygon 
                    points={[0, 0, this.props.width, 0, this.props.width, this.props.height, 0, this.props.height]}
                    fill="rgba(0, 0, 0, 0)"
                    stroke="#000"
                    strokeOpacity="0.2"
                />
                {svgHexes}
            </svg>
        );
    }
}


export default HexField;