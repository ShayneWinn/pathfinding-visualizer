const Pathfinders = {
    ASTAR: {
        name: 'A Star'
    },
    DIJKSTRAS: {
        name: "Dijkstra's"
    }
}

const Events = {
    START_SEARCH:   0,  // start searching for path
    VIEW_NODE:      1,  // look at a node / see it as a neighbor
    VISIT_NODE:     2,  // calculate stuff for this node
    END_SEARCH:     3,  // found the path
    MOVE_ALONG:     4,  // take a step alonog the path
    END_MOVE:       5,  // finished moving along the path
}

function Event(type, coords, data=null) {
    this.type = type;
    this.coords = coords;
    this.data = data;
}

export default Pathfinders;
export default Events;
export default Event;
