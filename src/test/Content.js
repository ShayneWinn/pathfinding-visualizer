import React, {Component} from "react";
import './Content.css';

class Content extends Component {
    constructor(props) {
        super(props);

        this.state={
            posX:0,
            posY:0,
            width:0,
            height:0,
            x:0,
            y:0,
        }
    }

    componentDidMount(){
        const rect = this.el.getBoundingClientRect();
        console.log(rect);
        this.setState({
            posX: rect.left,
            posY: rect.top,
            width: rect.right - rect.left,
            height: rect.height,
        });
    }

    handleMove(event){
        this.setState({
            x: event.pageX,
            y: event.pageY,
        })
    }

    render() {
        return(
            <div 
                ref={(el) => this.el=el}
                className="content"
                onMouseMove={(e) => this.handleMove(e)}
            >
                Width: {this.state.width}
                Height: {this.state.height}
                Pos: ({this.state.posX}, {this.state.posY})
                Mouse: ({this.state.x - this.state.posX}, {this.state.y - this.state.posY})
            </ div>
        );
    }
}

export default Content;
