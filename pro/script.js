function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

function initMobileMenu() {
    const navToggle = document.getElementById('navToggle');
    const mobileMenu = document.getElementById('mobileMenu');

    if (!navToggle || !mobileMenu) {
        setTimeout(() => initMobileMenu(), 500);
        return;
    }

    navToggle.replaceWith(navToggle.cloneNode(true));
    const newNavToggle = document.getElementById('navToggle');

    newNavToggle.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        mobileMenu.classList.toggle('open');
        newNavToggle.classList.toggle('active');
    });

    document.addEventListener('click', function (e) {
        if (!mobileMenu.contains(e.target) && !newNavToggle.contains(e.target)) {
            mobileMenu.classList.remove('open');
            newNavToggle.classList.remove('active');
        }
    });
}

function closeMobileMenu() {
    const mobileMenu = document.getElementById('mobileMenu');
    const navToggle = document.getElementById('navToggle');

    if (mobileMenu) mobileMenu.classList.remove('open');
    if (navToggle) navToggle.classList.remove('active');
}

function initNavigation() {
    initNavScroll();
    initActiveNavigation();
}

function initFloatingContactBtn() {
    const floatingBtn = document.getElementById('floatingContactBtn');
    if (!floatingBtn) return;

    floatingBtn.addEventListener('click', function () {
        scrollToSection('contacts');
    });
}

let lastScrollTop = 0;
let scrollTimeout = null;
let isNavVisible = true;

function initNavScroll() {
    const nav = document.querySelector('.modern-nav');
    if (!nav) return;

    nav.classList.add('nav-visible');
    nav.classList.remove('nav-hidden');

    window.addEventListener('scroll', function () {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const scrollDelta = scrollTop - lastScrollTop;
        const scrollThreshold = 10;

        if (scrollTimeout) {
            clearTimeout(scrollTimeout);
        }

        if (scrollDelta > scrollThreshold && scrollTop > 100) {
            scrollTimeout = setTimeout(() => {
                if (isNavVisible) {
                    nav.classList.remove('nav-visible');
                    nav.classList.add('nav-hidden');
                    isNavVisible = false;
                }
            }, 100);
        }
        else if (scrollDelta < -scrollThreshold || scrollTop <= 100) {
            scrollTimeout = setTimeout(() => {
                if (!isNavVisible) {
                    nav.classList.remove('nav-hidden');
                    nav.classList.add('nav-visible');
                    isNavVisible = true;

                    const mobileMenu = document.getElementById('mobileMenu');
                    const navToggle = document.getElementById('navToggle');
                    if (mobileMenu && navToggle && mobileMenu.classList.contains('open')) {
                        closeMobileMenu();
                    }
                }
            }, 100);
        }

        lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
    });

    nav.addEventListener('mouseenter', function () {
        if (!isNavVisible) {
            nav.classList.remove('nav-hidden');
            nav.classList.add('nav-visible');
            isNavVisible = true;

            const mobileMenu = document.getElementById('mobileMenu');
            const navToggle = document.getElementById('navToggle');
            if (mobileMenu && navToggle && mobileMenu.classList.contains('open')) {
                closeMobileMenu();
            }
        }
    });
}

function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        let offsetTop;
        if (sectionId === 'contacts') {
            offsetTop = section.offsetTop - -2180;
        } else {
            offsetTop = section.offsetTop - 80;
        }
        window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
        });
    } else {
        setTimeout(() => {
            const targetSection = document.getElementById(sectionId);
            if (targetSection) {
                let offsetTop;
                if (sectionId === 'contacts') {
                    offsetTop = targetSection.offsetTop - 100;
                } else {
                    offsetTop = targetSection.offsetTop - 80;
                }
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        }, 100);
    }
}

function initScrollProgress() {
    const progressBar = document.getElementById('scrollProgress');
    if (!progressBar) return;

    window.addEventListener('scroll', function () {
        const scrollTop = window.scrollY;
        const docHeight = document.body.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        progressBar.style.width = scrollPercent + '%';
    });
}

