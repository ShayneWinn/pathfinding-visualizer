import { Component } from 'react';
import "../style/SidePanel.css"
import backStop from "../images/backwardstop.png"
import forwardStop from "../images/forwardstop.png"
import pause from "../images/pause.png"

class SidePanel extends Component {
    constructor(props){
        super(props);
    }

    render() {
        return (
            <div className="nav">
                <div>{this.props.state}</div>
                <div className="nav-play-container">
                    <button
                        onClick={() => (console.log("Button1"))}
                    >
                        <img src={backStop}/>
                    </button>
                    <button
                        onClick={() => (console.log("Button2"))}
                    >
                        <img src={pause}/>
                    </button>
                    <button
                        onClick={() => (console.log("Button3"))}
                    >
                        <img src={forwardStop}/>
                    </button>
                </div>
                <ul className="nav-scroll-container">

                </ul>
            </div>
        );
    }
}

export default SidePanel;