import React, {Component} from 'react';
import PanelHeader from './PanelHeader';

class Panel extends Component {
    constructor(props){
        super(props);

        this.state = {
            x: 10,
            y: 10
        }
    }

    handleDrag(moveX, moveY){
        const x = this.state.x + moveX;
        const y = this.state.y + moveY;

        this.setState({
            x: x,
            y: y
        })
    }

    render() {
        return(
            <div className="panel" style={{left: this.state.x, top: this.state.y}}>
            <div className="panel__container">
              <PanelHeader onDrag={(moveX, moveY) => this.handleDrag(moveX, moveY)} />
      
              <div className="panel__content">
              </div>
            </div>
          </div>
        )
    }
}

export default Panel;