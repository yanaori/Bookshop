export function toggleMenu() {
    const container = document.querySelector('.isade-container');
    container.classList.toggle('menu_active');
    const menuButton = document.querySelector('.section-menu-btn');
    menuButton.classList.toggle('open');
}

