import { Component } from 'react';
import '../style/HexField.css'

class HexField extends Component {
    constructor(props){
        super(props)

        this.state = ({
            width:  0,
            height: 0,
        });

        this.handleMouseMove = (e) => this.props.onMouseMove(e);
        this.handleMouseDown = (e) => this.props.onMouseDown(e);
        this.handleMouseUp   = (e) => this.props.onMouseUp(e);
    }

    componentDidMount(){
        const rect = this.el.getBoundingClientRect();
        this.setState(this.props.onMount({
            posX: rect.left,
            posY: rect.top,
            width: rect.right - rect.left,
            height: rect.height,
        }));
    }

    render() {
        let coords = []
        let svgHexes = []

        for(let [key, hex] of this.props.hexes){
            const x = this.state.size * (Math.sqrt(3) * hex.q + Math.sqrt(3)/2 * hex.r);
            const y = this.state.size * (3/2 * hex.r);
            const w = Math.sqrt(3) * this.state.size;
            const h = 2 * this.state.size;
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
            if(hex.visited){
                classes = "hex hex-visited";
            }
            if(key === this.props.startNode.toString()){
                classes = "hex hex-start";
            }
            if(key === this.props.endNode.toString()){
                classes = "hex hex-end";
            }

            svgHexes.push(
                    <polygon
                        style={{transformOrigin:`${x}px ${y}px`}}
                        points={points}
                        class={classes}
                    />
            );
        }

        return(
            <div ref={(el) => this.el=el} className="hex-field">
                <svg
                    height={this.state.height}
                    width = {this.state.width}
                    xmlns="http://www.w3.org/2000/svg"
                    onMouseMove={this.handleMouseMove}
                    onMouseDown={this.handleMouseDown}
                    onMouseUp=  {this.handleMouseUp}
                >
                    <polygon 
                        points={[0, 0, this.state.width, 0, this.state.width, this.state.height, 0, this.state.height]}
                        fill="rgba(0, 0, 0, 0)"
                        stroke="#000"
                        strokeOpacity="0.2"
                    />
                    {svgHexes}
                </svg>
            </div>
        );
    }
}


export default HexField;