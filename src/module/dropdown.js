let containerDropDown;
let headerButtonDropDown;

export function initializeDropdown() {
    containerDropDown = document.querySelector('.header-list');
    headerButtonDropDown = document.querySelector('.header-button_drop-down');

    headerButtonDropDown.addEventListener('click', toggleDropdown);

    document.addEventListener('click', function (event) {
        if (!containerDropDown.contains(event.target) && !headerButtonDropDown.contains(event.target)) {
            containerDropDown.classList.remove('menu_active');
            headerButtonDropDown.classList.remove('open');
        }
    });
}

export function toggleDropdown(event) {
    containerDropDown.classList.toggle('menu_active');
    headerButtonDropDown.classList.toggle('open');
}