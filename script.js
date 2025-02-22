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

    const JSONBIN_API_KEY = '$2a$10$ZoZ/S0ocNYnC6zp8F3aTyOr3neOl3iJEbPRcVRgAL3CWceSOqAkt2';
    const JSONBIN_BIN_ID = '67b99c13acd3cb34a8ec2290';
    const JSONBIN_URL = `https://api.jsonbin.io/v3/b/${JSONBIN_BIN_ID}`;
    

    let animeData = [];

    // Fetch anime data from JSONBin.io
    async function fetchAnimeData() {
        const response = await fetch(JSONBIN_URL, {
            headers: {
                'X-Master-Key': JSONBIN_API_KEY,
            },
        });
        const data = await response.json();
        animeData = data.record;
        renderAnimeList();
    }

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
    submitButton.addEventListener('click', async () => {
        const id = animeIdInput.value.trim();
        const title = animeTitleInput.value.trim();

        if (id && title) {
            try {
                animeData.push({ id, title });
                await fetch(JSONBIN_URL, {
                    method: 'PUT',
                    headers: {
                        'X-Master-Key': JSONBIN_API_KEY,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(animeData),
                });
                fetchAnimeData(); // Refresh the list
                animeIdInput.value = '';
                animeTitleInput.value = '';
                notification.textContent = `${title} added to the list!`;
                notification.classList.remove('hidden');
                setTimeout(() => notification.classList.add('hidden'), 3000);
            } catch (error) {
                console.error('Error adding anime: ', error);
            }
        }
    });

    // Confirm delete
    confirmDeleteButton.addEventListener('click', async () => {
        const selectedAnime = Array.from(document.querySelectorAll('.delete-list-item input:checked'))
            .map(input => input.value);

        if (selectedAnime.length > 0) {
            if (confirm(`Do you want to delete the Anime:\n${selectedAnime.map(id => animeData.find(anime => anime.id === id).title).join('\n')}`)) {
                try {
                    animeData = animeData.filter(anime => !selectedAnime.includes(anime.id));
                    await fetch(JSONBIN_URL, {
                        method: 'PUT',
                        headers: {
                            'X-Master-Key': JSONBIN_API_KEY,
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(animeData),
                    });
                    fetchAnimeData(); // Refresh the list
                    renderDeleteList();
                } catch (error) {
                    console.error('Error deleting anime: ', error);
                }
            }
        }
    });

    // Initial fetch and render
    fetchAnimeData();
});
