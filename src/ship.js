export class Ship{
    constructor(length, hitsTaken = 0){
        this.length = length;
        this.hitsTaken = hitsTaken;
    }

    hit(){
        this.hitsTaken++;
    }

    isSunk(){
        return this.hitsTaken >= this.length;
    }
}