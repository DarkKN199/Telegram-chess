/* ==========================================================
   МОДУЛЬ ПРАВИЛ И ДВИЖКА (engine.js)
   Использует официальную внешнюю библиотеку chess.js
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
                }
            } catch (e) {
                console.error('Ошибка создания экземпляра Chess:', e);
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
        
        history: () => chessInstance ? chessInstance.history() : [],
        
        inCheck: () => chessInstance ? chessInstance.in_check() : false,
        
        inCheckmate: () => chessInstance ? chessInstance.in_checkmate() : false,
        
        inStalemate: () => chessInstance ? chessInstance.in_stalemate() : false,
        
        inDraw: () => chessInstance ? chessInstance.in_draw() : false,
    };
})();
