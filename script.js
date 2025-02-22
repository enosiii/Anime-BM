document.addEventListener('DOMContentLoaded', () => {
    const animeList = document.getElementById('anime-list');
    const addButton = document.getElementById('add-button');
    const deleteButton = document.getElementById('delete-button');
    const addContainer = document.getElementById('add-container');
    const deleteContainer = document.getElementById('delete-container');
    const submitButton = document.getElementById('submit-button');
    const animeIdInput = document.getElementById('anime-id');
    const animeTitleInput = document.getElementById('anime-title');
    const notification = document.getElementById('notification');
    const deleteList = document.getElementById('delete-list');
    const confirmDeleteButton = document.getElementById('confirm-delete');

    let animeData = [];

    // Load anime data from JSON
    fetch('anime.json')
        .then(response => response.json())
        .then(data => {
            animeData = data;
            renderAnimeList();
        });

    // Render anime list
    function renderAnimeList() {
        animeList.innerHTML = '';
        animeData.sort((a, b) => a.title.localeCompare(b.title)).forEach(anime => {
            const button = document.createElement('button');
            button.className = 'anime-button';
            button.textContent = anime.title;
            button.onclick = () => window.open(`https://animepahe.ru/a/${anime.id}`, '_blank');
            animeList.appendChild(button);
        });
    }

    // Show add container and hide delete container
    addButton.addEventListener('click', () => {
        addContainer.classList.remove('hidden');
        deleteContainer.classList.add('hidden');
    });

    // Show delete container and hide add container
    deleteButton.addEventListener('click', () => {
        deleteContainer.classList.remove('hidden');
        addContainer.classList.add('hidden');
        renderDeleteList();
    });

    // Render delete list
    function renderDeleteList() {
        deleteList.innerHTML = '';
        animeData.forEach((anime, index) => {
            const item = document.createElement('div');
            item.className = 'delete-list-item';
            item.innerHTML = `
                <input type="checkbox" id="anime-${index}" value="${anime.id}">
                <label for="anime-${index}">${anime.title}</label>
            `;
            deleteList.appendChild(item);
        });
    }

    // Submit new anime
    submitButton.addEventListener('click', () => {
        const id = animeIdInput.value.trim();
        const title = animeTitleInput.value.trim();

        if (id && title) {
            animeData.push({ id, title });
            renderAnimeList();
            animeIdInput.value = '';
            animeTitleInput.value = '';
            notification.textContent = `${title} added to the list!`;
            notification.classList.remove('hidden');
            setTimeout(() => notification.classList.add('hidden'), 3000);
        }
    });

    // Confirm delete
    confirmDeleteButton.addEventListener('click', () => {
        const selectedAnime = Array.from(document.querySelectorAll('.delete-list-item input:checked'))
            .map(input => input.value);

        if (selectedAnime.length > 0) {
            if (confirm(`Do you want to delete the Anime:\n${selectedAnime.map(id => animeData.find(anime => anime.id === id).title).join('\n')}`)) {
                animeData = animeData.filter(anime => !selectedAnime.includes(anime.id));
                renderAnimeList();
                renderDeleteList();
            }
        }
    });
});