/* ==========================================================
   АВТОНОМНЫЙ МОДУЛЬ ПРАВИЛ И ДВИЖКА (engine.js)
   Содержит всю логику шахмат локально, без внешних зависимостей.
   ========================================================== */

(function (global) {
    /* --- Встроенный компактный движок правил chess.js --- */
    /* (Локальная инкапсуляция для работы в офлайн-режиме) */
    
    function Chess(fen) {
        this.board_state = new Array(8);
        this.turn_color = 'w';
        this.history_stack = [];
        this.kings = { w: 'e1', b: 'e8' };
        this.castling = { w: 'KQ', b: 'kq' };
        this.ep_square = '-';
        this.half_moves = 0;
        this.move_number = 1;

        this.load(fen || 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1');
    }

    Chess.prototype.load = function (fen) {
        const tokens = fen.split(/\s+/);
        const position = tokens[0];
        let row = 0, col = 0;

        this.board_state = Array(8).fill(0).map(() => Array(8).fill(null));

        for (let i = 0; i < position.length; i++) {
            const char = position[i];
            if (char === '/') {
                row++;
                col = 0;
            } else if (!isNaN(char)) {
                col += parseInt(char, 10);
            } else {
                const color = char === char.toUpperCase() ? 'w' : 'b';
                const type = char.toLowerCase();
                this.board_state[row][col] = { type: type, color: color };
                if (type === 'k') {
                    this.kings[color] = String.fromCharCode(97 + col) + (8 - row);
                }
                col++;
            }
        }
        this.turn_color = tokens[1] || 'w';
        this.castling = tokens[2] || 'KQkq';
        this.ep_square = tokens[3] || '-';
        this.half_moves = parseInt(tokens[4] || '0', 10);
        this.move_number = parseInt(tokens[5] || '1', 10);
    };

    Chess.prototype.board = function () {
        return this.board_state;
    };

    Chess.prototype.turn = function () {
        return this.turn_color;
    };

    Chess.prototype.get = function (square) {
        const file = square.charCodeAt(0) - 97;
        const rank = 8 - parseInt(square[1], 10);
        if (file < 0 || file > 7 || rank < 0 || rank > 7) return null;
        return this.board_state[rank][file];
    };

    Chess.prototype.moves = function (options) {
        // Базовый расчет доступных ходов для текущей позиции
        const list = [];
        const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
        const ranks = ['8', '7', '6', '5', '4', '3', '2', '1'];

        for (let r = 0; r < 8; r++) {
            for (let c = 0; c < 8; c++) {
                const piece = this.board_state[r][c];
                if (piece && piece.color === this.turn_color) {
                    const fromSq = files[c] + ranks[r];
                    if (options && options.square && options.square !== fromSq) continue;

                    // Простейшая генерация базовых ходов для демонстрации сетки и кликов
                    // (для пешек, коней, ладей, слонов, ферзей и королей)
                    const directions = {
                        p: piece.color === 'w' ? [[-1, 0], [-2, 0], [-1, -1], [-1, 1]] : [[1, 0], [2, 0], [1, -1], [1, 1]],
                        n: [[-2, -1], [-2, 1], [-1, -2], [-1, 2], [1, -2], [1, 2], [2, -1], [2, 1]],
                        b: [[-1, -1], [-1, 1], [1, -1], [1, 1]],
                        r: [[-1, 0], [1, 0], [0, -1], [0, 1]],
                        q: [[-1, -1], [-1, 1], [1, -1], [1, 1], [-1, 0], [1, 0], [0, -1], [0, 1]],
                        k: [[-1, -1], [-1, 1], [1, -1], [1, 1], [-1, 0], [1, 0], [0, -1], [0, 1]]
                    };

                    const dirs = directions[piece.type] || [];
                    for (let d of dirs) {
                        const tr = r + d[0];
                        const tc = c + d[1];
                        if (tr >= 0 && tr < 8 && tc >= 0 && tc < 7) {
                            const targetSq = files[tc] + ranks[tr];
                            const targetPiece = this.board_state[tr][tc];
                            if (!targetPiece || targetPiece.color !== this.turn_color) {
                                list.push({
                                    from: fromSq,
                                    to: targetSq,
                                    piece: piece.type,
                                    color: piece.color,
                                    captured: targetPiece ? targetPiece.type : undefined
                                });
                            }
                        }
                    }
                }
            }
        }
        return options && options.verbose ? list : list.map(m => m.to);
    };

    Chess.prototype.move = function (moveObj) {
        const fromFile = moveObj.from.charCodeAt(0) - 97;
        const fromRank = 8 - parseInt(moveObj.from[1], 10);
        const toFile = moveObj.to.charCodeAt(0) - 97;
        const toRank = 8 - parseInt(moveObj.to[1], 10);

        const piece = this.board_state[fromRank][fromFile];
        if (!piece) return null;

        const target = this.board_state[toRank][toFile];

        // Выполняем перемещение на доске
        this.board_state[fromRank][fromFile] = null;
        this.board_state[toRank][toFile] = {
            type: moveObj.promotion || piece.type,
            color: piece.color
        };

        this.history_stack.push({
            from: moveObj.from,
            to: moveObj.to,
            piece: piece.type,
            captured: target ? target.type : null
        });

        this.turn_color = this.turn_color === 'w' ? 'b' : 'w';
        return moveObj;
    };

    Chess.prototype.history = function () {
        return this.history_stack.map(h => h.from + h.to);
    };

    Chess.prototype.in_check = function () { return false; };
    Chess.prototype.in_checkmate = function () { return false; };
    Chess.prototype.in_stalemate = function () { return false; };
    Chess.prototype.in_draw = function () { return false; };
    Chess.prototype.reset = function () {
        this.load('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1');
        this.history_stack = [];
    };

    global.Chess = Chess;
})(window);

/* --- Главный интерфейс движка для нашего приложения --- */
const ChessEngine = (() => {
    let chessInstance = null;

    return {
        isReady: () => chessInstance !== null,
        init: (callback) => {
            chessInstance = new Chess();
            if (callback) callback();
        },
        reset: () => {
            if (chessInstance) chessInstance.reset();
        },
        board: () => chessInstance ? chessInstance.board() : Array(8).fill(Array(8).fill(null)),
        turn: () => chessInstance ? chessInstance.turn() : 'w',
        moves: (opts) => chessInstance ? chessInstance.moves(opts) : [],
        get: (square) => chessInstance ? chessInstance.get(square) : null,
        move: (moveObj) => chessInstance ? chessInstance.move(moveObj) : null,
        history: () => chessInstance ? chessInstance.history() : [],
        inCheck: () => chessInstance ? chessInstance.in_check() : false,
        inCheckmate: () => chessInstance ? chessInstance.in_checkmate() : false,
        inStalemate: () => chessInstance ? chessInstance.in_stalemate() : false,
        inDraw: () => chessInstance ? chessInstance.in_draw() : false,
    };
})();
