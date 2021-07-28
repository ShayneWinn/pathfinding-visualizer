import React, {Component} from 'react';
import '../style/Panel.css'; // style sheet for the panel elements

class Panel extends Component {
    constructor(props){
        super(props);

        this.state = {
            x: 1000,
            y: 10
        }

        this.mouseDown = false;
    }

    onDrag(moveX, moveY) {
        const x = this.state.x + moveX;
        const y = this.state.y + moveY;

        this.setState({
            x: x,
            y: y
        })
    };

    handleMouseDrag = (e) => this.onDrag(e.movementX, e.movementY);

    handleMouseDown = () => {
        this.mouseDown = true;
        window.addEventListener('mouseup', this.handleMouseUp);
        window.addEventListener('mousemove', this.handleMouseDrag);
    };

    handleMouseUp = () => {
        this.mouseDown = false;
        window.removeEventListener('mouseup', this.handleMouseUp);
        window.removeEventListener('mousemove', this.handleMouseDrag);
    };

    render() {
        return(
            <div className="panel" 
                style={{left: this.state.x, top: this.state.y}}
                onMouseDown={(e) => this.handleMouseDown(e)}
            >
            <div className="panel-header">
                {this.props.header}
            </div>
            <div className="panel-content">
                {this.props.children}
            </div>
          </div>
        )
    }
}

/*
    <PanelHeader 
    onDrag={(moveX, moveY) => this.handleDrag(moveX, moveY)} 
    header={this.props.header}
    />
*/

export default Panel;