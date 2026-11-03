/* ==========================================================
   МОДУЛЬ АНИМАЦИИ И ПЛАВНОСТИ (animations.js)
   ========================================================== */

const BoardAnimations = (() => {
    const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
    const ranks = ['8', '7', '6', '5', '4', '3', '2', '1'];

    return {
        /**
         * Анимирует перемещение фигуры из одной клетки в другую с помощью плавных CSS-трансформаций (GPU-accelerated)
         * @param {Object} move - Объект хода chess.js ({from, to, piece, color})
         * @param {Function} onComplete - Функция, вызываемая после завершения анимации
         */
        animateMove: (move, onComplete) => {
            if (!move || !move.from || !move.to) {
                if (onComplete) onComplete();
                return;
            }

            const boardEl = document.getElementById('board');
            const toFileIdx = files.indexOf(move.to[0]);
            const toRankIdx = ranks.indexOf(move.to[1]);
            
            // Ищем фигуру, которая только что приземлилась на клетку назначения
            const squares = boardEl.children;
            const targetSquareEl = squares[toRankIdx * 8 + toFileIdx];
            const pieceEl = targetSquareEl ? targetSquareEl.querySelector('.piece') : null;

            if (!pieceEl) {
                if (onComplete) onComplete();
                return;
            }

            // Вычисляем смещение от предыдущей клетки к новой
            const fromFileIdx = files.indexOf(move.from[0]);
            const fromRankIdx = ranks.indexOf(move.from[1]);
            
            const deltaX = (fromFileIdx - toFileIdx) * 100;
            const deltaY = (fromRankIdx - toRankIdx) * 100;

            // Мгновенно смещаем фигуру на старую позицию без анимации
            pieceEl.style.transition = 'none';
            pieceEl.style.transform = `translate(${deltaX}%, ${deltaY}%)`;
            pieceEl.style.zIndex = '20';

            // Принудительно вызываем перерисовку браузером (reflow)
            pieceEl.offsetHeight;

            // Включаем плавную анимацию перемещения (cubic-bezier для идеального скольжения в стиле Lichess)
            pieceEl.style.transition = 'transform 0.22s cubic-bezier(0.25, 1, 0.5, 1)';
            pieceEl.style.transform = 'translate(0px, 0px)';

            // После завершения анимации сбрасываем стили
            setTimeout(() => {
                pieceEl.style.transition = '';
                pieceEl.style.transform = '';
                pieceEl.style.zIndex = '';
                if (onComplete) onComplete();
            }, 220);
        }
    };
})();