function initActiveNavigation() {
    const navButtons = document.querySelectorAll('.hero-actions .btn.primary');
    const sections = document.querySelectorAll('.section');

    const buttonSectionMap = {
        'services': 0,
        'prices': 1,
        'home': 2,
        'about': 3,
        'contacts': 4
    };

    window.addEventListener('scroll', function () {
        let current = '';
        const scrollPosition = window.scrollY + 100;
        const contactsSection = document.getElementById('contacts');
        const footer = document.querySelector('footer.footer');
        let footerVisible = false;
        if (footer) {
            const rect = footer.getBoundingClientRect();
            if (rect.top < window.innerHeight && rect.bottom > 0 && rect.height > 0) {
                const visibleHeight = Math.min(rect.bottom, window.innerHeight) - Math.max(rect.top, 0);
                if (visibleHeight / rect.height > 0.2) {
                    footerVisible = true;
                }
            }
        }
        if (footerVisible) {
            current = 'contacts';
        } else if (contactsSection) {
            const rect = contactsSection.getBoundingClientRect();
            if (rect.top < window.innerHeight && rect.bottom > window.innerHeight * 0.3) {
                current = 'contacts';
            } else {
                sections.forEach(section => {
                    if (section.id === 'contacts') return;
                    const sectionTop = section.offsetTop;
                    const sectionHeight = section.offsetHeight;
                    if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                        current = section.getAttribute('id');
                    }
                });
            }
        }

        navButtons.forEach(button => {
            button.classList.remove('nav-active');
        });

        navButtons.forEach((button, index) => {
            const buttonText = button.textContent.trim();
            if ((current === 'services' && buttonText === 'Наши услуги') ||
                (current === 'prices' && buttonText === 'Акции') ||
                (current === 'about' && buttonText === 'О нас') ||
                (current === 'contacts' && buttonText === 'Связаться') ||
                (current === 'hero' && buttonText === 'Календарь эколога')) {
                if (current === 'contacts' && buttonText !== 'Связаться') return;
                button.classList.add('nav-active');
            }
        });
    });
}

function openCalendarModal() {
    const url = 'images/calendar.png';
    const isMobile = /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

    if (isMobile) {
        window.location.href = url;
        return;
    }

    let win = null;
    try {
        win = window.open(url, '_blank', 'noopener,noreferrer');
    } catch (e) {
    }
    if (!win || win.closed || typeof win.closed === 'undefined') {
        const a = document.createElement('a');
        a.href = url;
        a.target = '_blank';
        a.rel = 'noopener noreferrer';
        document.body.appendChild(a);
        a.click();
        a.remove();
    }
}

function openPromotionsModal() {
    alert('Раздел "Акции" скоро будет доступен!\n\nСледите за обновлениями на нашем сайте.');
}

function initCounterAnimations() {
    const counters = document.querySelectorAll('.stat-number, .achievement-number');

    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
                entry.target.classList.add('counted');
                animateCounter(entry.target);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => counterObserver.observe(counter));
}

function animateCounter(element) {
    const target = parseInt(element.getAttribute('data-target'));
    const duration = 2000;
    const frameRate = 60;
    const totalFrames = (duration / 1000) * frameRate;
    const increment = target / totalFrames;
    let current = 0;
    let frame = 0;

    const timer = setInterval(() => {
        frame++;
        const progress = frame / totalFrames;
        const easedProgress = 1 - Math.pow(1 - progress, 3);
        current = target * easedProgress;

        if (frame >= totalFrames) {
            element.textContent = target + (target > 50 ? '+' : '');
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current);
        }
    }, 1000 / frameRate);
}

let currentSlideIndex = 0;
const totalSlides = 3;

