/* ==========================================================
   МОДУЛЬ ВИЗУАЛИЗАЦИИ И РЕНДЕРИНГА (renderer.js)
   ========================================================== */

const BoardRenderer = (() => {
    const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
    const ranks = ['8', '7', '6', '5', '4', '3', '2', '1'];
    const boardEl = document.getElementById('board');

    // Кеш SVG-иконок фигур (высокое качество и мгновенная загрузка)
    const pieceSVGs = {
        'wP': 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 45 45"><path d="M22.5 9c-2.21 0-4 1.79-4 4 0 .89.3 1.7.8 2.2C17.5 17.5 15 21.2 15 26c0 2.9 1.1 5.5 3 7.5V36c0 1.1.9 2 2 2h5c1.1 0 2-.9 2-2v-2.5c1.9-2 3-4.6 3-7.5 0-4.8-2.5-8.5-4.3-10.8.5-.5.8-1.3.8-2.2 0-2.21-1.79-4-4-4z" fill="#fff" stroke="#000" stroke-width="1.5"/></svg>',
        'wN': 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 45 45"><path d="M22 10c1.5 0 3 .5 4 1.5l-3 3-2-1.5 1-3zM16 14c-1 0-2 1-2 2 0 .5.2 1 .5 1.5L13 21l3 1 2-2 3 3-1 2-3-1-2 2 2 3h4l2-3 2 1 1-3-3-3 2-2-1-4-3-1-1-2h-3z" fill="#fff" stroke="#000" stroke-width="1.5"/></svg>',
        'wB': 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 45 45"><path d="M22.5 9c-2.5 0-4.5 2-4.5 4.5 0 1.2.5 2.3 1.2 3.1-2.2 1.9-3.7 4.7-3.7 7.9 0 3.1 1.2 5.9 3.2 8h7.6c2-2.1 3.2-4.9 3.2-8 0-3.2-1.5-6-3.7-7.9.7-.8 1.2-1.9 1.2-3.1 0-2.5-2-4.5-4.5-4.5z" fill="#fff" stroke="#000" stroke-width="1.5"/></svg>',
        'wR': 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 45 45"><path d="M14 14h3v3h-3v-3zm7 0h3v3h-3v-3zm7 0h3v3h-3v-3zM15 19h15v3H15v-3zm1 4h13v15H16V23z" fill="#fff" stroke="#000" stroke-width="1.5"/></svg>',
        'wQ': 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 45 45"><path d="M9 13l4 8 4-8 4 8 4-8 4 8 4-8v5H9v-5zM12 22h21v14H12V22z" fill="#fff" stroke="#000" stroke-width="1.5"/></svg>',
        'wK': 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 45 45"><path d="M22.5 11v6m-3-3h6M20 18h5v5h-5v-5zm-3 7h11v11H17V25z" fill="#fff" stroke="#000" stroke-width="1.5"/></svg>',
        'bP': 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 45 45"><path d="M22.5 9c-2.21 0-4 1.79-4 4 0 .89.3 1.7.8 2.2C17.5 17.5 15 21.2 15 26c0 2.9 1.1 5.5 3 7.5V36c0 1.1.9 2 2 2h5c1.1 0 2-.9 2-2v-2.5c1.9-2 3-4.6 3-7.5 0-4.8-2.5-8.5-4.3-10.8.5-.5.8-1.3.8-2.2 0-2.21-1.79-4-4-4z" fill="#000" stroke="#fff" stroke-width="1.5"/></svg>',
        'bN': 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 45 45"><path d="M22 10c1.5 0 3 .5 4 1.5l-3 3-2-1.5 1-3zM16 14c-1 0-2 1-2 2 0 .5.2 1 .5 1.5L13 21l3 1 2-2 3 3-1 2-3-1-2 2 2 3h4l2-3 2 1 1-3-3-3 2-2-1-4-3-1-1-2h-3z" fill="#000" stroke="#fff" stroke-width="1.5"/></svg>',
        'bB': 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 45 45"><path d="M22.5 9c-2.5 0-4.5 2-4.5 4.5 0 1.2.5 2.3 1.2 3.1-2.2 1.9-3.7 4.7-3.7 7.9 0 3.1 1.2 5.9 3.2 8h7.6c2-2.1 3.2-4.9 3.2-8 0-3.2-1.5-6-3.7-7.9.7-.8 1.2-1.9 1.2-3.1 0-2.5-2-4.5-4.5-4.5z" fill="#000" stroke="#fff" stroke-width="1.5"/></svg>',
        'bR': 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 45 45"><path d="M14 14h3v3h-3v-3zm7 0h3v3h-3v-3zm7 0h3v3h-3v-3zM15 19h15v3H15v-3zm1 4h13v15H16V23z" fill="#000" stroke="#fff" stroke-width="1.5"/></svg>',
        'bQ': 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 45 45"><path d="M9 13l4 8 4-8 4 8 4-8 4 8 4-8v5H9v-5zM12 22h21v14H12V22z" fill="#000" stroke="#fff" stroke-width="1.5"/></svg>',
        'bK': 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 45 45"><path d="M22.5 11v6m-3-3h6M20 18h5v5h-5v-5zm-3 7h11v11H17V25z" fill="#000" stroke="#fff" stroke-width="1.5"/></svg>'
    };

    return {
        // Создание сетки доски один раз
        initGrid: (onSquareClick) => {
            boardEl.innerHTML = '';
            for (let r = 0; r < 8; r++) {
                for (let c = 0; c < 8; c++) {
                    const squareEl = document.createElement('div');
                    const sqCoord = files[c] + ranks[r];
                    squareEl.className = `square ${(r + c) % 2 === 0 ? 'light' : 'dark'}`;
                    squareEl.dataset.square = sqCoord;
                    
                    squareEl.onclick = () => onSquareClick(sqCoord);
                    boardEl.appendChild(squareEl);
                }
            }
        },

        // Рендер доски, клеток, выделений и фигур
        renderBoardState: (boardState, selectedSquare, legalMoves, lastMove) => {
            const squares = boardEl.children;
            for (let r = 0; r < 8; r++) {
                for (let c = 0; c < 8; c++) {
                    const idx = r * 8 + c;
                    const sqEl = squares[idx];
                    const sqCoord = files[c] + ranks[r];
                    
                    // Базовый класс клетки
                    sqEl.className = `square ${(r + c) % 2 === 0 ? 'light' : 'dark'}`;
                    
                    // Подсветка последнего хода
                    if (lastMove && (lastMove.from === sqCoord || lastMove.to === sqCoord)) {
                        sqEl.classList.add('last-move');
                    }
                    // Подсветка выбранной фигуры
                    if (selectedSquare === sqCoord) {
                        sqEl.classList.add('selected');
                    }

                    // Подсветка доступных ходов / взятий
                    const legal = legalMoves.find(m => m.to === sqCoord);
                    if (legal) {
                        sqEl.classList.add(boardState[r][c] ? 'legal-capture' : 'legal-target');
                    }

                    // Очищаем и заново добавляем контент клетки (координаты + фигура)
                    sqEl.innerHTML = '';

                    // Буквы/цифры координат на краях доски
                    let coordText = '';
                    if (r === 7) coordText += files[c];
                    if (c === 7) coordText += ranks[r];
                    if (coordText) {
                        const coordEl = document.createElement('span');
                        coordEl.className = 'square-coord';
                        coordEl.textContent = coordText;
                        sqEl.appendChild(coordEl);
                    }

                    // Отрисовка фигуры
                    const piece = boardState[r][c];
                    if (piece) {
                        const pieceEl = document.createElement('div');
                        pieceEl.className = 'piece';
                        const key = piece.color + piece.type.toUpperCase();
                        pieceEl.style.backgroundImage = `url("${pieceSVGs[key]}")`;
                        sqEl.appendChild(pieceEl);
                    }
                }
            }
        },

        // Обновление строки состояния и материала
        updateUIInfo: (game) => {
            const statusEl = document.getElementById('status');
            const materialDiffEl = document.getElementById('material-diff');
            const capturedIconsEl = document.getElementById('captured-icons');
            const tickerEl = document.getElementById('moves-ticker');

            // Текст статуса
            if (game.inCheckmate()) {
                statusEl.textContent = `Мат! Победили ${game.turn() === 'w' ? 'Черные' : 'Белые'} 🎉`;
            } else if (game.inStalemate()) {
                statusEl.textContent = 'Ничья (Пат)!';
            } else if (game.inDraw()) {
                statusEl.textContent = 'Ничья!';
            } else {
                let turnName = game.turn() === 'w' ? 'Белые' : 'Черные';
                statusEl.textContent = `Ход: ${turnName}`;
                if (game.inCheck()) statusEl.textContent += ' (Шах!)';
            }

            // Подсчет материала (в стиле Lichess)
            const board = game.board();
            const values = { p: 1, n: 3, b: 3, r: 5, q: 9, k: 0 };
            const initialCounts = { p: 8, n: 2, b: 2, r: 2, q: 1 };
            
            let currentWhite = { p: 0, n: 0, b: 0, r: 0, q: 0 };
            let currentBlack = { p: 0, n: 0, b: 0, r: 0, q: 0 };
            let whiteScore = 0, blackScore = 0;

            board.forEach(row => {
                row.forEach(piece => {
                    if (piece) {
                        if (piece.color === 'w') {
                            whiteScore += values[piece.type];
                            if(piece.type !== 'k') currentWhite[piece.type]++;
                        } else {
                            blackScore += values[piece.type];
                            if(piece.type !== 'k') currentBlack[piece.type]++;
                        }
                    }
                });
            });

            const diff = whiteScore - blackScore;
            let diffText = '';
            let capturedSymbols = '';
            const pieceSymbols = { q: '♛', r: '♜', b: '♝', n: '♞', p: '♟' };

            if (diff > 0) {
                diffText = `+${diff}`;
                for (let type of ['q', 'r', 'b', 'n', 'p']) {
                    let missing = initialCounts[type] - currentBlack[type];
                    for(let i=0; i<missing; i++) capturedSymbols += pieceSymbols[type];
                }
            } else if (diff < 0) {
                diffText = `${diff}`;
                for (let type of ['q', 'r', 'b', 'n', 'p']) {
                    let missing = initialCounts[type] - currentWhite[type];
                    for(let i=0; i<missing; i++) capturedSymbols += pieceSymbols[type];
                }
            }

            materialDiffEl.textContent = diffText;
            capturedIconsEl.textContent = capturedSymbols;

            // Лента ходов
            const history = game.history();
            tickerEl.innerHTML = '';
            for (let i = 0; i < history.length; i += 2) {
                const moveNum = (i / 2) + 1;
                const whiteMove = history[i];
                const blackMove = history[i+1] || '';
                const item = document.createElement('div');
                item.className = 'move-item';
                item.textContent = `${moveNum}. ${whiteMove} ${blackMove}`;
                tickerEl.appendChild(item);
            }
            tickerEl.scrollLeft = tickerEl.scrollWidth;
        },

        // Окно выбора фигуры при превращении пешки
        showPromotionDialog: (color, onPieceSelected) => {
            const modal = document.getElementById('promotion-modal');
            const options = document.getElementById('promo-options');
            options.innerHTML = '';
            
            ['q', 'r', 'b', 'n'].forEach(p => {
                const pieceCode = color + p.toUpperCase();
                const div = document.createElement('div');
                div.className = 'promo-piece';
                // Используем SVG иконку для выбора
                div.innerHTML = `<div class="piece" style="width:100%;height:100%;background-image:url('${pieceSVGs[pieceCode]}')"></div>`;
                div.onclick = () => {
                    modal.style.display = 'none';
                    onPieceSelected(p);
                };
                options.appendChild(div);
            });
            modal.style.display = 'flex';
        }
    };
})();
