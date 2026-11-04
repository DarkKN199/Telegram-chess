/* ==========================================================
   МОДУЛЬ ПРАВИЛ И ДВИЖКА (engine.js)
   ========================================================== */

const ChessEngine = (() => {
    let chessInstance = null;
    let isInitialized = false;

    function initEngine(callback) {
        if (typeof Chess !== 'undefined') {
            try {
                chessInstance = new Chess();
                isInitialized = true;
                if (callback) callback();
                return;
            } catch (e) {
                console.error('Ошибка создания объекта Chess:', e);
            }
        }

        // Используем стабильный CDN jsDelivr вместо cdnjs
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/chess.js@1.0.0-beta.6/chess.min.js';
        script.async = false;
        
        script.onload = () => {
            try {
                chessInstance = new Chess();
                isInitialized = true;
                console.log('Chess.js успешно загружен через jsDelivr');
                if (callback) callback();
            } catch (e) {
                console.error('Ошибка инициализации Chess после загрузки:', e);
            }
        };

        script.onerror = () => {
            console.error('Не удалось загрузить chess.js! Проверьте интернет-соединение.');
        };

        document.head.appendChild(script);
    }

    return {
        isReady: () => isInitialized && chessInstance !== null,
        init: (callback) => initEngine(callback),
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