function moveCarousel(direction) {
    const carousel = document.getElementById('teamCarousel');
    const dots = document.querySelectorAll('.dot');

    if (!carousel) return;

    currentSlideIndex += direction;

    if (currentSlideIndex >= totalSlides) {
        currentSlideIndex = 0;
    } else if (currentSlideIndex < 0) {
        currentSlideIndex = totalSlides - 1;
    }

    const translateX = -currentSlideIndex * 100;
    carousel.style.transform = `translateX(${translateX}%)`;

    dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentSlideIndex);
    });
}

function currentSlide(slideIndex) {
    const carousel = document.getElementById('teamCarousel');
    const dots = document.querySelectorAll('.dot');

    if (!carousel) return;

    currentSlideIndex = slideIndex - 1;

    const translateX = -currentSlideIndex * 100;
    carousel.style.transform = `translateX(${translateX}%)`;

    dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentSlideIndex);
    });
}

function initCarouselAutoplay() {
    const carousel = document.getElementById('teamCarousel');
    if (!carousel) return;

    setInterval(() => {
        moveCarousel(1);
    }, 5000);
}

function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.service-card, .pricing-card, .achievement-card').forEach(el => {
        observer.observe(el);
    });
}

const servicesData = {
    design: {
        title: "Разработка экологической документации",
        icon: "🏗️",
        description: "Разработка проектной документации для обеспечения экологической безопасности предприятий",
        features: [
            "Инвентаризация стационарных источников выбросов",
            "Проект нормативов допустимых выбросов (НДВ/ПДВ)",
            "Инвентаризация отходов производства и потребления",
            "Проект нормативов образования отходов (ПНООЛР)",
            "Мероприятия по сокращению выбросов (НМУ)",
            "Проект санитарно-защитной зоны (СЗЗ)",
            "Постановка на учёт объектов НВОС",
            "Программа ПЭК",
            "Декларация о воздействии на окружающую среду (ДВОС)"
        ]
    },
    reporting: {
        title: "Оформление и сдача экологической отчётности",
        icon: "📊",
        description: "Подготовка и сдача всех видов экологической отчетности в установленные сроки",
        features: [
            "Декларация о плате за НВОС",
            "Отчет о программе ПЭК",
            "Журнал движения отходов",
            "Отчет по форме 2-ТП (воздух)",
            "Отчет по форме 2-ТП (отходы)",
            "Отчет по форме 2-ТП (водхоз)",
            "Отчет по парниковым газам",
            "Экологический сбор, отчётность",
            "Отчет по форме 4-ОС",
            "Отчет по форме 4-ЛС"
        ]
    },
    support: {
        title: "Экологическое сопровождение предприятий",
        icon: "🏢",
        description: "Комплексное экологическое сопровождение деятельности предприятий на постоянной основе",
        features: [
            "Экологическое сопровождение предприятий"
        ]
    },
    audit: {
        title: "Экологическое аудит предприятий",
        icon: "🔍",
        description: "Комплексная оценка воздействия предприятия на окружающую среду и соответствия экологическим требованиям",
        features: [
            "Экологический аудит"
        ]
    },
    passportization: {
        title: "Разработка паспортов для отходов I-IV классов опасности, для V класса – протоколы биотестирования",
        icon: "📄",
        description: "Разработка паспортов отходов I-IV классов опасности",
        features: [
            "Паспортизация отходов"
        ]
    }
};

