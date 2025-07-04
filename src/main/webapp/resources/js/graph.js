// graph.js
export class GraphDrawer {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.canvas.width = 400;
        this.canvas.height = 400;
        this.center = { x: this.canvas.width / 2, y: this.canvas.height / 2 };
        this.baseScale = this.canvas.width / 3;
        this.currentR = null; // Будем хранить текущий R здесь
        this.currentPoint = null; // Будем хранить текущую отрисованную точку
    }

    // Метод для обновления текущего R
    setCurrentR(r) {
        this.currentR = r;
    }

    // Метод для обновления текущей отрисованной точки
    setCurrentPoint(point) {
        this.currentPoint = point;
    }

    drawGraph(r = null) {
        this.setCurrentR(r); // Обновляем R в классе
        const width = this.canvas.width;
        const height = this.canvas.height;
        const center = this.center;
        const baseScale = this.baseScale;
        const ctx = this.ctx;

        ctx.clearRect(0, 0, width, height); // Полная очистка канваса

        // Оси
        ctx.beginPath();
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 3;

        ctx.moveTo(0, center.y);
        ctx.lineTo(width, center.y);

        ctx.moveTo(center.x, 0);
        ctx.lineTo(center.x, height);

        // Стрелки на осях
        ctx.moveTo(width, center.y);
        ctx.lineTo(width - 25, center.y - 12);
        ctx.moveTo(width, center.y);
        ctx.lineTo(width - 25, center.y + 12);

        ctx.moveTo(center.x, 0);
        ctx.lineTo(center.x - 12, 25);
        ctx.moveTo(center.x, 0);
        ctx.lineTo(center.x + 12, 25);

        ctx.stroke();

        ctx.font = '20px Arial';
        ctx.fillStyle = '#000';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        // Метки R на осях
        const displayR = (this.currentR !== null) ? this.currentR : 'R';
        const displayRHalf = (this.currentR !== null) ? (this.currentR / 2).toString() : 'R/2';
        const displayRNegHalf = (this.currentR !== null) ? (-this.currentR / 2).toString() : '-R/2';
        const displayRNeg = (this.currentR !== null) ? (-this.currentR).toString() : '-R';

        // Метки по X
        ctx.fillText(displayR, center.x + baseScale, center.y + 30);
        ctx.fillText(displayRHalf, center.x + baseScale / 2, center.y + 30);
        ctx.fillText(displayRNegHalf, center.x - baseScale / 2, center.y + 30);
        ctx.fillText(displayRNeg, center.x - baseScale, center.y + 30);

        // Метки по Y
        ctx.fillText(displayR, center.x - 30, center.y - baseScale);
        ctx.fillText(displayRHalf, center.x - 30, center.y - baseScale / 2);
        ctx.fillText(displayRNegHalf, center.x - 30, center.y + baseScale / 2);
        ctx.fillText(displayRNeg, center.x - 30, center.y + baseScale);


        // Фигуры
        ctx.fillStyle = 'rgba(0, 0, 255, 0.3)';

        // Прямоугольник (квадрат по R/2)
        ctx.fillRect(
            center.x,
            center.y - baseScale / 2, // верхняя граница Y = R/2
            baseScale, // ширина = R
            baseScale / 2 // высота = R/2
        );

        // Треугольник
        ctx.beginPath();
        ctx.moveTo(center.x, center.y);
        ctx.lineTo(center.x - baseScale / 2, center.y); // X = -R/2
        ctx.lineTo(center.x, center.y - baseScale / 2); // Y = R/2
        ctx.closePath();
        ctx.fill();

        // Круг (четверть)
        ctx.beginPath();
        ctx.arc(center.x, center.y, baseScale / 2, 0, Math.PI / 2, false); // Радиус R/2
        ctx.lineTo(center.x, center.y);
        ctx.closePath();
        ctx.fill();

        // Перерисовываем текущую точку, если она есть
        if (this.currentPoint) {
            this.drawPoint(this.currentPoint.x, this.currentPoint.y, this.currentPoint.isHit);
        }
    }

    drawPoint(x, y, isHit) {
        if (this.currentR === null) {
            console.warn("Can't draw point without R value.");
            return;
        }

        const center = this.center;
        const baseScale = this.baseScale;
        const ctx = this.ctx;

        const scaledX = (x * baseScale) / this.currentR;
        const scaledY = (y * baseScale) / this.currentR;

        ctx.beginPath();
        ctx.arc(
            center.x + scaledX,
            center.y - scaledY,
            8, // Радиус точки
            0,
            Math.PI * 2
        );
        ctx.fillStyle = isHit ? 'green' : 'red';
        ctx.fill();
    }

    // Метод для очистки только динамических элементов (линий и точек)
    clearDynamicElements() {
        // Просто перерисовываем весь график, это самый простой способ
        // Но чтобы не моргало, будем использовать буфер
        this.drawGraph(this.currentR); // Перерисовываем фигуры и оси
    }

    // Метод для рисования линий по координатам мыши
    drawMouseLines(mouseX, mouseY, displayX, displayY) {
        this.clearDynamicElements(); // Очищаем старые линии и точки

        const ctx = this.ctx;
        const center = this.center;
        const canvas = this.canvas;

        // Рисуем линии
        ctx.beginPath();
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.5)'; // Полупрозрачные линии
        ctx.lineWidth = 1;

        // Вертикальная линия (X)
        ctx.moveTo(mouseX, 0);
        ctx.lineTo(mouseX, canvas.height);

        // Горизонтальная линия (Y)
        ctx.moveTo(0, mouseY);
        ctx.lineTo(canvas.width, mouseY);
        ctx.stroke();

        // Отображаем значения X и Y рядом с курсором
        ctx.font = '14px Arial';
        ctx.fillStyle = '#000';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'bottom';

        ctx.fillText(`X: ${displayX.toFixed(2)}`, mouseX + 10, mouseY - 10);
        ctx.fillText(`Y: ${displayY.toFixed(2)}`, mouseX + 10, mouseY + 20);

        // Перерисовываем последнюю точку, чтобы она была поверх линий
        if (this.currentPoint) {
            this.drawPoint(this.currentPoint.x, this.currentPoint.y, this.currentPoint.isHit);
        }
    }

    // Метод для очистки только линий мыши (вызывается при mouseout)
    clearMouseLines() {
        this.clearDynamicElements(); // Просто перерисовываем график, чтобы убрать линии
    }

    // Метод для преобразования координат канваса в координаты графика
    canvasToGraphCoords(canvasX, canvasY) {
        const x = (canvasX - this.center.x) / this.baseScale * this.currentR;
        const y = (this.center.y - canvasY) / this.baseScale * this.currentR;
        return { x, y };
    }
}
