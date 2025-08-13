function forceFixCalendar() {
    if (window.innerWidth > 768) {
        return;
    }
    
    // Находим ВСЕ кнопки и ищем календарь
    const allButtons = document.querySelectorAll('button, .btn, [onclick]');
    let calendarButton = null;
    
    allButtons.forEach(button => {
        const text = button.textContent || button.innerText || '';
    });

    // АГРЕССИВНО убираем ВСЕ обработчики
    const newButton = calendarButton.cloneNode(true);
    calendarButton.parentNode.replaceChild(newButton, calendarButton);
    
    // Убираем onclick атрибут
    newButton.removeAttribute('onclick');
    newButton.onclick = null;
    function openCalendar(e) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        
        
        // Визуальная обратная связь
        newButton.style.transform = 'scale(0.95)';
        newButton.style.transition = 'transform 0.1s ease';
        
        setTimeout(() => {
            newButton.style.transform = 'scale(1)';
            
            try {
                window.open('images/calendar.png', '_blank');
                console.log('✅ Календарь открыт успешно!');
            } catch (error) {
                console.error('❌ Ошибка открытия:', error);
                // Альтернативный способ
                window.location.href = 'images/calendar.png';
            }
        }, 100);
        
        return false;
    }
    
    // Добавляем обработчики для всех возможных событий
    newButton.addEventListener('touchstart', openCalendar, { passive: false, capture: true });
    newButton.addEventListener('touchend', openCalendar, { passive: false, capture: true });
    newButton.addEventListener('click', openCalendar, { passive: false, capture: true });
    newButton.addEventListener('mousedown', openCalendar, { passive: false, capture: true });
    
    console.log('✅ Агрессивные обработчики добавлены к кнопке календаря');
}

// Применяем исправления немедленно и многократно
setTimeout(forceFixCalendar, 100);
setTimeout(forceFixCalendar, 500);
setTimeout(forceFixCalendar, 1000);
setTimeout(forceFixCalendar, 2000);
setTimeout(forceFixCalendar, 3000);

// Применяем при загрузке DOM
document.addEventListener('DOMContentLoaded', function() {
    console.log('📄 DOM загружен - применяем исправление календаря');
    setTimeout(forceFixCalendar, 100);
    setTimeout(forceFixCalendar, 500);
    setTimeout(forceFixCalendar, 1000);
});

// Применяем при полной загрузке страницы
window.addEventListener('load', function() {
    console.log('🌐 Страница загружена - применяем исправление календаря');
    setTimeout(forceFixCalendar, 100);
    setTimeout(forceFixCalendar, 500);
});

// Применяем при изменении размера окна
window.addEventListener('resize', function() {
    setTimeout(forceFixCalendar, 300);
});

// Наблюдатель за изменениями DOM
const observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
        if (mutation.type === 'childList') {
            mutation.addedNodes.forEach(function(node) {
                if (node.nodeType === 1) { // Element node
                    const text = node.textContent || node.innerText || '';
                    if (text.includes('Календарь') || text.includes('календарь')) {
                        console.log('🔍 Обнаружена новая кнопка календаря в DOM');
                        setTimeout(forceFixCalendar, 100);
                    }
                }
            });
        }
    });
});

// Начинаем наблюдение за изменениями DOM
observer.observe(document.body, {
    childList: true,
    subtree: true
});

// Экспортируем функцию для ручного вызова
window.forceFixCalendar = forceFixCalendar;

console.log('🔥 Агрессивное исправление календаря инициализировано');