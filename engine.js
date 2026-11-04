/* ==========================================================
   МОДУЛЬ ПРАВИЛ И ДВИЖКА (engine.js)
   Обёртка над chess.js v1.0.0-beta.6 (API camelCase)
   ========================================================== */

const ChessEngine = (() => {
    let chessInstance = null;
    let isInitialized = false;

    return {
        isReady: () => isInitialized && chessInstance !== null,

        init: (callback) => {
            try {
                if (typeof Chess !== 'undefined') {
                    chessInstance = new Chess();
                    isInitialized = true;
                    console.log('Chess.js успешно инициализирован');
                    if (callback) callback();
                } else {
                    console.error('Библиотека Chess не найдена! Проверьте подключение в index.html');
                    if (callback) callback(new Error('Chess library not found'));
                }
            } catch (e) {
                console.error('Ошибка создания экземпляра Chess:', e);
                if (callback) callback(e);
            }
        },

        reset: () => {
            if (chessInstance) chessInstance.reset();
        },

        board: () => chessInstance ? chessInstance.board() : Array(8).fill(Array(8).fill(null)),

        turn: () => chessInstance ? chessInstance.turn() : 'w',

        moves: (opts) => chessInstance ? chessInstance.moves(opts) : [],

        get: (square) => chessInstance ? chessInstance.get(square) : null,

        move: (moveObj) => chessInstance ? chessInstance.move(moveObj) : null,

        history: (opts) => chessInstance ? chessInstance.history(opts) : [],

        // chess.js v1.0.0-beta.6 — методы is*
        inCheck: () => chessInstance ? chessInstance.isCheck() : false,
        inCheckmate: () => chessInstance ? chessInstance.isCheckmate() : false,
        inStalemate: () => chessInstance ? chessInstance.isStalemate() : false,
        inDraw: () => chessInstance ? chessInstance.isDraw() : false,
    };
})();