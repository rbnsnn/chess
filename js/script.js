'use strict';
const game = {
    turn: 'w',
    gameOver: false,
}

const resetBoard = () => {
    game.turn = 'w';
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
const checkAttack = (oldPos, nextMove, diffX, piece) => {

    const collisionKeys = Object.keys(oldPos);
    const collisionValues = Object.values(oldPos);

    const collidedPos = collisionKeys.indexOf(nextMove);
    const collidedPiece = collisionValues[collidedPos];

    console.log(
        `
        nextMove: ${nextMove}
        collidedPiece: ${collidedPiece}
        diffX: ${diffX}
        piece: ${piece}
        collidedPos: ${collidedPos}`

    )

    console.log(collisionValues)

    if (piece === 'wP' && collidedPos !== -1 && collidedPiece.search(/^b/) !== -1 && diffX === 1) {
        console.log('dziaua')
        return true
    } else return false

}
const checkCollision = (newPos, oldPos, nextMove, piece, diffX) => {
    const collisionKeys = Object.keys(oldPos);
    const collisionValues = Object.values(oldPos);

    const collidedPos = collisionKeys.indexOf(nextMove);
    const collidedPiece = collisionValues[collidedPos];

    console.log(`
        collisionKeys: ${collisionKeys}
        collisionValues ${collisionValues}
        collidedPos: ${collidedPos}
        collidedPiece: ${collidedPiece}
    `)

    if ((piece === 'wP' && collidedPos !== -1 && collidedPiece.search(/^b/) !== -1) || diffX === 1) return true;
    if ((piece === 'bP' && collidedPos !== -1 && collidedPiece.search(/^w/) !== -1) || diffX === 1) return true;

    if (piece.search(/^w/) !== -1 && collidedPos !== -1 && collidedPiece.search(/^w/) !== -1) return true;
    if (piece.search(/^b/) !== -1 && collidedPos !== -1 && collidedPiece.search(/^b/) !== -1) return true;
}

const checkLegalMove = (source, target, piece, newPos, oldPos) => {
    let legalMove = '';
    let sourceX = source.charCodeAt(0);
    let targetX = target.charCodeAt(0);
    let sourceY = Number(source[1]);
    let targetY = Number(target[1]);
    let diffX = Math.abs(sourceX - targetX);
    let diffY = Math.abs(sourceY - targetY);

    if (piece === 'wP') {
        diffY = sourceY - targetY;
        targetX = String.fromCharCode(targetX);
        sourceX = String.fromCharCode(sourceX);

        if (((targetY === (sourceY + 1))) && (diffX <= 1 && diffY <= 1)) {
            legalMove = `${targetX}${targetY}`;
            if (checkAttack(oldPos, legalMove, diffX, piece)) {
                return legalMove = `${targetX}${targetY}`
            }
            if (checkCollision(newPos, oldPos, legalMove, piece, diffX)) return;
            checkPromotion(piece, legalMove, newPos)

            return legalMove;
        }
    }

    else if (piece === 'bP') {
        diffY = sourceY - targetY;
        if (diffY === 1 && diffX === 0) {
            targetX = String.fromCharCode(targetX)
            legalMove = `${targetX}${targetY}`;
            if (checkCollision(newPos, oldPos, legalMove, piece, diffX)) return;
            checkPromotion(piece, legalMove, newPos);
            return legalMove;
        }
    }

    else if (piece === 'wK' || piece === 'bK') {

        if (targetX === (sourceX + 1) || targetX === (sourceX - 1)) {
            targetX = String.fromCharCode(targetX);
            legalMove = `${targetX}${sourceY}`;
            if (checkCollision(newPos, oldPos, legalMove, piece, diffX)) return;
            return legalMove;
        }

        if (targetY === (sourceY + 1) || targetY === (sourceY - 1)) {
            targetX = String.fromCharCode(sourceX);
            legalMove = `${targetX}${targetY}`;
            if (checkCollision(newPos, oldPos, legalMove, piece, diffX)) return;
            return legalMove;
        }
    }

    else if (piece === 'wQ' || piece === 'bQ') {

        if (((targetX === (sourceX + 1) || targetX === (sourceX - 1)) || (targetY === (sourceY + 1) || targetY === (sourceY - 1))) && (diffX <= 1 && diffY <= 1)) {
            targetX = String.fromCharCode(targetX);
            legalMove = `${targetX}${targetY}`;
            if (checkCollision(newPos, oldPos, legalMove, piece, diffX)) return;
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

    // if ((game.turn === 'w' && piece.search(/^b/) !== -1) ||
    //     (game.turn === 'b' && piece.search(/^w/) !== -1)) {
    //     return false
    // }
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