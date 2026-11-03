/* ==========================================================
   МОДУЛЬ ПРАВИЛ И ДВИЖКА (engine.js)
   ========================================================== */

// Создаем глобальный объект движка заранее
const ChessEngine = (() => {
    let chessInstance = null;
    let isInitialized = false;

    // Функция загрузки скрипта chess.js с проверкой
    function loadChessLibrary(callback) {
        if (typeof Chess !== 'undefined') {
            chessInstance = new Chess();
            isInitialized = true;
            if (callback) callback();
            return;
        }

        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/chess.js/1.0.0-beta.6/chess.min.js';
        script.async = true;
        script.onload = () => {
            try {
                chessInstance = new Chess();
                isInitialized = true;
                console.log('Chess.js успешно загружен');
                if (callback) callback();
            } catch (e) {
                console.error('Ошибка инициализации Chess:', e);
            }
        };
        document.head.appendChild(script);
    }

    return {
        init: (callback) => {
            if (isInitialized && chessInstance) {
                if (callback) callback();
                return;
            }
            loadChessLibrary(callback);
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
