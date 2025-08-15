// ===== ИСПРАВЛЕНИЕ СТРЕЛОК КАРУСЕЛИ УСЛУГ ===== 

// Улучшенная функция для обновления видимости стрелок услуг
function updateServicesArrowsFixed() {
    const carousel = document.getElementById('services-grid');
    const prevArrow = document.querySelector('.services-nav-arrow.prev');
    const nextArrow = document.querySelector('.services-nav-arrow.next');

    if (!carousel || !prevArrow || !nextArrow) {
        return;
    }

    const scrollLeft = carousel.scrollLeft;
    const cardWidth = 280;
    const gap = 24;
    const cardWithGap = cardWidth + gap;
    const totalCards = carousel.children.length;

    // Вычисляем текущую позицию карточки с учетом центрирования
    // Учитываем начальный padding для центрирования первой карточки
    const initialPadding = window.innerWidth <= 768 ? (window.innerWidth / 2 - 140) : 0;
    const adjustedScrollLeft = scrollLeft + initialPadding;
    const currentCardIndex = Math.round(adjustedScrollLeft / cardWithGap);

    // Скрываем левую стрелку если на первой карточке (индекс 0)
    if (currentCardIndex <= 0) {
        prevArrow.classList.add('hidden');
    } else {
        prevArrow.classList.remove('hidden');
    }

    // Скрываем правую стрелку если на последней карточке
    if (currentCardIndex >= totalCards - 1) {
        nextArrow.classList.add('hidden');
    } else {
        nextArrow.classList.remove('hidden');
    }
}

// Улучшенная функция прокрутки карусели услуг
function scrollServicesCarouselFixed(direction) {
    const carousel = document.getElementById('services-grid');
    if (!carousel) {
        return;
    }

    const cardWidth = 280;
    const gap = 24;
    const scrollDistance = cardWidth + gap;

    if (direction === 'next') {
        carousel.scrollBy({
            left: scrollDistance,
            behavior: 'smooth'
        });
    } else if (direction === 'prev') {
        carousel.scrollBy({
            left: -scrollDistance,
            behavior: 'smooth'
        });
    }

    // Обновляем стрелки после прокрутки с увеличенной задержкой
    setTimeout(() => updateServicesArrowsFixed(), 500);
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function () {
    setTimeout(() => {
        const prevBtn = document.querySelector('.services-nav-arrow.prev');
        const nextBtn = document.querySelector('.services-nav-arrow.next');

        if (prevBtn) {
            prevBtn.onclick = () => scrollServicesCarouselFixed('prev');
        }
        if (nextBtn) {
            nextBtn.onclick = () => scrollServicesCarouselFixed('next');
        }

        updateServicesArrowsFixed();

        const carousel = document.getElementById('services-grid');
        if (carousel) {
            carousel.addEventListener('scroll', () => {
                clearTimeout(window.servicesScrollTimeout);
                window.servicesScrollTimeout = setTimeout(updateServicesArrowsFixed, 100);
            });
        }

    }, 2000); // Увеличиваем задержку для надежности
});