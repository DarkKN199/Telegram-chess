/* ==========================================================
   КОНТРОЛЛЕР ИГРЫ (game.js)
   - Блокировка ввода во время анимации и после мата
   - Промоушен с отменой
   - Рокировка: анимируем короля и ладью одновременно
   - reset() инвалидирует pending-колбэки через animationToken
   ========================================================== */

const GameController = (() => {
    let selectedSquare = null;
    let validMoves = [];
    let lastMove = null;
    let isAnimating = false;
    let animationToken = 0;

    function updateView() {
        BoardRenderer.renderBoard(lastMove);
        BoardRenderer.updateUIInfo();
    }

    function handleSquareClick(squareName) {
        if (isAnimating) return;
        if (ChessEngine.inCheckmate() || ChessEngine.inDraw()) return;

        const clickedPiece = ChessEngine.get(squareName);

        if (selectedSquare === null) {
            if (clickedPiece && clickedPiece.color === ChessEngine.turn()) {
                selectedSquare = squareName;
                validMoves = ChessEngine.moves({ square: squareName, verbose: true });
                const targetSquares = validMoves.map(m => m.to);
                BoardRenderer.highlightSquares(squareName, targetSquares);
            }
            return;
        }

        const targetMove = validMoves.find(m => m.to === squareName);

        if (targetMove) {
            const isPromotion =
                targetMove.piece === 'p' &&
                (squareName[1] === '8' || squareName[1] === '1');

            const executeMove = (promoPiece) => {
                if (isPromotion && !promoPiece) {
                    // Отмена превращения
                    selectedSquare = null;
                    BoardRenderer.highlightSquares(null, []);
                    updateView();
                    return;
                }

                const moveData = { from: selectedSquare, to: squareName };
                if (isPromotion) moveData.promotion = promoPiece;

                const result = ChessEngine.move(moveData);

                selectedSquare = null;
                validMoves = [];
                BoardRenderer.highlightSquares(null, []);

                if (!result) return;

                lastMove = { from: result.from, to: result.to };

                // Собираем список анимаций: основная фигура + ладья при рокировке
                const animations = [{ from: result.from, to: result.to }];
                if (result.flags.includes('k') || result.flags.includes('q')) {
                    const rank = result.color === 'w' ? '1' : '8';
                    if (result.flags.includes('k')) {
                        animations.push({ from: 'h' + rank, to: 'f' + rank });
                    } else {
                        animations.push({ from: 'a' + rank, to: 'd' + rank });
                    }
                }

                isAnimating = true;
                const token = ++animationToken;

                const finish = () => {
                    if (token !== animationToken) return; // отменено reset()
                    isAnimating = false;
                    updateView();
                };

                if (typeof BoardAnimations !== 'undefined') {
                    BoardAnimations.animateMoves(animations, finish);
                } else {
                    finish();
                }
            };

            if (isPromotion) {
                BoardRenderer.showPromotionDialog(ChessEngine.turn(), executeMove);
            } else {
                executeMove();
            }
        } else {
            // Клик не по легальной цели
            selectedSquare = null;
            validMoves = [];
            BoardRenderer.highlightSquares(null, []);
            if (clickedPiece && clickedPiece.color === ChessEngine.turn()) {
                handleSquareClick(squareName);
            }
        }
    }

    return {
        init: () => {
            ChessEngine.init((err) => {
                if (err) {
                    const statusEl = document.getElementById('status');
                    if (statusEl) statusEl.textContent = 'Ошибка загрузки движка шахмат';
                    return;
                }
                updateView();

                const boardEl = document.getElementById('board');
                if (boardEl) {
                    boardEl.addEventListener('click', (e) => {
                        const sq = e.target.closest('.square');
                        if (sq && sq.dataset.square) {
                            handleSquareClick(sq.dataset.square);
                        }
                    });
                }
            });
        },

        reset: () => {
            ChessEngine.reset();

            // Инвалидируем возможный pending-колбэк анимации
            animationToken++;
            isAnimating = false;

            selectedSquare = null;
            validMoves = [];
            lastMove = null;
            BoardRenderer.highlightSquares(null, []);
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