function openServiceModal(serviceId) {
    const service = servicesData[serviceId];
    if (!service) return;

    const modal = document.getElementById('serviceModal');
    if (!modal) return;

    const modalTitle = document.getElementById('modalTitle');
    const modalIcon = document.getElementById('modalIcon');
    const modalDescription = document.getElementById('modalDescription');
    const subservicesGrid = document.getElementById('subservicesGrid');

    if (modalTitle) modalTitle.textContent = service.title;
    if (modalIcon) modalIcon.textContent = service.icon;
    if (modalDescription) modalDescription.textContent = service.description;

    if (subservicesGrid) {
        subservicesGrid.innerHTML = '';
        service.features.forEach((feature, index) => {
            const subserviceButton = document.createElement('button');
            subserviceButton.className = 'subservice-button';
            subserviceButton.onclick = () => openSubserviceOrderModal(serviceId, index);

            const subserviceData = getSubserviceData(serviceId, feature);

            subserviceButton.innerHTML = `
        <div class="subservice-button-content">
          <div class="subservice-title">${feature}</div>
          <div class="subservice-info">
            <span class="subservice-price">${subserviceData.price}</span>
            <span class="subservice-duration">${subserviceData.duration}</span>
          </div>
        </div>
        <div class="subservice-arrow">→</div>
      `;

            subservicesGrid.appendChild(subserviceButton);
        });
    }

    modal.classList.add('show');
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';

    const externalControls = modal.querySelector('.modal-external-controls');
    if (externalControls) {
        externalControls.style.display = 'flex';
    }

    const backBtn = document.getElementById('serviceBackBtn');
    if (backBtn) {
        backBtn.style.display = 'none';
    }
}

function getSubserviceData(serviceId, featureName) {
    const defaultData = {
        description: 'Профессиональное выполнение услуги с соблюдением всех требований законодательства',
        price: 'по запросу',
        duration: '5-10 дней'
    };

    const specificData = {
        'Инвентаризация стационарных источников выбросов': {
            description: 'Инвентаризация стационарных источников и выбросов загрязняющих веществ в атмосферный воздух проводится юридическими лицами и индивидуальными предпринимателями, осуществляющими хозяйственную и (или) иную деятельность на объектах, оказывающих негативное воздействие на окружающую среду.',
            price: 'от 45 000 ₽',
            duration: 'до 2 недель',
            whoNeeds: 'Объектам I, II, III и IV категории НВОС, при наличии стационарных и передвижных источников выбросов загрязняющих веществ в атмосферный воздух.',
            validity: 'Для объектов НВОС I категории – 7 лет в составе Комплексного экологического разрешения (КЭР). Для объектов НВОС II категории – 7 лет в составе Декларации о воздействии на окружающую среду (ДВОС). Для объектов НВОС III и IV категории – до изменений в технологическом производстве, а также случаев изменения в количественном и качественном составе выбросов атмосферу.',
            approval: 'Согласования в государственных органах и организациях не требуется, утверждается руководителем организации.'
        }
    };

    return specificData[featureName] || defaultData;
}

function closeServiceModal() {
    const modal = document.getElementById('serviceModal');
    if (modal) {
        modal.classList.remove('show');
        modal.style.display = 'none';
        document.body.style.overflow = '';
    }
}

