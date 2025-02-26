// representing diff shapes
const SHAPES=[
    [
        [0,1,0,0,],
        [0,1,0,0,],
        [0,1,0,0,],
        [0,1,0,0,]
    ],
    [
        [0,1,0],
        [0,1,0],
        [1,1,0],
    ],
    [
        [0,1,0],
        [0,1,0],
        [0,1,1],
    ],
    [
        [1,1,0],
        [0,1,1],
        [0,0,0],
    ],
    [
        [0,1,1],
        [1,1,0],
        [0,0,0],
    ],
    [
        [1,1,1],
        [0,1,0],
        [0,0,0],
    ],
    [
        [1,1],
        [1,1],
    ],
]

// giving colors to each shape
const COLOR=[
    "#fff",
    "#8A2BE2",
    "#D2691E",
    "#DC143C",
    "#8B008B",
    "#B22222",
    "#4B0082",
    "#FFB6C1",
]

// how many rows and cols for the block
const ROWS=20;
const COLS=10;
let score=0;
let canvas=document.querySelector("#tetris");
let scoreboard=document.querySelector("h2");

// ctx is a pen in a drawing board
let ctx=canvas.getContext("2d");
ctx.scale(30,30);
let pieceobj=null;
let grid=generateGrid();

// give a random shape 
function generaterandomnumber(){
    let ran=Math.floor(Math.random()*7);
    console.log(SHAPES[ran]);
    let piece=SHAPES[ran];
    // for selection of color
    let colorIndex=ran+1;
    // cooridnates to keep piece at center
    let x=4;
    let y=0;
    return {piece,x,y,colorIndex};
}

setInterval(newgamestate,200);
function newgamestate(){
    checkgrid();
    if(pieceobj==null){
        pieceobj=generaterandomnumber();
        // rendergrid();
        renderpiece();
    }
    moveDown();
}
renderpiece();

// to display piece
function renderpiece(){
    if(pieceobj!=null){
        let piece=pieceobj.piece;
        for(let i=0;i<piece.length;i++){
            for(let j=0;j<piece[i].length;j++){
                if(piece[i][j]==1){
                    ctx.fillStyle=COLOR[pieceobj.colorIndex];
                    ctx.fillRect(pieceobj.x+j,pieceobj.y+i,1,1);
                }
            }
        }
    }
}

// for movement
function moveDown(){
    if(!collision(pieceobj.x,pieceobj.y+1)){
        pieceobj.y+=1;
    }
    else{
        if(pieceobj!=null){
        // when the block is at the bottom it should be sticked to the grid
        for(let i=0;i<pieceobj.piece.length;i++){
            for(let j=0;j<pieceobj.piece[i].length;j++){
                if(pieceobj.piece[i][j]==1){
                    let p=pieceobj.x+j;
                    let q=pieceobj.y+i;
                    grid[q][p]=pieceobj.colorIndex;
                }
            }
        }
        if(pieceobj.y==0){
            alert("Game over");
            grid=generateGrid();
            score=0;
        }
        pieceobj=null;
    }
    }
    rendergrid();
}

// to rotate the block
function rotate(){
    let rotatedpiece=[];
    let piece=pieceobj.piece;
    // creating an empty array
    for(let i=0;i<piece.length;i++){
        rotatedpiece.push([]);
        for(let j=0;j<piece.length;j++){
            rotatedpiece[i].push(0);
        }
    }
    // for transpose of a matrix
    for(let i=0;i<piece.length;i++){
        for(let j=0;j<piece[i].length;j++){
            rotatedpiece[i][j]=piece[j][i];
        }
    }
    // for reversing the matrix
    for(let i=0;i<rotatedpiece.length;i++){
        rotatedpiece[i]=rotatedpiece[i].reverse();
    }
    if(!collision(pieceobj.x,pieceobj.y,rotatedpiece)){
        pieceobj.piece=rotatedpiece;
    }
    rendergrid();
}

function moveLeft(){
    if(!collision(pieceobj.x-1,pieceobj.y)){
        pieceobj.x-=1;
    }
    rendergrid();
}
function moveRight(){
    if(!collision(pieceobj.x+1,pieceobj.y)){
        pieceobj.x+=1;
    }
    rendergrid();
}
function collision(x,y){
    let piece=pieceobj.piece;
    for(let i=0;i<piece.length;i++){
        for(let j=0;j<piece[i].length;j++){
            if(piece[i][j]==1){
                // for crossing the boundaries
                let p=x+j;
                let q=y+i;
                // no problem
                if(p>=0 && p<COLS && q>=0 && q<ROWS){
                    if(grid[q][p]>0){
                        return true;
                    }
                }
                // the block is crossed the grid
                else{
                    return true;
                }
            }
        }
    }
    return false;
}
function generateGrid(){
    let grid=[];
    for(let i=0;i<ROWS;i++){
        grid.push([]);
        for(let j=0;j<COLS;j++){
            grid[i].push(0);
        }
    }
    return grid;
}
function rendergrid(){
    for(let i=0;i<grid.length;i++){
        for(let j=0;j<grid[i].length;j++){
            // to color previous block as white
            ctx.fillStyle=COLOR[grid[i][j]];
            ctx.fillRect(j,i,1,1)
        }
    }
    // making the present block as white and calling another block
    renderpiece();
}

function checkgrid(){
    let c=0;
    for(let i=0;i<grid.length;i++){
        let allfitted=true;
        for(let j=0;j<grid[i].length;j++){
            if(grid[i][j]==0){
                allfitted=false;
            }
        }
        if(allfitted){
            // to create a white row at bottom
            grid.splice(i,1);
            grid.unshift([0,0,0,0,0,0,0,0,0,0]);
            c++;
        }
    }
    // to update score
    if(c==1){
        score+=10;
    }
    else if(c==2){
        score+=30;
    }
    else if(c==3){
        score+=50;
    }
    else if(c>3){
        score+=100;
    }
    scoreboard.innerHTML="Score: "+score;
}

// for movement according to the keyboard keys
document.addEventListener("keydown", function (e) {
    console.log("Key pressed:", e);
    let key=e.code;
    if(key=='ArrowDown'){
        moveDown();
    }
    else if(key=='ArrowLeft'){
        moveLeft();
    }
    else if(key=='ArrowRight'){
        moveRight();
    }
    else if(key=='ArrowUp'){
        rotate();
    }
})

