export class Ship{
    constructor(length, hitsTaken = 0){
        if(length <= 0) throw new Error('Ship size cannot be less than or equal to 0');
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