function openSubserviceOrderModal(serviceId, featureIndex) {
    const service = servicesData[serviceId];
    if (!service || !service.features[featureIndex]) return;

    const featureName = service.features[featureIndex];
    const subserviceData = getSubserviceData(serviceId, featureName);

    const modal = document.getElementById('subserviceOrderModal');
    if (!modal) return;

    const modalTitle = document.getElementById('subserviceModalTitle');
    const modalDescription = document.getElementById('subserviceModalDescription');
    const modalPrice = document.getElementById('subserviceModalPrice');
    const modalDuration = document.getElementById('subserviceModalDuration');

    if (modalTitle) modalTitle.textContent = featureName;
    if (modalDescription) modalDescription.innerHTML = subserviceData.description;
    if (modalPrice) modalPrice.textContent = subserviceData.price;
    if (modalDuration) modalDuration.textContent = subserviceData.duration;

    modal.classList.add('show');
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

function closeSubserviceOrderModal() {
    const modal = document.getElementById('subserviceOrderModal');
    if (modal) {
        modal.classList.remove('show');
        modal.style.display = 'none';
        document.body.style.overflow = '';
    }
}

function submitSubserviceOrder(event) {
    event.preventDefault();

    const form = event.target;
    const formData = new FormData(form);

    const serviceName = formData.get('service');
    const clientName = formData.get('name');
    const clientPhone = formData.get('phone');

    alert(`Спасибо за заявку!\n\nУслуга: ${serviceName}\nИмя: ${clientName}\nТелефон: ${clientPhone}\n\nМы свяжемся с вами в ближайшее время.`);

    closeSubserviceOrderModal();
    form.reset();
}

document.addEventListener('DOMContentLoaded', function () {
    setTimeout(() => {
        if (typeof initNavigation === 'function') initNavigation();
        if (typeof initScrollProgress === 'function') initScrollProgress();
        if (typeof initScrollAnimations === 'function') initScrollAnimations();
        if (typeof initCounterAnimations === 'function') initCounterAnimations();
        if (typeof initMobileMenu === 'function') initMobileMenu();
        if (typeof initFloatingContactBtn === 'function') initFloatingContactBtn();

        const calendarBtn = document.getElementById('calendarBtn');
        if (calendarBtn) {
            calendarBtn.addEventListener('click', function (e) {
                e.preventDefault();
                e.stopPropagation();
                if (typeof openCalendarModal === 'function') {
                    openCalendarModal();
                }
            });
        }

        const serviceModal = document.getElementById('serviceModal');
        if (serviceModal) {
            const closeBtn = serviceModal.querySelector('.modal-close');
            if (closeBtn) {
                closeBtn.addEventListener('click', closeServiceModal);
            }

            serviceModal.addEventListener('click', function (e) {
                if (e.target === serviceModal) {
                    closeServiceModal();
                }
            });
        }

        const subserviceModal = document.getElementById('subserviceOrderModal');
        if (subserviceModal) {
            const closeBtn = subserviceModal.querySelector('.modal-close');
            if (closeBtn) {
                closeBtn.addEventListener('click', closeSubserviceOrderModal);
            }

            const backBtn = subserviceModal.querySelector('#subserviceBackToListBtn');
            if (backBtn) {
                backBtn.addEventListener('click', function (e) {
                    e.preventDefault();
                    e.stopPropagation();
                    backToServicesList();
                });
            }

            const backBtnAlt = document.getElementById('subserviceBackToListBtn');
            if (backBtnAlt && backBtnAlt !== backBtn) {
                backBtnAlt.addEventListener('click', function (e) {
                    e.preventDefault();
                    e.stopPropagation();
                    backToServicesList();
                });
            }

            subserviceModal.addEventListener('click', function (e) {
                if (e.target === subserviceModal) {
                    closeSubserviceOrderModal();
                }
            });
        }

        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape') {
                const subserviceModal = document.getElementById('subserviceOrderModal');
                const serviceModal = document.getElementById('serviceModal');
                const orderModal = document.getElementById('orderModal');

                if (subserviceModal && subserviceModal.style.display === 'flex') {
                    closeSubserviceOrderModal();
                } else if (serviceModal && serviceModal.style.display === 'flex') {
                    closeServiceModal();
                } else if (orderModal && orderModal.style.display === 'flex') {
                    closeOrderModal();
                }
            }
        });
    }, 100);
}, 1000);

function backToServicesList() {
    const subserviceModal = document.getElementById('subserviceOrderModal');
    const serviceModal = document.getElementById('serviceModal');

    if (subserviceModal) {
        subserviceModal.classList.remove('show');
        subserviceModal.style.display = 'none';
    }

    if (serviceModal) {
        serviceModal.classList.add('show');
        serviceModal.style.display = 'flex';
    }
}

function backToServiceList() {
    backToServicesList();
}

