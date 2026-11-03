/* ==========================================================
   ГЛАВНЫЙ УПРАВЛЯЮЩИЙ МОДУЛЬ (game.js)
   ========================================================== */

const GameController = (() => {
    let selectedSquare = null;
    let legalMoves = [];
    let lastMove = null;

    // Обновление интерфейса и доски
    function updateView() {
        BoardRenderer.renderBoardState(
            ChessEngine.board(),
            selectedSquare,
            legalMoves,
            lastMove
        );
        BoardRenderer.updateUIInfo(ChessEngine);
    }

    // Обработка клика по клетке доски
    function handleSquareClick(square) {
        const piece = ChessEngine.get(square);

        // Если ничего не выбрано — пытаемся выбрать фигуру текущего игрока
        if (selectedSquare === null) {
            if (piece && piece.color === ChessEngine.turn()) {
                selectedSquare = square;
                legalMoves = ChessEngine.moves({ square: square, verbose: true });
                updateView();
            }
        } else {
            // Если клетка уже выбрана, проверяем, является ли ход легальным
            const targetMove = legalMoves.find(m => m.to === square);

            if (targetMove) {
                // Проверяем, является ли ход превращением пешки
                const isPromotion = targetMove.piece === 'p' && (square[1] === '8' || square[1] === '1');

                if (isPromotion) {
                    // Открываем модальное окно выбора фигуры (ферзь, ладья, слон, конь)
                    BoardRenderer.showPromotionDialog(ChessEngine.turn(), (chosenPiece) => {
                        executeMove({
                            from: selectedSquare,
                            to: square,
                            promotion: chosenPiece
                        });
                    });
                } else {
                    executeMove({
                        from: selectedSquare,
                        to: square,
                        promotion: 'q'
                    });
                }
            } else {
                // Если кликнули на другую свою фигуру — меняем выбор, иначе сбрасываем
                if (piece && piece.color === ChessEngine.turn()) {
                    selectedSquare = square;
                    legalMoves = ChessEngine.moves({ square: square, verbose: true });
                    updateView();
                } else {
                    selectedSquare = null;
                    legalMoves = [];
                    updateView();
                }
            }
        }
    }

    // Выполнение хода через движок и запуск анимации
    function executeMove(moveDetails) {
        const move = ChessEngine.move(moveDetails);
        if (move !== null) {
            lastMove = move;
            selectedSquare = null;
            legalMoves = [];
            
            // Сначала обновляем состояние, затем запускаем плавную анимацию из animations.js
            updateView();
            if (typeof BoardAnimations !== 'undefined') {
                BoardAnimations.animateMove(move);
            }
        }
    }

    return {
        // Инициализация игры
        init: () => {
            BoardRenderer.initGrid(handleSquareClick);
            ChessEngine.reset();
            selectedSquare = null;
            legalMoves = [];
            lastMove = null;
            updateView();
        },

        // Сброс / Новая игра
        reset: () => {
            ChessEngine.reset();
            selectedSquare = null;
            legalMoves = [];
            lastMove = null;
            updateView();
        }
    };
})();

// Автоматический запуск игры при загрузке всех скриптов
document.addEventListener('DOMContentLoaded', () => {
    if (window.Telegram && window.Telegram.WebApp) {
        window.Telegram.WebApp.expand();
    }
    GameController.init();
});
