document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('graphCanvas');
    const ctx = canvas.getContext('2d');
    const submitBtn = document.getElementById('submit-btn');
    const resultsList = document.getElementById('results-list');

    // Set canvas size
    canvas.width = 400;
    canvas.height = 400;

    // Store all results and current point
    let allResults = [];
    let currentPoint = null;
    let currentR = null;
    // Добавляем валидацию ввода для X
    const xInput = document.getElementById('x-input');
    xInput.addEventListener('input', function(e) {
        // Ограничение на длину ввода (5 символов)
        if (this.value.length > 5) {
            this.value = this.value.substring(0, 5);
            return;
        }

        this.value = this.value.replace(/[^0-9.-]/g, '');
        // Проверяем, чтобы была только одна точка
        if ((this.value.match(/\./g) || []).length > 1) {
            this.value = this.value.substring(0, this.value.lastIndexOf('.'));
        }
        // Проверяем, чтобы минус был только в начале
        if (this.value.indexOf('-') > 0) {
            this.value = this.value.replace(/-/g, '');
        }
    });

// Добавляем валидацию ввода для R
    const rInput = document.getElementById('r-input');
    rInput.addEventListener('input', function(e) {
        // Ограничение на длину ввода (5 символов)
        if (this.value.length > 5) {
            this.value = this.value.substring(0, 5);
            return;
        }

        this.value = this.value.replace(/[^0-9.]/g, '');
        // Проверяем, чтобы была только одна точка
        if ((this.value.match(/\./g) || []).length > 1) {
            this.value = this.value.substring(0, this.value.lastIndexOf('.'));
        }
    });

    // Load history from server on page load
    fetch('http://localhost:8080/lab2WEB3231202_war_exploded/main-servlet', {
        method: 'GET',
        headers: {
            'Accept': 'application/json'
        }
    })
        .then(response => response.json())
        .then(history => {
            if (history && history.length > 0) {
                // Add all history items to results table
                history.forEach(point => {
                    addResultToTable({
                        x: point.x,
                        y: point.y,
                        r: point.r,
                        isHit: point.hitStatus,
                        timeNow: point.timeStart,
                        executionTime: point.executionTime
                    });

                    // Add to allResults for potential graph drawing
                    allResults.push({
                        x: point.x,
                        y: point.y,
                        r: point.r,
                        isHit: point.hitStatus,
                        timeNow: point.timestart,
                        executionTime: point.executionTime
                    });
                });

                // If there's a current R value, draw the graph with the last point
                if (currentR) {
                    drawGraph(currentR);
                }
            }
        })
        .catch(error => {
            console.error('Error loading history:', error);
        });






    function drawGraph(r = null) {
        const width = canvas.width;
        const height = canvas.height;
        const center = { x: width / 2, y: height / 2 };
        const baseScale = width / 3;

        // Clear canvas
        ctx.clearRect(0, 0, width, height);

        // Draw axes
        ctx.beginPath();
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 3;

        // X axis
        ctx.moveTo(0, center.y);
        ctx.lineTo(width, center.y);

        // Y axis
        ctx.moveTo(center.x, 0);
        ctx.lineTo(center.x, height);

        // Draw arrows
        ctx.moveTo(width, center.y);
        ctx.lineTo(width - 25, center.y - 12);
        ctx.moveTo(width, center.y);
        ctx.lineTo(width - 25, center.y + 12);

        ctx.moveTo(center.x, 0);
        ctx.lineTo(center.x - 12, 25);
        ctx.moveTo(center.x, 0);
        ctx.lineTo(center.x + 12, 25);

        ctx.stroke();

        // Draw labels
        ctx.font = '20px Arial';
        ctx.fillStyle = '#000';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        // X axis labels
        if (r === null) {
            ctx.fillText('R', center.x + baseScale, center.y + 30);
            ctx.fillText('R/2', center.x + baseScale/2, center.y + 30);
            ctx.fillText('-R/2', center.x - baseScale/2, center.y + 30);
            ctx.fillText('-R', center.x - baseScale, center.y + 30);
        } else {
            ctx.fillText(r.toString(), center.x + baseScale, center.y + 30);
            ctx.fillText((r/2).toString(), center.x + baseScale/2, center.y + 30);
            ctx.fillText((-r/2).toString(), center.x - baseScale/2, center.y + 30);
            ctx.fillText((-r).toString(), center.x - baseScale, center.y + 30);
        }

        // Y axis labels
        if (r === null) {
            ctx.fillText('R', center.x - 30, center.y - baseScale);
            ctx.fillText('R/2', center.x - 30, center.y - baseScale/2);
            ctx.fillText('-R/2', center.x - 30, center.y + baseScale/2);
            ctx.fillText('-R', center.x - 30, center.y + baseScale);
        } else {
            ctx.fillText(r.toString(), center.x - 30, center.y - baseScale);
            ctx.fillText((r/2).toString(), center.x - 30, center.y - baseScale/2);
            ctx.fillText((-r/2).toString(), center.x - 30, center.y + baseScale/2);
            ctx.fillText((-r).toString(), center.x - 30, center.y + baseScale);
        }

        // Draw shapes
        ctx.fillStyle = 'rgba(0, 0, 255, 0.3)';

        // Rectangle
        ctx.fillRect(
            center.x,
            center.y - baseScale/2,
            baseScale,
            baseScale/2
        );

        // Triangle
        ctx.beginPath();
        ctx.moveTo(center.x, center.y);
        ctx.lineTo(center.x - baseScale/2, center.y);
        ctx.lineTo(center.x, center.y - baseScale/2);
        ctx.closePath();
        ctx.fill();

        // Quarter circle
        ctx.beginPath();
        ctx.arc(center.x, center.y, baseScale/2, 0, Math.PI / 2, false);
        ctx.lineTo(center.x, center.y);
        ctx.closePath();
        ctx.fill();

        // Draw only the current point if it exists and matches the current R
        if (currentPoint && r !== null && currentPoint.r === r) {
            drawPoint(currentPoint.x, currentPoint.y, currentPoint.isHit, r);
        }
    }

    function drawPoint(x, y, isHit, currentR) {
        const center = { x: canvas.width / 2, y: canvas.height / 2 };
        const baseScale = canvas.width / 3;

        const scaledX = (x * baseScale) / currentR;
        const scaledY = (y * baseScale) / currentR;

        ctx.beginPath();
        ctx.arc(
            center.x + scaledX,
            center.y - scaledY,
            8,
            0,
            Math.PI * 2
        );
        ctx.fillStyle = isHit ? 'green' : 'red';
        ctx.fill();
    }

    let notificationContainer = document.getElementById('notification-container');
    if (!notificationContainer) {
        notificationContainer = document.createElement('div');
        notificationContainer.id = 'notification-container';
        notificationContainer.style.position = 'fixed';
        notificationContainer.style.top = '20px';
        notificationContainer.style.right = '20px';
        notificationContainer.style.zIndex = '1000';
        document.body.appendChild(notificationContainer);
    }

    function showNotification(message, isError = true) {
        const notification = document.createElement('div');
        notification.textContent = message;
        notification.style.padding = '10px 15px';
        notification.style.marginBottom = '10px';
        notification.style.borderRadius = '4px';
        notification.style.color = 'white';
        notification.style.backgroundColor = isError ? '#f44336' : '#4CAF50';
        notification.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
        notification.style.animation = 'fadeIn 0.3s';

        notificationContainer.appendChild(notification);

        // Удаляем уведомление через 3 секунды
        setTimeout(() => {
            notification.style.animation = 'fadeOut 0.3s';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    function validateInputs() {
        const x = parseFloat(document.getElementById('x-input').value);
        const y = document.querySelector('input[name="y-value"]:checked')?.value;
        const r = parseFloat(document.getElementById('r-input').value);

        // Проверка X
        if (isNaN(x) || x < -3 || x > 3) {
            showNotification('Введите X в промежутке от -3 до 3');
            return null;
        }

        // Проверка Y
        if (!y) {
            showNotification('Пожалуйста выберите Y');
            return null;
        }

        const yNum = parseFloat(y);
        if (isNaN(yNum) || (y != -2 && y != -1.5 && y != -1 && y != -0.5 && y != 0 && y != 0.5 && y != 1 && y != 1.5 && y != 2)) {
            showNotification('Баловаться запрещено!, выберите подходящий Y');
            // Дополнительно можно сбросить выбранное значение
            if (yInput) yInput.checked = false;
            return null;
        }

        // Проверка R
        if (isNaN(r) || r < 2 || r > 5) {
            showNotification('Введите R в промежутке от 2 до 5');
            return null;
        }

        return { x, y: parseFloat(y), r };
    }

// Добавляем CSS анимации
    const style = document.createElement('style');
    style.textContent = `
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(-10px); }
        to { opacity: 1; transform: translateY(0); }
    }
    @keyframes fadeOut {
        from { opacity: 1; transform: translateY(0); }
        to { opacity: 0; transform: translateY(-10px); }
    }
`;
    document.head.appendChild(style);

    function parseDateTime(dateTimeArray) {
        if (!Array.isArray(dateTimeArray) || dateTimeArray.length < 7) {
            console.error('Invalid date format:', dateTimeArray);
            return {
                year: 'NaN',
                month: 'NaN',
                day: 'NaN',
                hours: 'NaN',
                minutes: 'NaN',
                seconds: 'NaN'
            };
        }

        return {
            year: dateTimeArray[0],
            month: dateTimeArray[1],
            day: dateTimeArray[2],
            hours: dateTimeArray[3],
            minutes: dateTimeArray[4],
            seconds: dateTimeArray[5],
            nanoseconds: dateTimeArray[6]
        };
    }

    function addResultToTable(point) {
        const tbody = document.querySelector('#results-table tbody');
        const row = document.createElement('tr');

        // Устанавливаем цвет фона
        row.style.backgroundColor = point.isHit ? 'rgba(0, 255, 0, 0.1)' : 'rgba(255, 0, 0, 0.1)';

        // Создаем ячейки с более компактными данными
        const createCell = (content, className = '') => {
            const cell = document.createElement('td');
            cell.textContent = content;
            if (className) cell.className = className;
            return cell;
        };

        // X, Y, R
        row.appendChild(createCell(point.x));
        row.appendChild(createCell(point.y));
        row.appendChild(createCell(point.r));

        // Result
        const resultCell = createCell(point.isHit ? 'Попал' : 'Промах', point.isHit ? 'hit' : 'miss');
        row.appendChild(resultCell);

        // Time components
        const timeParts = parseDateTime(point.timeNow);

        // Year, Month, Day, Hours, Minutes, Seconds
        row.appendChild(createCell(timeParts.year, 'time-cell'));
        row.appendChild(createCell(timeParts.month, 'time-cell'));
        row.appendChild(createCell(timeParts.day, 'time-cell'));
        row.appendChild(createCell(timeParts.hours, 'time-cell'));
        row.appendChild(createCell(timeParts.minutes, 'time-cell'));
        row.appendChild(createCell(timeParts.seconds, 'time-cell'));

        // Execution Time
        const execTime = point.executionTime / 1000000000;
        row.appendChild(createCell(execTime.toFixed(5), 'time-cell'));

        tbody.insertBefore(row, tbody.firstChild);
    }

    submitBtn.addEventListener('click', () => {
        const values = validateInputs();
        if (!values) return;

        const { x, y, r } = values;
        currentR = r;

        const data = {
            x: values.x,
            y: values.y,
            r: values.r
        };

        fetch('http://localhost:8080/lab2WEB3231202_war_exploded/main-servlet', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data),
        })
            .then(response => response.json())
            .then(data => {
                console.log('Успех:', data);

                const isHit = data.hitStatus;
                const timeNow = data.timeStart;
                const executionTime = data.executionTime;

                currentPoint = {
                    x,
                    y,
                    r,
                    isHit,
                    timeNow,
                    executionTime
                };

                allResults.push(currentPoint);

                // Redraw graph with current point
                drawGraph(r);

                // Add to results table
                addResultToTable(currentPoint);
            })
            .catch((error) => {
                console.error('Ошибка:', error);
                showNotification('Сервер недоступен, извините')
            });
    });

    const clearBtn = document.getElementById('clear-btn');

    clearBtn.addEventListener('click', () => {
        fetch('http://localhost:8080/lab2WEB3231202_war_exploded/clear-servlet', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(response => response.json())
            .then(data => {
                console.log('Успешная очистка:', data);
                // Очищаем таблицу
                document.querySelector('#results-table tbody').innerHTML = '';
                // Очищаем массив результатов
                allResults = [];
                // Перерисовываем график без точек
                drawGraph(currentR);

                // Показываем уведомление об успешной очистке
                showNotification(data.message, false);
            })
            .catch(error => {
                console.error('Ошибка при очистке:', error);
                showNotification('Ошибка при очистке результатов');
            });
    });

    // Initial graph draw with no R value
    drawGraph(null);
});
//этот js чисто для запаски вдруг модульные отвалятся(((