function openOrderModal(serviceName, price) {
    const modal = document.getElementById('orderModal');
    if (!modal) return;

    const serviceNameEl = modal.querySelector('#orderServiceName');
    const servicePriceEl = modal.querySelector('#orderServicePrice');

    if (serviceNameEl) serviceNameEl.textContent = serviceName;
    if (servicePriceEl) servicePriceEl.textContent = price;

    modal.classList.add('show');
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

function closeOrderModal() {
    const modal = document.getElementById('orderModal');
    if (modal) {
        modal.classList.remove('show');
        modal.style.display = 'none';
        document.body.style.overflow = '';
    }
}

window.addEventListener('load', function () {
    setTimeout(() => {
        if (typeof initCounterAnimations === 'function') {
            initCounterAnimations();
        }

        initMobileMenu();
        initNavigation();

        const navButtons = document.querySelectorAll('.hero-actions .btn');
        navButtons.forEach(button => {
            if (!button.onclick && button.textContent) {
                button.addEventListener('click', function (e) {
                    e.preventDefault();
                    const text = this.textContent.trim();
                    if (text === 'Наши услуги') scrollToSection('services');
                    else if (text === 'Акции') scrollToSection('prices');
                    else if (text === 'О нас') scrollToSection('about');
                    else if (text === 'Связаться') scrollToSection('contacts');
                    else if (text.includes('Календарь')) openCalendarModal();
                });
            }
        });

        const backToListBtn = document.getElementById('subserviceBackToListBtn');
        if (backToListBtn) {
            backToListBtn.replaceWith(backToListBtn.cloneNode(true));
            const newBackBtn = document.getElementById('subserviceBackToListBtn');

            newBackBtn.addEventListener('click', function (e) {
                e.preventDefault();
                e.stopPropagation();
                backToServicesList();
            });
        }
    }, 500);
})
function initWhyChooseUsAnimation() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Анимация заголовков
                const title = entry.target.querySelector('.why-choose-title');
                const subtitle = entry.target.querySelector('.why-choose-subtitle');

                if (title) title.classList.add('animate-in');
                if (subtitle) subtitle.classList.add('animate-in');

                // Анимация карточек с задержкой
                const serviceRows = entry.target.querySelectorAll('.service-row');
                serviceRows.forEach((row, index) => {
                    setTimeout(() => {
                        row.classList.add('animate-in');
                    }, index * 150);
                });
            }
        });
    }, {
        threshold: 0.2,
        rootMargin: '0px 0px -100px 0px'
    });

    const whyChooseSection = document.querySelector('.values-section');
    if (whyChooseSection) {
        observer.observe(whyChooseSection);
    }
}

// Инициализация анимации при загрузке страницы
document.addEventListener('DOMContentLoaded', function () {
    setTimeout(() => {
        initWhyChooseUsAnimation();
    }, 500);
})
function switchMediaTab(tabName) {
    // Убираем активный класс со всех кнопок
    const allTabs = document.querySelectorAll('.media-tab');
    allTabs.forEach(tab => {
        tab.classList.remove('active');
    });

    // Убираем активный класс со всех панелей
    const allPanels = document.querySelectorAll('.media-panel');
    allPanels.forEach(panel => {
        panel.classList.remove('active');
    });

    // Добавляем активный класс к выбранной кнопке
    const activeTab = document.querySelector(`[data-tab="${tabName}"]`);
    if (activeTab) {
        activeTab.classList.add('active');
    }

    // Показываем соответствующую панель
    const activePanel = document.getElementById(`${tabName}-panel`);
    if (activePanel) {
        activePanel.classList.add('active');
    }
}

// Делаем функцию доступной глобально
window.switchMediaTab = switchMediaTab;
// Заглушка для функции initFloatingButtonFooterInteraction
function initFloatingButtonFooterInteraction() {
    console.log('✅ initFloatingButtonFooterInteraction инициализирована (заглушка)');
    // Здесь может быть код для взаимодействия плавающей кнопки с футером
    // Пока что просто заглушка, чтобы избежать ошибки
}