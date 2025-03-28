document.addEventListener('DOMContentLoaded', () => {
    // Загружаем сохраненные избранные при старте
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    
    // Устанавливаем начальное состояние иконок
    document.querySelectorAll('.game__card').forEach(gameCard => {
        const title = gameCard.querySelector('.game__title').textContent;
        const likeIcon = gameCard.querySelector('.game__icon');
        if (favorites.some(game => game.title === title)) {
            likeIcon.classList.add('active');
        }
    });

    // Функция для добавления игры в избранное
    function addToFavorites(gameCard) {
        const gameData = {
            title: gameCard.querySelector('.game__title').textContent,
            description: gameCard.querySelector('.game__description').textContent,
            image: gameCard.querySelector('.game__image').src,
            meta: gameCard.querySelector('.game__meta').textContent
        };

        let favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
        const likeIcon = gameCard.querySelector('.game__icon');
        
        // Проверяем, есть ли игра в избранном
        const index = favorites.findIndex(game => game.title === gameData.title);
        
        if (index === -1) {
            // Добавляем в избранное
            favorites.push(gameData);
            likeIcon.classList.add('active');
        } else {
            // Убираем из избранного
            favorites.splice(index, 1);
            likeIcon.classList.remove('active');
        }
        
        localStorage.setItem('favorites', JSON.stringify(favorites));
    }

    // Обработчик клика по иконке "Нравится"
    document.querySelectorAll('.game__icon').forEach(icon => {
        icon.addEventListener('click', (e) => {
            const gameCard = e.target.closest('.game__card');
            if (gameCard) {
                addToFavorites(gameCard);
            }
        });
    });

    // Функция для отображения избранных игр
    function displayFavorites() {
        const favoritesContainer = document.getElementById('favorites-container');
        if (!favoritesContainer) return;

        const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');

        if (favorites.length === 0) {
            favoritesContainer.innerHTML = '<p>У вас пока нет избранных игр</p>';
            return;
        }

        favoritesContainer.innerHTML = favorites.map(game => `
            <article class="game__card">
                <img src="${game.image}" alt="${game.title}" class="game__image">
                <div class="game__content">
                    <div class="game__header">
                        <h2 class="game__title">${game.title}</h2>
                        <button class="remove-favorite" data-title="${game.title}">Удалить из избранного</button>
                    </div>
                    <p class="game__description">${game.description}</p>
                    <p class="game__meta">${game.meta}</p>
                </div>
            </article>
        `).join('');

        // Добавляем обработчики для кнопок удаления
        document.querySelectorAll('.remove-favorite').forEach(button => {
            button.addEventListener('click', (e) => {
                const gameTitle = e.target.dataset.title;
                removeFromFavorites(gameTitle);
            });
        });
    }

    // Функция удаления игры из избранного
    function removeFromFavorites(gameTitle) {
        let favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
        favorites = favorites.filter(game => game.title !== gameTitle);
        localStorage.setItem('favorites', JSON.stringify(favorites));
        
        // Обновляем состояние иконки на главной странице, если она открыта
        const gameCard = document.querySelector(`.game__card:has(.game__title:contains("${gameTitle}"))`);
        if (gameCard) {
            const likeIcon = gameCard.querySelector('.game__icon');
            likeIcon.classList.remove('active');
        }
        
        displayFavorites();
    }

    // Вызываем функцию отображения избранного при загрузке страницы
    displayFavorites();
});
