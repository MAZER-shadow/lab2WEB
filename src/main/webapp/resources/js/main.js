// main.js
import { GraphDrawer } from './graph.js';
import { addResultToTable, setupInputValidation, validateInputs, getPermittedYValues } from './dom-handlers.js';
import { fetchHistory, sendCoordinates, clearResults } from './api.js';
import { showNotification } from './utils.js';

document.addEventListener('DOMContentLoaded', async () => {
    // Добавляем CSS анимации для уведомлений
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

    const graphDrawer = new GraphDrawer('graphCanvas');
    const rInput = document.getElementById('r-input');
    const permittedYValues = getPermittedYValues(); // Получаем разрешенные значения Y

    // Элемент для отображения координат
    let coordsDisplay = document.getElementById('coords-display');
    if (!coordsDisplay) {
        coordsDisplay = document.createElement('div');
        coordsDisplay.id = 'coords-display';
        coordsDisplay.style.position = 'absolute';
        coordsDisplay.style.backgroundColor = 'rgba(255, 255, 255, 0.8)';
        coordsDisplay.style.padding = '5px';
        coordsDisplay.style.border = '1px solid #ccc';
        coordsDisplay.style.pointerEvents = 'none'; // Чтобы не мешал событиям мыши на канвасе
        coordsDisplay.style.display = 'none'; // Скрыт по умолчанию
        document.body.appendChild(coordsDisplay);
    }

    // Инициализация текущего R и точки из истории
    let initialR = null;
    let initialPoint = null;

    setupInputValidation();

    // Load history from server on page load
    try {
        const history = await fetchHistory();
        if (history && history.length > 0) {
            history.forEach(point => {
                addResultToTable({
                    x: point.x,
                    y: point.y,
                    r: point.r,
                    isHit: point.hitStatus,
                    timeNow: point.timeStart,
                    executionTime: point.executionTime
                });
            });
            initialR = history[history.length - 1].r;
            initialPoint = {
                x: history[history.length - 1].x,
                y: history[history.length - 1].y,
                r: history[history.length - 1].r,
                isHit: history[history.length - 1].hitStatus,
                timeNow: history[history.length - 1].timeStart,
                executionTime: history[history.length - 1].executionTime
            };
        }
    } catch (error) {
        console.error("Failed to load history:", error);
    }

    // Устанавливаем R и точку в Drawer и рисуем
    graphDrawer.setCurrentR(initialR);
    graphDrawer.setCurrentPoint(initialPoint);
    graphDrawer.drawGraph(initialR);

    // Обработчики событий для канваса
    graphDrawer.canvas.addEventListener('mousemove', (event) => {
        const currentRValue = parseFloat(rInput.value);
        if (isNaN(currentRValue) || currentRValue < 2 || currentRValue > 5) {
            // Если R не выбрано или невалидно, не показываем линии и не обновляем дисплей
            coordsDisplay.style.display = 'none';
            graphDrawer.clearMouseLines(); // Убираем любые старые линии
            return;
        }

        const rect = graphDrawer.canvas.getBoundingClientRect();
        const canvasX = event.clientX - rect.left;
        const canvasY = event.clientY - rect.top;

        // Преобразуем координаты канваса в координаты графика
        const { x: graphX, y: graphY } = graphDrawer.canvasToGraphCoords(canvasX, canvasY);

        // Для Y, находим ближайшее разрешенное значение
        const closestY = permittedYValues.reduce((prev, curr) =>
            (Math.abs(curr - graphY) < Math.abs(prev - graphY) ? curr : prev)
        );

        // Преобразуем ближайшее Y обратно в координаты канваса для рисования линии Y
        const canvasYForClosestY = graphDrawer.center.y - (closestY * graphDrawer.baseScale) / graphDrawer.currentR;

        // Рисуем линии и обновляем дисплей
        graphDrawer.drawMouseLines(canvasX, canvasYForClosestY, graphX, closestY);

        // Обновляем и показываем координаты
        coordsDisplay.style.left = `${event.clientX + 15}px`;
        coordsDisplay.style.top = `${event.clientY + 15}px`;
        coordsDisplay.textContent = `X: ${graphX.toFixed(2)}, Y: ${closestY.toFixed(2)}`;
        coordsDisplay.style.display = 'block';
    });

    graphDrawer.canvas.addEventListener('mouseout', () => {
        graphDrawer.clearMouseLines(); // Убираем линии при уходе мыши
        coordsDisplay.style.display = 'none'; // Скрываем дисплей координат
    });

    graphDrawer.canvas.addEventListener('click', async (event) => {
        const currentRValue = parseFloat(rInput.value);
        if (isNaN(currentRValue) || currentRValue < 2 || currentRValue > 5) {
            showNotification('Пожалуйста, выберите корректное значение R перед кликом на график (от 2 до 5).');
            return;
        }

        const rect = graphDrawer.canvas.getBoundingClientRect();
        const canvasX = event.clientX - rect.left;
        const canvasY = event.clientY - rect.top;

        const { x: graphX, y: graphY } = graphDrawer.canvasToGraphCoords(canvasX, canvasY);

        // Для Y, находим ближайшее разрешенное значение
        const closestY = permittedYValues.reduce((prev, curr) =>
            (Math.abs(curr - graphY) < Math.abs(prev - graphY) ? curr : prev)
        );

        // Проверяем X на валидность (от -3 до 3)
        if (graphX < -3 || graphX > 3) {
            showNotification('Значение X вне допустимого диапазона [-3, 3].');
            return;
        }

        // Отправляем данные на сервер
        const dataToSend = { x: graphX.toFixed(8), y: closestY.toFixed(1), r: currentRValue.toFixed(8) };

        try {
            const data = await sendCoordinates(dataToSend);

            const isHit = data.hitStatus;
            const timeNow = data.timeStart;
            const executionTime = data.executionTime;

            const newPoint = {
                x: parseFloat(dataToSend.x),
                y: parseFloat(dataToSend.y),
                r: parseFloat(dataToSend.r),
                isHit,
                timeNow,
                executionTime
            };

            // Обновляем текущую точку в drawer
            graphDrawer.setCurrentPoint(newPoint);
            // Если R изменилось, перерисовываем график и сбрасываем текущую точку
            if (graphDrawer.currentR !== newPoint.r) {
                graphDrawer.setCurrentR(newPoint.r);
            }
            graphDrawer.drawGraph(graphDrawer.currentR); // Полная перерисовка с новой точкой

            addResultToTable(newPoint);

        } catch (error) {
            console.error("Failed to send coordinates from canvas click:", error);
        }
    });

    // Обработчик для кнопки submit (для формы)
    const submitBtn = document.getElementById('submit-btn');
    submitBtn.addEventListener('click', async () => {
        const values = validateInputs();
        if (!values) return;

        const { x, y, r } = values;

        // Обновляем R в drawer перед отправкой
        if (graphDrawer.currentR !== r) {
            graphDrawer.setCurrentR(r);
        }

        try {
            const data = await sendCoordinates(values);

            const isHit = data.hitStatus;
            const timeNow = data.timeStart;
            const executionTime = data.executionTime;

            const newPoint = {
                x,
                y,
                r,
                isHit,
                timeNow,
                executionTime
            };

            graphDrawer.setCurrentPoint(newPoint); // Обновляем текущую точку в drawer
            graphDrawer.drawGraph(graphDrawer.currentR); // Полная перерисовка с новой точкой

            addResultToTable(newPoint);

        } catch (error) {
            console.error("Failed to send coordinates from form submit:", error);
        }
    });

    // Обработчик для кнопки очистки
    const clearBtn = document.getElementById('clear-btn');
    clearBtn.addEventListener('click', async () => {
        try {
            const data = await clearResults();
            console.log('Успешная очистка:', data);

            document.querySelector('#results-table tbody').innerHTML = '';
            graphDrawer.setCurrentPoint(null); // Очищаем текущую точку из drawer
            graphDrawer.drawGraph(graphDrawer.currentR); // Перерисовываем график без точек

            showNotification(data.message, false);
        } catch (error) {
            console.error("Failed to clear results:", error);
        }
    });

    // Обработчик изменения R-инпута
    rInput.addEventListener('input', () => {
        const newR = parseFloat(rInput.value);
        if (!isNaN(newR) && newR >= 2 && newR <= 5) {
            // Если R валидно, обновляем его в drawer и перерисовываем график
            graphDrawer.setCurrentR(newR);
            graphDrawer.drawGraph(newR);
        } else {
            // Если R невалидно, рисуем график без конкретного R
            graphDrawer.setCurrentR(null);
            graphDrawer.drawGraph(null);
        }
    });
});
