function truncateDescription(description, maxCharacters) {
    if (description.length <= maxCharacters) {
        return description; // Если текст короче или равен максимальному количеству символов, не обрезаем его
    } else {
        return description.slice(0, maxCharacters) + '...'; // Обрезаем текст до максимального количества символов и добавляем многоточие
    }
}

export { truncateDescription };
