/**
 * This was written with the help of:
 * https://www.redblobgames.com/grids/hexagons/
 */
export class Hex {
    q = NaN;
    r = NaN;
    s = NaN;
    state = null;
    visited = false;

    constructor(_q, _r, _s) {
        console.assert(_q + _r + _s === 0);
        this.q = _q;
        this.r = _r;
        this.s = _s;
        this.state = 0;
    }

    equals(other){
        return (this.q === other.q && this.r === other.r && this.s === other.s);
    }
}

export function hexAdd(a, b) {
    return Hex(a.q + b.q, a.r + b.r, a.s + b.s);
}

export function hexSubtract(a, b) {
    return Hex(a.q - b.q, a.r - b.r, a.s - b.s);
}

export function hexMultiply(a, k) {
    return Hex(a.q * k, a.r * k, a.s * k);
}

export function hexLength(hex){
    return Math.floor((Math.abs(hex.q) + Math.abs(hex.q) + Math.abs(hex.q)) / 2);
}

export function hexDistance(a, b){
    return hexLength(hexSubtract(a, b));
}

export function hexRound(q, r, s){
    var rq = Math.round(q);
    var rr = Math.round(r);
    var rs = Math.round(s);

    var dq = Math.abs(rq - q);
    var dr = Math.abs(rr - r);
    var ds = Math.abs(rs - s);

    if(dq > dr && dq > ds){
        rq = -rr-rs
    }
    else if (dr > ds){
        rr = -rq-rs
    }
    else {
        rs = -rq-rr
    }

    return[rq, rr, rs];
}

export function worldToHex(x, y, size){
    var q = (Math.sqrt(3)/3 * x - 1/3 * y) / size;
    var r = (2/3 * y) / size;
    var s = (-q-r);
    return (hexRound(q, r, s));
}