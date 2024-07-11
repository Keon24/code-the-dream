document.addEventListener('DOMContentLoaded', function () {
    const input = document.getElementById('search-box');
    const searchBtn = document.getElementById('search-button');
    const showContainer = document.getElementById('show-container');
    const listContainer = document.querySelector(".list");

    const publicKey = '63e960c69a9d6c9ea9cece843d13bc93';
    let privateKey = '5472801700a26b066a83e4fd79ea3e33b33cda45'; 

    function generateHash() {
        const timestamp = new Date().getTime();
        return [CryptoJS.MD5(timestamp + privateKey + publicKey).toString(), timestamp];
    }

    function displayWords(value) {
        input.value = value;
        listContainer.innerHTML = ""; // Clear previous search results
    }

    // Use event delegation for dynamically added elements
    listContainer.addEventListener('click', function(event) {
        if (event.target && event.target.matches(".autocomplete-items")) {
            displayWords(event.target.textContent);
        }
    });

    input.addEventListener('keyup', async () => {
        if (input.value.length < 4) return;

        const [hashValue, timestamp] = generateHash();
        const url = `https://gateway.marvel.com:443/v1/public/characters?ts=${timestamp}&apikey=${publicKey}&hash=${hashValue}&nameStartsWith=${input.value}`;

        fetch(url)
            .then(response => response.json())
            .then(jsonData => {
                listContainer.innerHTML = "";
                jsonData.data.results.forEach(result => {
                    const div = document.createElement("div");
                    div.className = "autocomplete-items";
                    div.textContent = result.name;
                    listContainer.appendChild(div);
                });
            })
            .catch(error => console.error('Error fetching data:', error));
    });

    searchBtn.addEventListener('click', async () => {
        if (!input.value.trim()) {
            alert("Input cannot be blank");
            return;
        }

        const [hashValue, timestamp] = generateHash();
        const url = `https://gateway.marvel.com:443/v1/public/characters?ts=${timestamp}&apikey=${publicKey}&hash=${hashValue}&name=${input.value}`;

        fetch(url)
            .then(response => response.json())
            .then(jsonData => {
                showContainer.innerHTML = "";
                jsonData.data.results.forEach(element => {
                    showContainer.innerHTML += `<div class="card-container">
                        <div class="container-character-image">
                            <img src="${element.thumbnail.path}.${element.thumbnail.extension}" alt="${element.name}"/>
                        </div>
                        <div class="character-name">${element.name}</div>
                        <div class="character-description">${element.description || 'No description available.'}</div>
                    </div>`;
                });
            })
            .catch(error => console.error('Error fetching detailed character:', error));
    });
});
