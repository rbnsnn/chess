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

const checkPromotion = newPos => {
    console.log(newPos)
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

const checkWin = newPos => {
    const positionsArray = Object.values(newPos);
    if (positionsArray.indexOf('bK') < 0) console.log('white wins');
    if (positionsArray.indexOf('wK') < 0) console.log('black wins');
}

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

const chessAi = (newPos, oldPos) => {
    console.log(newPos)
    const posValues = Object.entries(newPos);
    const regexp = new RegExp(/[1-8]b/gm)
    const listOfTarget = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']
    const listOfAi = []
    const tempArray = []
    const possibleMovesAi = []
    let position = { ...newPos }

    posValues.forEach((element) => {
        tempArray.push(element.join(''))
    })

    tempArray.forEach((element) => {
        if (element.match(regexp))
            listOfAi.push(element)
    })

    for (let i = 0; i < listOfAi.length; i++) {
        const pieceSourceToCheck = listOfAi[i].slice(0, 2)
        const pieceToCheck = listOfAi[i].slice(2, 4)

        for (let j = 0; j < listOfTarget.length; j++) {
            for (let k = 1; k <= 8; k++) {
                const targetToCheck = `${listOfTarget[j]}${k}`
                const isPossible = checkLegalMove(pieceSourceToCheck, targetToCheck, pieceToCheck, newPos, oldPos)
                if (isPossible !== undefined && isPossible !== '') {
                    possibleMovesAi.push([pieceSourceToCheck, targetToCheck, pieceToCheck])
                }
            }
        }
    }

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
    const ai = chessAi(newPos, oldPos)
    checkPromotion(ai)
    // if (game.turn === 'w') game.turn = 'b';
    // else if (game.turn === 'b') game.turn = 'w';
}

const onDragStart = (source, piece, position, orientation) => {
    if (game.gameOver) return false

    // if ((game.turn === 'w' && piece.search(/^b/) !== -1) ||
    //     (game.turn === 'b' && piece.search(/^w/) !== -1)) {
    //     return false
    // }
}

const onChange = (newPos, oldPos) => {

    checkWin(oldPos);
}

const game = {
    turn: 'w',
    gameOver: false,
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
        // orientation: playerOrientation[orientationIndex],
    },
}

const board = Chessboard('board', game.config);
$('#clearBtn').on('click', resetBoard);
$('#pVsQ').on('click', pVsQ);