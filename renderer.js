/* ==========================================================
   МОДУЛЬ ВИЗУАЛЬНОГО РЕНДЕРИНГА (renderer.js)
   - Координаты: файлы снизу-справа, ранги сверху-слева (без наложений)
   - last-move подсветка
   - индикатор шаха
   - материальный перевес и иконки взятых фигур
   - корректный url('...') вокруг SVG
   ========================================================== */

const BoardRenderer = (() => {
    const pieceSVGs = {
        'w-p': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 45 45"><path d="M22.5 9c-2.21 0-4 1.79-4 4 0 .89.32 1.7.9 2.3-2 .7-3.5 2.5-3.5 4.7 0 1.1.31 2.1.84 3-1.34 1.15-2.2 2.85-2.2 4.7 0 2.22 1.48 4.12 3.5 4.7v2.3H15v3h15v-3h-2.2v-2.3c2.02-.58 3.5-2.48 3.5-4.7 0-1.85-.86-3.55-2.2-4.7.53-.9.84-1.9.84-3 0-2.2-1.5-4-3.5-4.7.58-.6.9-1.41.9-2.3 0-2.21-1.79-4-4-4z" fill="#fff" stroke="#000" stroke-width="1.5"/></svg>',
        'w-r': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 45 45"><path d="M9 39h27v-3H9v3zm3-3v-4h21v4H12zm-1-6h23v-2H11v2zm2-4h19v-7H13v7zm1-9h17V11H14v6zm2-8h13V9H16v2z" fill="#fff" stroke="#000" stroke-width="1.5"/></svg>',
        'w-n': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 45 45"><path d="M22 10c10.5 1 16.5 8 16 29H15c0-9 10-6.5 8-21z" fill="#fff" stroke="#000" stroke-width="1.5"/></svg>',
        'w-b': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 45 45"><g fill="none" stroke="#000" stroke-width="1.5"><path d="M9 36c3.39-.97 10.11 0 13.5-3 3.39 3 10.11 2.03 13.5 3H9z"/><path d="M15 32c2.5 0 12.5 0 15-3v-3c0-2.5-2.5-4-2.5-4 0-1.5 1-2 1-3.5 0-2-1.5-3-3-3s-3 1-3 3c0 1.5 1 2 1 3.5 0 0-2.5 1.5-2.5 4v3c2.5 3 12.5 3 15 3z"/></g><path d="M25 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 1 1 5 0z" fill="#fff" stroke="#000" stroke-width="1.5"/></svg>',
        'w-q': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 45 45"><path d="M8 12l4 18h21l4-18-7 10-6-13-6 13-7-10z" fill="#fff" stroke="#000" stroke-width="1.5"/></svg>',
        'w-k': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 45 45"><path d="M22.5 11.5V6M20 9h5" fill="none" stroke="#000" stroke-width="1.5"/><path d="M22.5 25c4.5 0 7.5-3.5 6-7.5-1.5-4-4.5-4-6-4s-4.5 0-6 4c-1.5 4 1.5 7.5 6 7.5z" fill="#fff" stroke="#000" stroke-width="1.5"/></svg>',

        'b-p': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 45 45"><path d="M22.5 9c-2.21 0-4 1.79-4 4 0 .89.32 1.7.9 2.3-2 .7-3.5 2.5-3.5 4.7 0 1.1.31 2.1.84 3-1.34 1.15-2.2 2.85-2.2 4.7 0 2.22 1.48 4.12 3.5 4.7v2.3H15v3h15v-3h-2.2v-2.3c2.02-.58 3.5-2.48 3.5-4.7 0-1.85-.86-3.55-2.2-4.7.53-.9.84-1.9.84-3 0-2.2-1.5-4-3.5-4.7.58-.6.9-1.41.9-2.3 0-2.21-1.79-4-4-4z" fill="#000" stroke="#fff" stroke-width="1.5"/></svg>',
        'b-r': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 45 45"><path d="M9 39h27v-3H9v3zm3-3v-4h21v4H12zm-1-6h23v-2H11v2zm2-4h19v-7H13v7zm1-9h17V11H14v6zm2-8h13V9H16v2z" fill="#000" stroke="#fff" stroke-width="1.5"/></svg>',
        'b-n': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 45 45"><path d="M22 10c10.5 1 16.5 8 16 29H15c0-9 10-6.5 8-21z" fill="#000" stroke="#fff" stroke-width="1.5"/></svg>',
        'b-b': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 45 45"><g fill="none" stroke="#fff" stroke-width="1.5"><path d="M9 36c3.39-.97 10.11 0 13.5-3 3.39 3 10.11 2.03 13.5 3H9z"/><path d="M15 32c2.5 0 12.5 0 15-3v-3c0-2.5-2.5-4-2.5-4 0-1.5 1-2 1-3.5 0-2-1.5-3-3-3s-3 1-3 3c0 1.5 1 2 1 3.5 0 0-2.5 1.5-2.5 4v3c2.5 3 12.5 3 15 3z"/></g><path d="M25 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 1 1 5 0z" fill="#000" stroke="#fff" stroke-width="1.5"/></svg>',
        'b-q': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 45 45"><path d="M8 12l4 18h21l4-18-7 10-6-13-6 13-7-10z" fill="#000" stroke="#fff" stroke-width="1.5"/></svg>',
        'b-k': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 45 45"><path d="M22.5 11.5V6M20 9h5" fill="none" stroke="#fff" stroke-width="1.5"/><path d="M22.5 25c4.5 0 7.5-3.5 6-7.5-1.5-4-4.5-4-6-4s-4.5 0-6 4c-1.5 4 1.5 7.5 6 7.5z" fill="#000" stroke="#fff" stroke-width="1.5"/></svg>'
    };

    const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
    const ranks = ['8', '7', '6', '5', '4', '3', '2', '1'];
    const pieceValues = { p: 1, n: 3, b: 3, r: 5, q: 9, k: 0 };
    const pieceSymbols = { p: '♟', n: '♞', b: '♝', r: '♜', q: '♛', k: '♚' };

    return {
        renderBoard: (lastMove = null) => {
            const boardEl = document.getElementById('board');
            if (!boardEl) return;
            boardEl.innerHTML = '';

            for (let r = 0; r < 8; r++) {
                for (let c = 0; c < 8; c++) {
                    const squareName = files[c] + ranks[r];
                    const sqEl = document.createElement('div');
                    sqEl.className = `square ${(r + c) % 2 === 0 ? 'light' : 'dark'}`;
                    sqEl.dataset.square = squareName;

                    // Файл (a-h) — только на нижней строке, в правом нижнем углу
                    if (r === 7) {
                        const coord = document.createElement('span');
                        coord.className = 'square-coord file';
                        coord.textContent = files[c];
                        sqEl.appendChild(coord);
                    }
                    // Ранг (1-8) — только на левой колонке, в левом верхнем углу
                    if (c === 0) {
                        const coord = document.createElement('span');
                        coord.className = 'square-coord rank';
                        coord.textContent = ranks[r];
                        sqEl.appendChild(coord);
                    }

                    if (lastMove && (lastMove.from === squareName || lastMove.to === squareName)) {
                        sqEl.classList.add('last-move');
                    }

                    const piece = ChessEngine.get(squareName);
                    if (piece) {
                        const pEl = document.createElement('div');
                        pEl.className = 'piece';
                        const key = `${piece.color}-${piece.type}`;
                        if (pieceSVGs[key]) {
                            pEl.style.backgroundImage = `url('${pieceSVGs[key]}')`;
                        }
                        sqEl.appendChild(pEl);
                    }

                    boardEl.appendChild(sqEl);
                }
            }

            // Индикатор шаха
            if (ChessEngine.inCheck()) {
                const turn = ChessEngine.turn();
                const board = ChessEngine.board();
                for (let r = 0; r < 8; r++) {
                    for (let c = 0; c < 8; c++) {
                        const p = board[r][c];
                        if (p && p.type === 'k' && p.color === turn) {
                            const sq = boardEl.querySelector(`[data-square="${files[c]}${ranks[r]}"]`);
                            if (sq) sq.classList.add('in-check');
                        }
                    }
                }
            }
        },

        updateUIInfo: () => {
            const statusEl = document.getElementById('status');
            const tickerEl = document.getElementById('moves-ticker');
            if (!statusEl) return;

            // --- Статус ---
            let statusText;
            if (ChessEngine.inCheckmate()) {
                statusText = `Мат! Победили ${ChessEngine.turn() === 'w' ? 'Чёрные' : 'Белые'}`;
            } else if (ChessEngine.inStalemate()) {
                statusText = 'Пат! Ничья';
            } else if (ChessEngine.inDraw()) {
                statusText = 'Ничья!';
            } else {
                const turn = ChessEngine.turn() === 'w' ? 'Белые' : 'Чёрные';
                statusText = `Ход: ${turn}` + (ChessEngine.inCheck() ? ' (Шах!)' : '');
            }
            statusEl.textContent = statusText;

            // --- История, материал и взятые фигуры ---
            const verboseHistory = ChessEngine.history({ verbose: true });

            let whiteScore = 0, blackScore = 0;
            const capturedBlack = [];
            const capturedWhite = [];

            verboseHistory.forEach(m => {
                if (!m.captured) return;
                if (m.color === 'w') {
                    whiteScore += pieceValues[m.captured];
                    capturedBlack.push(m.captured);
                } else {
                    blackScore += pieceValues[m.captured];
                    capturedWhite.push(m.captured);
                }
            });

            const diffEl = document.getElementById('material-diff');
            if (diffEl) {
                const diff = whiteScore - blackScore;
                diffEl.textContent = diff === 0 ? '' : (diff > 0 ? `+${diff}` : `${diff}`);
            }

            const capturedEl = document.getElementById('captured-icons');
            if (capturedEl) {
                const sortByValue = arr => arr.slice().sort((a, b) => pieceValues[b] - pieceValues[a]);
                capturedEl.textContent =
                    sortByValue(capturedBlack).map(t => pieceSymbols[t]).join('') +
                    sortByValue(capturedWhite).map(t => pieceSymbols[t]).join('');
            }

            // --- Тикер ---
            if (tickerEl) {
                tickerEl.innerHTML = '';
                const sanHistory = verboseHistory.map(m => m.san);
                for (let i = 0; i < sanHistory.length; i += 2) {
                    const item = document.createElement('div');
                    item.className = 'move-item';
                    item.textContent = `${(i / 2) + 1}. ${sanHistory[i]} ${sanHistory[i + 1] || ''}`;
                    tickerEl.appendChild(item);
                }
                tickerEl.scrollLeft = tickerEl.scrollWidth;
            }
        },

        highlightSquares: (selectedSquare, targetSquares) => {
            document.querySelectorAll('.square').forEach(sq => {
                sq.classList.remove('selected', 'legal-target', 'legal-capture');
            });
            if (selectedSquare) {
                const sq = document.querySelector(`[data-square="${selectedSquare}"]`);
                if (sq) sq.classList.add('selected');
            }
            if (Array.isArray(targetSquares)) {
                targetSquares.forEach(sqName => {
                    const sq = document.querySelector(`[data-square="${sqName}"]`);
                    if (!sq) return;
                    const hasPiece = !!sq.querySelector('.piece');
                    sq.classList.add(hasPiece ? 'legal-capture' : 'legal-target');
                });
            }
        },

        showPromotionDialog: (color, callback) => {
            const modal = document.getElementById('promotion-modal');
            const optionsBox = document.getElementById('promo-options');
            if (!modal || !optionsBox) return;

            optionsBox.innerHTML = '';
            ['q', 'r', 'b', 'n'].forEach(p => {
                const btn = document.createElement('div');
                btn.className = 'promo-piece';
                const code = `${color}-${p}`;
                if (pieceSVGs[code]) {
                    btn.style.backgroundImage = `url('${pieceSVGs[code]}')`;
                }
                btn.onclick = (e) => {
                    e.stopPropagation();
                    modal.style.display = 'none';
                    callback(p);
                };
                optionsBox.appendChild(btn);
            });

            modal.onclick = (e) => {
                if (e.target === modal) {
                    modal.style.display = 'none';
                    callback(null);
                }
            };
            modal.style.display = 'flex';
        }
    };
})();