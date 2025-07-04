// dom-handlers.js
import { showNotification, parseDateTime } from './utils.js';

export function addResultToTable(point) {
    const tbody = document.querySelector('#results-table tbody');
    const row = document.createElement('tr');

    row.style.backgroundColor = point.isHit ? 'rgba(0, 255, 0, 0.1)' : 'rgba(255, 0, 0, 0.1)';

    const createCell = (content, className = '') => {
        const cell = document.createElement('td');
        cell.textContent = content;
        if (className) cell.className = className;
        return cell;
    };

    row.appendChild(createCell(point.x));
    row.appendChild(createCell(point.y));
    row.appendChild(createCell(point.r));

    const resultCell = createCell(point.isHit ? 'Попал' : 'Промах', point.isHit ? 'hit' : 'miss');
    row.appendChild(resultCell);

    const timeParts = parseDateTime(point.timeNow);

    row.appendChild(createCell(timeParts.year, 'time-cell'));
    row.appendChild(createCell(timeParts.month, 'time-cell'));
    row.appendChild(createCell(timeParts.day, 'time-cell'));
    row.appendChild(createCell(timeParts.hours, 'time-cell'));
    row.appendChild(createCell(timeParts.minutes, 'time-cell'));
    row.appendChild(createCell(timeParts.seconds, 'time-cell'));

    const execTime = point.executionTime / 1000000000;
    row.appendChild(createCell(execTime.toFixed(5), 'time-cell'));

    tbody.insertBefore(row, tbody.firstChild);
}

export function setupInputValidation() {
    const xInput = document.getElementById('x-input');
    xInput.addEventListener('input', function(e) {
        if (this.value.length > 5) {
            this.value = this.value.substring(0, 5);
            return;
        }
        this.value = this.value.replace(/[^0-9.-]/g, '');
        if ((this.value.match(/\./g) || []).length > 1) {
            this.value = this.value.substring(0, this.value.lastIndexOf('.'));
        }
        if (this.value.indexOf('-') > 0) {
            this.value = this.value.replace(/-/g, '');
        }
    });

    const rInput = document.getElementById('r-input');
    rInput.addEventListener('input', function(e) {
        if (this.value.length > 5) {
            this.value = this.value.substring(0, 5);
            return;
        }
        this.value = this.value.replace(/[^0-9.]/g, '');
        if ((this.value.match(/\./g) || []).length > 1) {
            this.value = this.value.substring(0, this.value.lastIndexOf('.'));
        }
    });
}

// Новая функция для получения разрешенных значений Y
export function getPermittedYValues() {
    // Это массив ваших разрешенных значений Y
    return [-2, -1.5, -1, -0.5, 0, 0.5, 1, 1.5, 2];
}

export function validateInputs() {
    const x = parseFloat(document.getElementById('x-input').value);
    const y = document.querySelector('input[name="y-value"]:checked')?.value;
    const r = parseFloat(document.getElementById('r-input').value);

    if (isNaN(x) || x < -3 || x > 3) {
        showNotification('Введите X в промежутке от -3 до 3');
        return null;
    }

    if (!y) {
        showNotification('Пожалуйста выберите Y');
        return null;
    }

    const yNum = parseFloat(y);
    const permittedY = getPermittedYValues();
    if (isNaN(yNum) || !permittedY.includes(yNum)) {
        showNotification('Баловаться запрещено!, выберите подходящий Y');
        return null;
    }

    if (isNaN(r) || r < 2 || r > 5) {
        showNotification('Введите R в промежутке от 2 до 5');
        return null;
    }

    return { x, y: parseFloat(y), r };
}
