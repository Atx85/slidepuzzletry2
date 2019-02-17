const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d")
canvas.width = 300;
canvas.height = 300;
const height = canvas.height;
const width = canvas.width;
const w = 100;

let table;
let cells2;
let search;
let steps;

class Cell {
    constructor(x,y, value) {
      this.x = x;
      this.y = y;
      this.v = value;
      this.d = 0;
      this.vel = 0.005;
    }
    
    moveTo(x,y) {
    let xpicked = false;
    let ypicked = false;
    // console.log('next:',x,y,'before',this.x,this.y);

    let roundedX = Math.floor(this.x * 100) / 100  ;
    let roundedY = Math.floor(this.y * 100) / 100  ;

    if( roundedX === x && roundedY === y) {
        this.x = roundedX;
        this.y = roundedY;
        return true;
    } 
    
    if( !isNaN(x) && !isNaN(this.x) && this.x < x && this.x !== x && !xpicked  ){
        this.x += this.vel;
        // console.log('moving right','tox:',x,'toy:',y, 'fromx',this.x,'fromy', this.y);
        // console.log('moving right', this.x< x, this,x, x );
        xpicked = true;

        // console.log('xpicked');
    }
    if( this.x === x ) xpicked = true;
    if( !isNaN(x) && !isNaN(this.x) &&  this.x > x && this.x !== x  && !xpicked ) { 
        // console.log('moving left', this.x> x, this,x, x );
        this.x -= this.vel;
        xpicked = true;
        // console.log('xpicked from decreasing')
    }
    // console.log('reached y', this.y < y, this.y, y);
    if( !isNaN(y) && !isNaN(this.y) &&  this.y < y && this.y !== y  && !ypicked ) { 
        // console.log('moving down', this.y < y, this.y, y);
        this.y += this.vel;
        ypicked = true;
    }
    if( this.y === y ) ypicked = true;
      if( !isNaN(y) && !isNaN(this.y) &&  this.y > y && this.y !== y  && !ypicked ) {
        //   console.log('moving up', this.y > y, this.y, y);
            this.y -= this.vel;
          ypicked = true;
       } 
    //   console.log(x, this.x ,  this.x === x);
      if( this.x === x && this.y === y ){
          console.log('done');
          return true;
      }
    }
    
    show() {
        if( this.v !== 'e') {
            ctx.beginPath();
            ctx.strokeRect(this.x * 100,this.y * 100, w,w);
            ctx.font = "20px Georgia";
            let text = this.v+"";
            ctx.fillText(text,this.x * 50 + (this.x + 1) * 50, this.y * 50 + (this.y + 1) * 50);
            ctx.closePath();
        }
    }
  }

class TableGraph {
    constructor( state ) {
        this.state = state;
        this.stepFinished = true;
        this.nextStep = null;
        this.cells = new Array(3);
        for(let i = 0; i < 3 ; i++) {
            this.cells[i] = new Array(3);
            for(let j = 0; j < 3; j++) {
                this.cells[i][j] = new Cell(j,i, state[i][j] );
            }
        }
    }

    show() {
        this.cells.forEach(row => row.forEach(el => el.show()) );
    }

    followPath( steps ) {
        if( this.stepFinished !== false ) this.nextStep = steps.pop();
        // console.log(this.x, this.y, );
        if( this.stepFinished)console.log('step finished',this.stepFinished,'next x,y:',this.nextStep.x, this.nextStep.y, this.nextStep);
        this.moveTo(this.nextStep);
    }

    findE() {
        this.cells.forEach( row => row.forEach( el => { if(el.v === 'e') { this.x = el.x; this.y = el.y; } } ));
    }

    moveTo( state ) {
        this.cells.forEach( row => row.forEach( el => { if(el.v === 'e') { this.x = el.x; this.y = el.y; } } ));
        // if(this.stepFinished) console.log('moving to',this.x, this.y);
        let next = new TableGraph(state);
        next.findE();
        next.cells.forEach( row => row.forEach( el => { if(el.v === 'e') { next.x = el.x; next.y = el.y; } } ));
        if(this.stepFinished) console.log(this.x, this.y, next.x, next.y);
        
        let res =  this.cells[next.y][next.x].moveTo(this.x, this.y);
        // console.log( res );
        if( res ){
            // console.log(this.state, next.state); 
            this.x = next.x;
            this.y = next.y;
            for(let i = 0; i <3;i++) {
                for(let j = 0; j < 3; j++) {

                    this.cells[i][j] = next.cells[i][j];
                    this.state[i][j] = next.state[i][j];
                    
                }
            }
            // console.log(this);
            this.stepFinished = true; 
        }
        else this.stepFinished = false;
    }
}

// function setup() {
//     let state = [[0,1,2],[3,4,5],[6,7,'e']];
//     let mid = [[0,1,2],[3,'e',5],[6,4,7]];
//     steps = [
//         [[0,1,2],[3,'e',5],[6,4,7]],
//         [[0,'e',2],[3,1,5],[6,4,7]],
//         [['e',0,2],[3,1,5],[6,4,7]],
//         [[0,'e',2],[3,1,5],[6,4,7]],
//         [[0,1,2],[3,'e',5],[6,4,7]],
//         [[0,1,2],[3,4,5],[6,'e',7]]
//     ];
//     table = new TableGraph(mid);
// }

// function draw() {
  
//   ctx.clearRect(0,0,width, height);
//   table.show();
//   table.followPath(steps);
//   window.requestAnimationFrame(draw);
// }

// setup();
// draw();