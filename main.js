var astar = (function(window){
    var rows = 3, cols = 3;
    var openSet = [], closedSet = [];

    function lp( _i, _j, fn ) {
        for(let i = 0; i < _i; i++) {
            for(let j = 0; j < _j; j++) {
                fn( i, j);
            }
        }
    }

    function isArraysEqual( a, b ) {
        res = true;
        if( 'undefined' === typeof a || 'undefined' === typeof b) {
            console.log('undefined', a, b);
            return false;
        }
        if( a.length !== b.length) res = false;
        lp(cols, rows, (i,j) => { if( a[i][j] !== b[i][j]) res = false;  })
        return res;
    }

    function findSpot( arr , el) {
        res = false;
        for( let i = 0; i < arr.length; i++) {
            let s = arr[i];
            if( isArraysEqual( s.state, el.state ) ) return i;
        }

        return res;
    }

    function removeFromArray( arr, el) {
        for( var i = arr.length -1; i >= 0 ; i--) {
            if(  isArraysEqual( arr[i].state, el.state )  ) {
                arr.splice(i, 1);
            }
        }
    }
 
    function Spot(state) {
        this.f = 0;
        this.g = 0;
        this.h = 0;
        this.state = state;
        this.neighbors = [];

        this.getNeighbors = function() {
            let x = this.getPos().x;
            let y = this.getPos().y;
            let state = this.state;
            if( x < rows - 1) {

                this.neighbors.push( new Spot( this.shift(x,y, state, 'right') ) );
            }
            if( x > 0) {
                this.neighbors.push( new Spot( this.shift(x,y, state, 'left') ) );
            }
            if( y > 0) {
                this.neighbors.push( new Spot( this.shift(x,y, state, 'up') ) );
            }
            if( y < cols - 1) {
                this.neighbors.push(  new Spot( this.shift(x,y, state, 'down') ) );
            }

            return this.neighbors;
        }

        this.shift = function(x,y, s, nextPos) {
            let state = new Array(cols);
            for(let i = 0; i< cols; i++) {
                state[i] = new Array(rows);
            }

            lp(cols,rows, (i,j) => { state[i][j] = s[i][j]; } );
            
            switch (nextPos) {
                case 'left': {
                    let temp = state[x-1][y];
                    state[x-1][y] = 'e';
                    state[x][y] = temp;
                    return state;
                    break;
                }
                case 'right': {
                    let temp = state[x+1][y];
                    state[x+1][y] = 'e';
                    state[x][y] = temp;
                    return state;
                    break;
                }
                case 'up': {
                    let temp = state[x][y-1];
                    state[x][y-1] = 'e';
                    state[x][y] = temp;
                    return state;
                    break;
                }
                case 'down': {
                    let temp = state[x][y+1];
                    state[x][y+1] = 'e';
                    state[x][y] = temp;
                    return state;
                    break;
                }
                default: break;
            }
        }

        this.getPos = function() {
            let pos = {};
            lp(cols, rows, (i,j) => { if( this.state[i][j] === 'e' ) pos = {x: i, y: j} } );
            return pos;
        }

        this.calculateCellDistance = function(i,j, arr) {
            // console.log(i,j, arr);
            if( 'undefined' !== typeof arr[i][j] ){
              if( !isNaN(arr[i][j]) ) {
                //calculating distance in a not really goo position
                let v = arr[i][j];
                // console.log('v',v);
                let endi = Math.floor( v / cols );
                let endj = v - ( endi * cols );
                let a = i - endi;
                let b = j - endj;
                let d = Math.abs(a) + Math.abs(b);

                return d;
              }  else {
                  return undefined;
              }
            } else {
              console.log( 'cell was undefined - 318' ); 
            }
            }
            
        this.calculateAllCellDistance = function() {
            let sum = 0; //might be a bug
            // console.log('calculating all distances');
            for( let i = 0; i < cols; i++)  {
                for( let j = 0; j < rows ; j++) {
                    let val = this.calculateCellDistance(i,j, this.state);
                    if( 'undefined' !== typeof val) sum += val;
                //  console.log('sum', sum);
                }
            }
            return sum;
        }

        this.getH = function() {
            return this.calculateAllCellDistance();
        }
        

    }



    function run() {
        var start = new Spot([['e',3,5],[5,7,8],[1,2,4]]);
        var end = new Spot([1,2,3],[4,5,6],[7,8,'e']);
        openSet.push(start);
        // console.log(start, isArraysEqual(start.state, end.state ) );
        var counter = 0;
        while( openSet.length > 0 && counter < 3 ) {
            counter++;
            console.log(counter, openSet.length, closedSet.length);
            var winner = 0;

            for( var i = 0; i < openSet.length; i++) {
                if( openSet[i].f < openSet[winner].f ) {
                    winner = i;
                }
            }

            var current = openSet[winner];

            if( isArraysEqual( openSet[winner].state, end.state ) ) {
                console.log( 'done' ) ;
                //find the path
                path = [];
                var temp = current;
                path.push(temp);
                while( temp.previous ) {
                    path.push(temp.previous);
                    temp = temp.previous;
                }
                return;
            }
            
            console.log(openSet.length, 'openset length')
            removeFromArray( openSet, current );
            console.log(openSet.length, 'openset');
            closedSet.push( current ); 

            var neighbors = current.getNeighbors();
            for(let i = 0; i < neighbors.length; i++) {
                neighbor = neighbors[i];
                // console.log(closedSet, neighbor, findSpot(closedSet, neighbor) );
                // if( !closedSet.includes(neighbor) ) {
                if( findSpot(closedSet, neighbor) === false ) {
                    var tempG = current.g + 1;

                    // if( openSet.includes(neighbor) ) {
                    if( findSpot( openSet, neighbor) !== false ) {
                        if( tempG < neighbor.g ) {
                            neighbor.g = tempG;
                        }
                    } else {
                        neighbor.g = tempG;
                        openSet.push(neighbor);
                    }

                    // neighbor.h = heuristic(neighbor, end);
                    neighbor.f = neighbor.g + neighbor.getH();
                    neighbor.previous = current;

                    // console.table(neighbor.previous.state);
                } 
            }
        }
    }

    return {
        run : run
    }
})(window);

astar.run();