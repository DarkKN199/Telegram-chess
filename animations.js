/* ==========================================================
   МОДУЛЬ АНИМАЦИИ ХОДОВ (animations.js)
   Поддерживает список ходов (для рокировки — король + ладья).
   Координаты клонов считаются в px относительно #board.
   ========================================================== */

const BoardAnimations = (() => {
    return {
        /**
         * Анимирует пачку перемещений параллельно.
         * @param {Array<{from:string,to:string}>} moves
         * @param {Function} callback — вызывается после завершения (или сразу, если нечего анимировать)
         */
        animateMoves: (moves, callback) => {
            const boardEl = document.getElementById('board');
            if (!boardEl || !Array.isArray(moves) || moves.length === 0) {
                if (callback) callback();
                return;
            }

            const squareSize = boardEl.clientWidth / 8;
            const clones = [];

            moves.forEach(move => {
                if (!move || !move.from || !move.to) return;

                const fromSq = boardEl.querySelector(`[data-square="${move.from}"]`);
                const toSq   = boardEl.querySelector(`[data-square="${move.to}"]`);
                if (!fromSq || !toSq) return;

                const pieceEl = fromSq.querySelector('.piece');
                if (!pieceEl) return;

                const fromFile = move.from.charCodeAt(0) - 97;
                const fromRank = 8 - parseInt(move.from[1], 10);
                const toFile   = move.to.charCodeAt(0) - 97;
                const toRank   = 8 - parseInt(move.to[1], 10);

                const dx = (fromFile - toFile) * squareSize;
                const dy = (fromRank - toRank) * squareSize;

                // Прячем съедаемую фигуру на время полёта клона
                const capturedEl = toSq.querySelector('.piece');
                if (capturedEl && capturedEl !== pieceEl) {
                    capturedEl.style.visibility = 'hidden';
                }

                const clone = pieceEl.cloneNode(true);
                clone.style.position = 'absolute';
                clone.style.width  = `${squareSize * 0.85}px`;
                clone.style.height = `${squareSize * 0.85}px`;
                clone.style.left   = `${toSq.offsetLeft + squareSize * 0.075}px`;
                clone.style.top    = `${toSq.offsetTop  + squareSize * 0.075}px`;
                clone.style.zIndex = '100';
                clone.style.transition = 'transform 0.2s ease-out';
                clone.style.transform = `translate(${dx}px, ${dy}px)`;
                clone.style.pointerEvents = 'none';

                boardEl.appendChild(clone);
                pieceEl.style.visibility = 'hidden';
                clones.push(clone);
            });

            if (clones.length === 0) {
                if (callback) callback();
                return;
            }

            // Двойной rAF — гарантирует, что браузер применит стартовый transform до анимации
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    clones.forEach(c => { c.style.transform = 'translate(0px, 0px)'; });
                });
            });

            setTimeout(() => {
                clones.forEach(c => c.remove());
                if (callback) callback();
            }, 200);
        }
    };
})();