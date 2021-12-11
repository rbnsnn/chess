'use strict';
const resetBoard = () => {
    game.turn = 'w';
    Chessboard('board', game.config = {
        ...game.config,
        position: '3qk3/8/pppppppp/8/8/PPPPPPPP/8/3QK3'
    });
}

const pVsQ = () => {
    game.turn = 'w';
    Chessboard('board', game.config = {
        ...game.config,
        position: 'qqqqkqqq/qqqqqqqq/8/8/8/8/PPPPPPPP/4K3'
    });
}

//checking if any pawn position is in range from a8-h8 for white and a1-a8 for black
const checkPromotion = newPos => {
    const promotionArray = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']

    for (let i = 0; i < 8; i++) {
        const check = promotionArray[i] + 8
        const checkB = promotionArray[i] + 1
        if (newPos.hasOwnProperty(check) || newPos.hasOwnProperty(checkB)) {
            if (newPos[check] === 'wP') {
                const position = {
                    ...newPos,
                    [check]: 'wQ'
                }

                return Chessboard('board', game.config = {
                    ...game.config,
                    position,
                })
            }
            if (newPos[checkB] === 'bP') {
                const position = {
                    ...newPos,
                    [checkB]: 'bQ'
                }

                return Chessboard('board', game.config = {
                    ...game.config,
                    position,
                })
            }
        }
    }
}

//checking if position includes white or black king
const checkWin = newPos => {
    const positionsArray = Object.values(newPos);

    if (positionsArray.indexOf('bK') < 0 || game.possibleMovesBlack === 0) {
        game.gameOver = true;
        game.winner = 'White'
    }

    if (positionsArray.indexOf('wK') < 0 || game.possibleMovesWhite === 0) {
        game.gameOver = true;
        game.winner = 'Black'
    }
}

//checking if pawn can attack, returning boolean
const checkAttack = (oldPos, nextMove, diffX, piece) => {
    const collisionKeys = Object.keys(oldPos);
    const collisionValues = Object.values(oldPos);

    const collidedPos = collisionKeys.indexOf(nextMove);
    const collidedPiece = collisionValues[collidedPos];

    if (piece === 'wP' && collidedPos !== -1 && collidedPiece.search(/^b/) !== -1 && diffX === 1) return true
    if (piece === 'bP' && collidedPos !== -1 && collidedPiece.search(/^w/) !== -1 && diffX === 1) return true
    else return false
}

const checkCollision = (oldPos, nextMove, piece, diffX) => {
    const collisionKeys = Object.keys(oldPos);
    const collisionValues = Object.values(oldPos);

    const collidedPos = collisionKeys.indexOf(nextMove);
    const collidedPiece = collisionValues[collidedPos];

    if (piece === 'wP' || piece === 'bP') {
        if ((piece === 'wP' && collidedPos !== -1 && collidedPiece.search(/^b/) !== -1) || diffX === 1) return true;
        if ((piece === 'bP' && collidedPos !== -1 && collidedPiece.search(/^w/) !== -1) || diffX === 1) return true;
    }
    if (piece.search(/^w/) !== -1 && collidedPos !== -1 && collidedPiece.search(/^w/) !== -1) return true;
    if (piece.search(/^b/) !== -1 && collidedPos !== -1 && collidedPiece.search(/^b/) !== -1) return true;
}

//checking if next move is legal, returning new legal move
const checkLegalMove = (source, target, piece, newPos, oldPos) => {
    const sourceXCh = source.charCodeAt(0);
    const targetXCh = target.charCodeAt(0);
    const sourceY = Number(source[1]);
    const targetY = Number(target[1]);
    const diffX = Math.abs(sourceXCh - targetXCh);
    const diffY = Math.abs(sourceY - targetY);
    const targetX = String.fromCharCode(targetXCh);
    const sourceX = String.fromCharCode(sourceXCh);
    let legalMove = '';

    if (piece === 'wP') {
        if (((targetY === (sourceY + 1))) && (diffX <= 1 && diffY <= 1)) {
            legalMove = `${targetX}${targetY}`;
            if (checkAttack(oldPos, legalMove, diffX, piece)) {
                return legalMove = `${targetX}${targetY}`
            }
            if (checkCollision(oldPos, legalMove, piece, diffX)) return
        }
    }

    else if (piece === 'bP') {
        if (((targetY === (sourceY - 1))) && (diffX <= 1 && diffY <= 1)) {
            legalMove = `${targetX}${targetY}`;
            if (checkAttack(oldPos, legalMove, diffX, piece)) {
                return legalMove = `${targetX}${targetY}`
            }
            if (checkCollision(oldPos, legalMove, piece, diffX)) return
        }
    }

    else if (piece === 'wK' || piece === 'bK') {
        if (diffX === 1 && diffY < 1) {
            legalMove = `${targetX}${sourceY}`;
            if (checkCollision(oldPos, legalMove, piece, diffX)) return;
        }
        if (diffY === 1 && diffX < 1) {
            legalMove = `${sourceX}${targetY}`;
            if (checkCollision(oldPos, legalMove, piece, diffX)) return;
        }

    }

    else if (piece === 'wQ' || piece === 'bQ') {
        if ((diffY <= 1 && diffX === 1) || (diffX <= 1 && diffY === 1)) {
            legalMove = `${targetX}${targetY}`;
            if (checkCollision(oldPos, legalMove, piece, diffX)) return;
        }
    }
    return legalMove
}

