class Queue{
    constructor(){
        this.array = [];
    }

    enqueue(e){
        this.array.push(e);
    }

    dequeue(){
        return this.array.shift();
    }

    isEmpty(){
        return this.array.length === 0;
    }

    peek(){
        return !this.isEmpty() ? this.array[0] : undefined;
    }

    length(){
        return this.array.length;
    }

    clear(){
        this.array = [];
    }
}


export default Queue;