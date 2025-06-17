<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Graph Visualization</title>
    <link rel="stylesheet" href="resources/file.css">
</head>
<body>
<div class="container">
    <div class="content">
        <div class="student-header">
            <p>ФИО: Девятых Павел Леонидович</p>
            <p>Группа: P3210</p>
            <p>Вариант: 3231202</p>
        </div>
        <div class="graph-container">
            <canvas id="graphCanvas"></canvas>
        </div>
        <div class="controls">
            <div class="input-group">
                <label for="x-input">X:</label>
                <input type="text" id="x-input" placeholder="Введите X от -3 до 3">
            </div>
            <div class="input-group">
                <label>Y:</label>
                <div class="radio-group">
                    <input type="radio" id="y-2" name="y-value" value="-2">
                    <label for="y-2">-2</label>
                    <input type="radio" id="y-1.5" name="y-value" value="-1.5">
                    <label for="y-1.5">-1.5</label>
                    <input type="radio" id="y-1" name="y-value" value="-1">
                    <label for="y-1">-1</label>
                    <input type="radio" id="y-0.5" name="y-value" value="-0.5">
                    <label for="y-0.5">-0.5</label>
                    <input type="radio" id="y0" name="y-value" value="0">
                    <label for="y0">0</label>
                    <input type="radio" id="y0.5" name="y-value" value="0.5">
                    <label for="y0.5">0.5</label>
                    <input type="radio" id="y1" name="y-value" value="1">
                    <label for="y1">1</label>
                    <input type="radio" id="y1.5" name="y-value" value="1.5">
                    <label for="y1.5">1.5</label>
                    <input type="radio" id="y2" name="y-value" value="2">
                    <label for="y2">2</label>
                </div>
            </div>
            <div class="input-group">
                <label for="r-input">R:</label>
                <input type="text" id="r-input" placeholder="Введите R от 2 до 5">
            </div>
            <div class="button-group">
                <button id="clear-btn">Очистить</button>
            </div>
            <button id="submit-btn">Отправить</button>
        </div>
        <div id="results">
            <h3>Результаты:</h3>
            <div class="table-wrapper">
                <table id="results-table">
                    <thead>
                    <tr>
                        <th rowspan="2">X</th>
                        <th rowspan="2">Y</th>
                        <th rowspan="2">R</th>
                        <th rowspan="2">Результат</th>
                        <th colspan="6">Время начала</th>
                        <th rowspan="2">Время выполнения (Сек)</th>
                    </tr>
                    <tr>
                        <th>Год</th>
                        <th>Мес</th>
                        <th>День</th>
                        <th>Час</th>
                        <th>Мин</th>
                        <th>Сек</th>
                    </tr>
                    </thead>
                    <tbody>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</div>
<%--<script src="resources/javas.js"></script>--%>
<script type="module" src="resources/main.js"></script>
</body>
</html>
