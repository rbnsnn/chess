// 'use strict';
const game = {
    turn: 'w',
    gameOver: false,
}

const resetBoard = () => {
    // game.turn = 'w';
    Chessboard('board', config = {
        ...config,
        position: '3qk3/8/pppppppp/8/8/PPPPPPPP/8/3QK3'
    });
}

const checkWin = position => {
    const positionsArray = Object.values(position);
    if (positionsArray.indexOf('bK') < 0) console.log('white wins');
    if (positionsArray.indexOf('wK') < 0) console.log('black wins');

}

const checkPromotion = (piece, nextMove, newPos) => {
    if (piece === 'wP' && nextMove.search(/^[a-h][8]/) !== -1) {
        const position = {
            ...newPos,
            [nextMove]: 'wQ'
        }

        return Chessboard('board', config = {
            ...config,
            position,
        })
    }

    if (piece === 'bP' && nextMove.search(/^[a-h][1]/) !== -1) {
        const position = {
            ...newPos,
            [nextMove]: 'bQ'
        }

        return Chessboard('board', config = {
            ...config,
            position,
        })
    }
}

const checkCollision = (oldPos, nextMove, piece) => {
    const collisionKeys = Object.keys(oldPos);
    const collisionValues = Object.values(oldPos);

    const collidedPos = collisionKeys.indexOf(nextMove);
    const collidedPiece = collisionValues[collidedPos];

    if (piece.search(/^w/) !== -1 && collidedPos !== -1 && collidedPiece.search(/^w/) !== -1) return true;
    if (piece.search(/^b/) !== -1 && collidedPos !== -1 && collidedPiece.search(/^b/) !== -1) return true;
}

const checkLegalMove = (source, target, piece, newPos, oldPos) => {
    let legalMove = '';
    let diffX = 0;
    let diffY = 0;
    let targetX;
    let targetY;
    let sourceX;
    let sourceY;

    if (piece === 'wP') {
        targetX = source[0];
        targetY = Number(source[1]);

        if (targetY < 8) {

            targetY++;
            legalMove = `${targetX}${targetY}`;
            if (checkCollision(oldPos, legalMove, piece, newPos, target)) return;
            checkPromotion(piece, legalMove, newPos);
            return legalMove;
        }
    }

    else if (piece === 'bP') {
        targetX = source[0];
        targetY = Number(source[1]);

        if (targetY < 8) {
            targetY--;
            legalMove = `${targetX}${targetY}`;
            if (checkCollision(oldPos, legalMove, piece, newPos)) return;
            checkPromotion(piece, legalMove, newPos);
            return legalMove;
        }
    }

    else if (piece === 'wK' || piece === 'bK') {
        sourceX = source.charCodeAt(0);
        targetX = target.charCodeAt(0);
        sourceY = Number(source[1]);
        targetY = Number(target[1]);

        if (targetX === (sourceX + 1) || targetX === (sourceX - 1)) {
            targetX = String.fromCharCode(targetX);
            legalMove = `${targetX}${sourceY}`;
            if (checkCollision(oldPos, legalMove, piece)) return;
            return legalMove;
        }

        if (targetY === (sourceY + 1) || targetY === (sourceY - 1)) {
            targetX = String.fromCharCode(sourceX);
            legalMove = `${targetX}${targetY}`;
            if (checkCollision(oldPos, legalMove, piece)) return;
            return legalMove;
        }
    }

    else if (piece === 'wQ' || piece === 'bQ') {
        sourceX = source.charCodeAt(0);
        targetX = target.charCodeAt(0);
        sourceY = Number(source[1]);
        targetY = Number(target[1]);
        diffX = Math.abs(sourceX - targetX);
        diffY = Math.abs(sourceY - targetY);

        if (((targetX === (sourceX + 1) || targetX === (sourceX - 1)) || (targetY === (sourceY + 1) || targetY === (sourceY - 1))) && (diffX <= 1 && diffY <= 1)) {
            targetX = String.fromCharCode(targetX);
            legalMove = `${targetX}${targetY}`;
            if (checkCollision(oldPos, legalMove, piece)) return;
            return legalMove;
        }
    }
}

const onDrop = (source, target, piece, newPos, oldPos) => {
    if (target !== checkLegalMove(source, target, piece, newPos, oldPos)) return 'snapback'
    // if (game.turn === 'w') game.turn = 'b';
    // else if (game.turn === 'b') game.turn = 'w';
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
}

let config = {
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
}

const board = Chessboard('board', config);



$('#clearBtn').on('click', resetBoard);