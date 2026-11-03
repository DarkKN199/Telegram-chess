/* ==========================================================
   МОДУЛЬ ЛОГИКИ И ПРАВИЛ ШАХМАТ (engine.js)
   ========================================================== */

if (typeof Chess === 'undefined') {
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/chess.js/0.10.3/chess.min.js';
    script.async = false;
    document.head.appendChild(script);
}

const ChessEngine = (() => {
    let chess = null;

    function init() {
        chess = new Chess();
    }

    return {
        reset: () => {
            if (!chess) init();
            chess.reset();
        },

        board: () => {
            if (!chess) init();
            return chess.board();
        },

        turn: () => {
            if (!chess) init();
            return chess.turn();
        },

        get: (square) => {
            if (!chess) init();
            return chess.get(square);
        },

        moves: (options) => {
            if (!chess) init();
            return chess.moves(options);
        },

        move: (moveDetails) => {
            if (!chess) init();
            // moveDetails должен содержать { from, to, promotion } если это превращение
            return chess.move(moveDetails);
        },

        history: () => {
            if (!chess) init();
            return chess.history();
        },

        // Проверки состояний и завершения игры
        inCheck: () => chess ? chess.in_check() : false,
        inCheckmate: () => chess ? chess.in_checkmate() : false,
        
        // Пат (нет легальных ходов, но шах отсутствует)
        inStalemate: () => chess ? chess.in_stalemate() : false,
        
        // Ничья по правилу 50 ходов (отсутствие взятий и ходов пешками в течение 50 ходов)
        inThreefoldRepetition: () => chess ? chess.in_threefold_repetition() : false,
        insufficientMaterial: () => chess ? chess.insufficient_material() : false,
        
        // Общая проверка на ничью (включает пат, 50 ходов, недостаток материала и т.д.)
        inDraw: () => {
            if (!chess) return false;
            // chess.in_draw() автоматически проверяет пат, 50 ходов, троекратное повторение и недостаток фигур
            return chess.in_draw();
        },

        isGameOver: () => chess ? chess.game_over() : false
    };
})();

ChessEngine.reset();
