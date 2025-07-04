// utils.js
export function showNotification(message, isError = true) {
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

    setTimeout(() => {
        notification.style.animation = 'fadeOut 0.3s';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

export function parseDateTime(dateTimeArray) {
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
