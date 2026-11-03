/* ==========================================================
   ГЛАВНЫЙ УПРАВЛЯЮЩИЙ МОДУЛЬ (game.js)
   ========================================================== */

const GameController = (() => {
    let selectedSquare = null;
    let legalMoves = [];
    let lastMove = null;

    function updateView() {
        BoardRenderer.renderBoardState(
            ChessEngine.board(),
            selectedSquare,
            legalMoves,
            lastMove
        );
        BoardRenderer.updateUIInfo(ChessEngine);
    }

    function handleSquareClick(square) {
        const piece = ChessEngine.get(square);

        if (selectedSquare === null) {
            if (piece && piece.color === ChessEngine.turn()) {
                selectedSquare = square;
                legalMoves = ChessEngine.moves({ square: square, verbose: true });
                updateView();
            }
        } else {
            const targetMove = legalMoves.find(m => m.to === square);

            if (targetMove) {
                const isPromotion = targetMove.piece === 'p' && (square[1] === '8' || square[1] === '1');

                if (isPromotion) {
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

    function executeMove(moveDetails) {
        const move = ChessEngine.move(moveDetails);
        if (move !== null) {
            lastMove = move;
            selectedSquare = null;
            legalMoves = [];
            
            updateView();
            if (typeof BoardAnimations !== 'undefined') {
                BoardAnimations.animateMove(move);
            }
        }
    }

    return {
        init: () => {
            // Сначала строим сетку доски визуально, чтобы интерфейс появился мгновенно
            BoardRenderer.initGrid(handleSquareClick);
            
            // Затем инициализируем движок и рисуем фигуры, как только он готов
            ChessEngine.init(() => {
                ChessEngine.reset();
                updateView();
            });
        },
        reset: () => {
            ChessEngine.reset();
            selectedSquare = null;
            legalMoves = [];
            lastMove = null;
            updateView();
        }
    };
})();

document.addEventListener('DOMContentLoaded', () => {
    if (window.Telegram && window.Telegram.WebApp) {
        window.Telegram.WebApp.expand();
    }
    GameController.init();
});
