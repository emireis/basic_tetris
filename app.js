//add this to make sure content in HTML script tag loads JS 
document.addEventListener('DOMContentLoaded', () => {
    //all code goes here
    const grid = document.querySelector('.grid');
    let squares = Array.from(document.querySelectorAll('.grid div'));
    const scoreDisplay = document.querySelector('#score');
    const startBtn = document.querySelector('#start-button');
    const width = 10;
    let nextRandom = 0;
    let timerId
    let score = 0;
    const colors = [
        '#fb9233',
        '#fd5d68',
        '#ffea55',
        '#8eff6c',
        '#4db3ff'
    ]

    //The Tetrominoes
    const lTetromino = [
        [1, 2, width+1, width*2+1], //rotation 1
        [width, width+1, width+2, width*2+2], //rotation 2
        [1, width+1, width*2, width*2+1], //rotation 3
        [width, width*2, width*2+1, width*2+2] //rotation 4
    ];

    const zTetromino = [
        [0, 1, width+1, width+2], //rotation 1
        [2, width+1, width+2, width*2+1], //rotation 2
        [1, 2, width, width+1], //rotation 3
        [0, width, width+1, width*2+1] //rotation 4
    ];

    const tTetromino = [
        [1, width, width+1, width+2], //rotation 1
        [1, width+1, width+2, width*2+1], //rotation 2
        [width, width+1, width+2, width*2+1], //rotation 3
        [1, width, width+1, width*2+1] //rotation 4
    ];

    const oTetromino = [
        [0, 1, width, width+1], //rotation 1
        [0, 1, width, width+1], //rotation 2
        [0, 1, width, width+1], //rotation 3
        [0, 1, width, width+1] //rotation 4
    ];

    const iTetromino = [
        [1, width+1, width*2+1, width*3+1], //rotation 1
        [width, width+1, width+2, width+3], //rotation 2
        [1, width+1, width*2+1, width*3+1], //rotation 3
        [width, width+1, width+2, width+3], //rotation 4
    ];

    const theTetrominoes = [lTetromino, zTetromino, tTetromino, oTetromino, iTetromino];

    let currentPosition = 0;
    let currentRotation = 0;

    //randomly select one of the tetrominoes
    let random = Math.floor(Math.random()*theTetrominoes.length);
    let current = theTetrominoes[random][currentRotation];

    //draw the tetromino
    function draw () {
        current.forEach(index => {
            squares[currentPosition + index].classList.add('tetromino');
            squares[currentPosition + index].style.backgroundColor = colors[random];
        })
    }

    // undraw the tetromino
    function undraw() {
        current.forEach(index => {
            squares[currentPosition + index].classList.remove('tetromino');
            squares[currentPosition + index].style.backgroundColor = '';
        })
    }

    //make the tetromino move down every second
    // timerId = setInterval(moveDown, 750);
    //remove this code here because we only want the tetromino to move down
    //when we click the start button

    //assign functions to keyCodes
    function control (e) {
        if (e.keyCode === 37) {
            moveLeft();
        } else if (e.keyCode === 38) {
            rotate();
        } else if (e.keyCode === 39) {
            moveRight();
        } else if (e.keyCode === 40) {
            moveDown();
        }
    }
document.addEventListener('keyup', control);

    //move down function
    function moveDown() {
        undraw();
        currentPosition += width;
        draw();
        freeze();
    }

    function freeze() {
        if(current.some(index => squares[currentPosition + index + width].classList.contains('taken'))) {
            current.forEach(index => squares[currentPosition + index].classList.add('taken'));
            //start a new tetrimino falling
            random = nextRandom;
            nextRandom = Math.floor(Math.random() * theTetrominoes.length);
            current = theTetrominoes[random][currentRotation];
            currentPosition = 4
            draw();
            displayShape();
            addScore();
            gameOver();
        }
    }    

    //move the tetromino left, unless is at the edge or there is a blockage
    function moveLeft() {
        undraw();
        const isAtLeftEdge = current.some(index => (currentPosition + index) % width ===0);

        if(!isAtLeftEdge) currentPosition -=1;

        if(current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
            currentPosition += 1;
        }

        draw();
    }

    function moveRight() {
        undraw()
        const isAtRightEdge = current.some(index => (currentPosition + index) % width === width -1);

        if(!isAtRightEdge) currentPosition +=1;

        if(current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
            currentPosition -=1;
        }

        draw();
    }

    //rotate the tetromino
    function rotate() {
        undraw();
        currentRotation ++;
        //if it's at the 4th rotation [3], make it go back to 0
        if(currentRotation === current.length) { 
            currentRotation = 0;
        }
        current = theTetrominoes[random][currentRotation];
        draw();
    }

    //show up-next tetromino in mini-grid display
    const displaySquares = document.querySelectorAll('.mini-grid div');
    const displayWidth = 4;
    const displayIndex = 0;

    const upNextTetrominoes = [
        [1, 2, displayWidth+1, displayWidth*2+1], //lTetromino
        [0, 1, displayWidth+1, displayWidth+2], //zTetromino
        [1, displayWidth, displayWidth+1, displayWidth+2], //tTetromino
        [0, 1, displayWidth, displayWidth+1], //oTetromino
        [1, displayWidth+1, displayWidth*2+1, displayWidth*3+1] //iTetromino
    ]

    //display the shape in the mini grid
    function displayShape() {
        //remove any trave of a tetromino from the entire grid
        displaySquares.forEach(square => {
            square.classList.remove('tetromino');
            square.style.backgroundColor = '';
        })
        upNextTetrominoes[nextRandom].forEach( index => {
            displaySquares[displayIndex + index].classList.add('tetromino');
            displaySquares[displayIndex + index].style.backgroundColor = colors[nextRandom];
        })
    }
        

    //add functionality to the start/pause button
    startBtn.addEventListener('click', () => {
        //pause the game by passing timerId through clearInterval 
        //and set timerId to null
        if (timerId) {
            clearInterval(timerId);
            timerId = null;
        } else {
            draw();
            timerId = setInterval(moveDown, 700);
            nextRandom = Math.floor(Math.random()*theTetrominoes.length);
            displayShape();
        }
    })

    //add score
    function addScore() {
        for (let i = 0; i < 199; i +=width) {
            //i + every square that makes up a row
            const row = [i, i+1, i+2, i+3, i+4, i+5, i+6, i+7, i+8, i+9];

            //check to see if every square in our row contains class 'taken'
            if(row.every(index => squares[index].classList.contains('taken'))) {
                //add 10 to the score
                score +=10;
                scoreDisplay.innerHTML = score;
                //remove the class of taken
                row.forEach(index => {
                    squares[index].classList.remove('taken');
                    squares[index].classList.remove('tetromino');
                    squares[index].style.backgroundColor = '';
                })
                const squaresRemoved = squares.splice(i, width);
                squares = squaresRemoved.concat(squares);
                squares.forEach(cell => grid.appendChild(cell));
            }
        }
    }

    // game over
    function gameOver() {
        if(current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
            scoreDisplay.innerHTML = 'Game Over!';
            clearInterval(timerId);
        }
    }






});