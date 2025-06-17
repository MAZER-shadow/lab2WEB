// api.js
import { showNotification } from './utils.js'; // Импортируем showNotification

export async function fetchHistory() {
    try {
        const response = await fetch('http://localhost:8080/lab2WEB3231202_war_exploded/main-servlet', {
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            }
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error loading history:', error);
        showNotification('Ошибка загрузки истории с сервера');
        return [];
    }
}

export async function sendCoordinates(data) {
    try {
        const response = await fetch('http://localhost:8080/lab2WEB3231202_war_exploded/main-servlet', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data),
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Ошибка:', error);
        showNotification('Сервер недоступен, извините');
        throw error;
    }
}

export async function clearResults() {
    try {
        const response = await fetch('http://localhost:8080/lab2WEB3231202_war_exploded/clear-servlet', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Ошибка при очистке:', error);
        showNotification('Ошибка при очистке результатов');
        throw error;
    }
}
