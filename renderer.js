                    const piece = board[r][c];
                    if (piece) {
                        const pEl = document.createElement('div');
                        pEl.className = 'piece';
                        
                        // Точно формируем ключ для белых (например, 'wP') и черных (например, 'bP') фигур
                        const colorPrefix = piece.color; // 'w' или 'b'
                        const typeLetter = piece.type.toUpperCase(); // 'P', 'N', 'B', 'R', 'Q', 'K'
                        const key = colorPrefix + typeLetter;
                        
                        if (pieceSVGs[key]) {
                            pEl.style.backgroundImage = `url("${pieceSVGs[key]}")`;
                        }
                        sqEl.appendChild(pEl);
                    }