//Searching all possible moves for white and black
const checkPossibleMoves = (newPos, oldPos) => {
    const posValues = Object.entries(newPos);
    const listOfTarget = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']
    const listOfWhite = []
    const listOfBlack = []
    const tempArray = []
    const possibleMovesWhite = []
    const possibleMovesBlack = []
    const regexpWhite = new RegExp(/[1-8]w/gm)
    const regexpBlack = new RegExp(/[1-8]b/gm)

    posValues.forEach((element) => {
        tempArray.push(element.join(''))
    })

    tempArray.forEach((element) => {
        if (element.match(regexpWhite)) listOfWhite.push(element)
        if (element.match(regexpBlack)) listOfBlack.push(element)
    })

    //loop thru every existing white piece
    for (let i = 0; i < listOfWhite.length; i++) {
        const pieceSourceToCheck = listOfWhite[i].slice(0, 2)
        const pieceToCheck = listOfWhite[i].slice(2, 4)

        //loop thru every position of chessboard for current white piece, returning all possible moves
        for (let j = 0; j < listOfTarget.length; j++) {
            for (let k = 1; k <= 8; k++) {
                const targetToCheck = `${listOfTarget[j]}${k}`
                const isPossible = checkLegalMove(pieceSourceToCheck, targetToCheck, pieceToCheck, oldPos, newPos)
                if (isPossible !== undefined && isPossible !== '') {
                    possibleMovesWhite.push([pieceSourceToCheck, targetToCheck, pieceToCheck])
                }
            }
        }
    }

    //loop thru every existing black piece
    for (let i = 0; i < listOfBlack.length; i++) {
        const pieceSourceToCheck = listOfBlack[i].slice(0, 2)
        const pieceToCheck = listOfBlack[i].slice(2, 4)

        //loop thru every position of chessboard for current black piece, returning all possible moves
        for (let j = 0; j < listOfTarget.length; j++) {
            for (let k = 1; k <= 8; k++) {
                const targetToCheck = `${listOfTarget[j]}${k}`
                const isPossible = checkLegalMove(pieceSourceToCheck, targetToCheck, pieceToCheck, oldPos, newPos)
                if (isPossible !== undefined && isPossible !== '') {
                    possibleMovesBlack.push([pieceSourceToCheck, targetToCheck, pieceToCheck])
                }
            }
        }
    }
    game.possibleMovesWhite = possibleMovesWhite.length
    game.possibleMovesBlack = possibleMovesBlack.length
    return [possibleMovesWhite, possibleMovesBlack]
}

//Ai next move is a random value from all possible black pieces moves 
const chessAi = (newPos, oldPos) => {
    let position = { ...newPos }
    const possibleMoves = checkPossibleMoves(newPos, oldPos)
    const possibleMovesAi = possibleMoves[1]
    if (possibleMovesAi.length !== 0) {
        const moveIndexAi = Math.floor(Math.random() * possibleMovesAi.length)
        const moveAi = possibleMovesAi[moveIndexAi]
        const sourceAi = moveAi[0]
        const targetAi = moveAi[1]
        const pieceAi = moveAi[2]

        position = {
            ...position,
            [targetAi]: pieceAi
        }
        delete position[sourceAi]
        Chessboard('board', game.config = {
            ...game.config,
            position,
        })
    }
    return position
}

const onDrop = (source, target, piece, newPos, oldPos) => {
    if (target !== checkLegalMove(source, target, piece, newPos, oldPos)) return 'snapback';
    if (game.turn === 'b') game.turn = 'w'
    else if (game.turn === 'w') game.turn = 'b'

    if ($('#aiOn').prop('checked') === true) {
        const ai = chessAi(newPos, oldPos)
        if (game.turn === 'b') game.turn = 'w'
        checkPromotion(ai)
    } else checkPromotion(newPos)

}

const onDragStart = (source, piece, position, orientation) => {
    if (game.gameOver) return false
    if ((game.turn === 'w' && piece.search(/^b/) !== -1) ||
        (game.turn === 'b' && piece.search(/^w/) !== -1)) {
        return false
    }
}

const onChange = (newPos, oldPos) => {
    checkWin(oldPos);
    if (game.gameOver === true) {
        $('.container__buttons').fadeOut(500)
        $('.container__board').fadeOut(500)
        $('.container__winner').fadeIn(2000).html(`${game.winner} wins!`)

        setTimeout(window.location.reload.bind(window.location), 3000);
        setTimeout(board.destroy, 3000)
    }
}

const game = {
    possibleMovesWhite: 1,
    possibleMovesBlack: 1,
    turn: 'w',
    gameOver: false,
    winner: '',
    config: {
        position: '3qk3/8/pppppppp/8/8/PPPPPPPP/8/3QK3',
        draggable: true,
        dropOffBoard: 'snapback',
        onDragStart: onDragStart,
        onDrop: onDrop,
        onChange: onChange,
        moveSpeed: 'slow',
        snapbackSpeed: 500,
        snapSpeed: 100,
        orientation: 'white'
    },
}

const board = Chessboard('board', game.config);

$('#startBtn').on('click', resetBoard);
$('#pVsQ').on('click', pVsQ);