async function fetchCard(rarity, format)
{
        let query = `rarity%3A${rarity}`;
    if (format === 'starter')
    {
            query += `+set%3APOR%2CS99%2CGS1`;
    } else if (format === 'limited')
    {
            const today = new Date();
            const date = new Date(today.setDate(today.getDate() - 140));
            const formattedDate = date.toISOString().split('T')[0];
            query += `+legal%3Astandard+date>%3D${formattedDate}`;
        } else {
            query += `+legal%3A${format}`;
        }
        const response = await fetch(`https://api.scryfall.com/cards/random?q=${query}`);
        const card = await response.json();
        return card.image_uris.normal;
    }
    async function generateCards() {
    const cardContainer = document.getElementById('card-container');
    const loadingMessage = document.getElementById('loading');
    const format = document.getElementById('format-select').value;
    cardContainer.innerHTML = ''; // Clear previous cards
    loadingMessage.innerHTML = '<img src="Loading.gif" alt="Loading...">'; // Show loading message

    const timeoutId = setTimeout(() => {
        loadingMessage.innerText = 'API Error: Scryfall images cannot be loaded!';
    }, 30000); // 30-second timeout for error message

    try {
        // Fetch 5 unique common cards
        const commonPromises = Array.from({ length: 5 }, () => fetchCard('common', format));
        const commonCards = await Promise.all(commonPromises);

        // Fetch 2 unique uncommon cards
        const uncommonPromises = Array.from({ length: 2 }, () => fetchCard('uncommon', format));
        const uncommonCards = await Promise.all(uncommonPromises);

        // Determine if a mythic rare should be fetched instead of a rare (12.5% chance)
        const rareRarity = Math.random() < 0.125 ? 'mythic' : 'rare';
        const rareCard = await fetchCard(rareRarity, format);

        const allCards = [...commonCards, ...uncommonCards, rareCard];

        // Display the fetched images
        allCards.forEach(imageUrl => {
            const image = document.createElement('img');
            image.src = imageUrl;
            image.classList.add('retrieved');  // Add the 'retrieved' class to the image
            cardContainer.appendChild(image);
        });

        loadingMessage.innerHTML = ''; // Clear loading message after images are loaded
        clearTimeout(timeoutId); // Clear the timeout if images load successfully
    } catch (error) {
        loadingMessage.innerText = 'API Error: Scryfall images cannot be loaded!';
        clearTimeout(timeoutId); // Clear the timeout on error
    }
}

async function fetchPremium(PremiumName) {
    const response = await fetch(`https://api.scryfall.com/cards/named?exact=${PremiumName}`);
    const card = await response.json();
    return card.image_uris.normal;
}

async function generatePremiumCard()
{
    const cardContainer = document.getElementById('card-container2');
    const loadingMessage = document.getElementById('loading2');
    cardContainer.innerHTML = ''; // Clear previous cards
    loadingMessage.innerHTML = '<img src="Loading.gif" alt="Loading...">'; // Show loading message
    const timeoutId = setTimeout(() =>
    {
        loadingMessage.innerText = 'API Error: Scryfall images cannot be loaded!';
    }, 30000); // 30-second timeout for error message
    const premiumCards =
        [
        'Black Lotus', 'Ancestral Recall', 'Contract From Below', 'Time Walk', 'Timetwister', 'Time Vault',
        'Balance', 'Bazaar of Baghdad', 'Channel', 'Demonic Consultation', 'Deathrite Shaman',
        'Demonic Tutor', 'Earthcraft', 'Expressive Iteration', 'Fastbond', 'Flash',
        'Frantic Search', 'Gitaxian Probe', 'Gush', 'Imperial Seal', 'Library of Alexandria',
        'Lurrus of the Dream-Den', 'Mana Crypt', 'Mana Drain', 'Mana Vault', 'Memory Jar',
        'Mental Misstep', "Mishra's Workshop", 'Mox Emerald', 'Mox Jet', 'Mox Pearl',
        'Mox Ruby', 'Mox Sapphire', 'Necropotence', 'Oko, Thief of Crowns',
        "Sensei's Divining Top", 'Skullclamp', 'Sol Ring', 'Strip Mine',
        "Uro, Titan of Nature's Wrath", 'Survival of the Fittest', "Tibalt's Trickery",
        'Biorhythm', 'Cloudpost', 'Field of the Dead', 'Fury', 'Once Upon a Time',
        "Arcum's Astrolabe", 'Griselbrand', 'Lutri, the Spellchaser', 'Tinker',
        'Sundering Titan', 'Tolarian Academy', 'Treasure Cruise', 'Vampiric Tutor',
        'Underworld Breach', 'Wheel of Fortune', 'Windfall', "Yawgmoth's Bargain",
        "Yawgmoth's Will", "Mind's Desire", 'Brainstorm', 'Chalice of the Void',
        'Upheaval', 'Dig Through Time', 'Golgari Grave-Troll', 'Karn, the Great Creator',
        "Lion's Eye Diamond", 'Emrakul, the Aeons Torn'
    ];
    const randomCard = premiumCards[Math.floor(Math.random() * premiumCards.length)];
    try
    {
        const cardImage = await fetchPremium(randomCard);
        const image = document.createElement('img');
        image.src = cardImage;
        image.classList.add('retrieved');  // Add the 'retrieved' class to the image
        cardContainer.appendChild(image);
        loadingMessage.innerHTML = ''; // Clear loading message after images are loaded
        clearTimeout(timeoutId); // Clear the timeout if images load successfully
    } catch (error)
    {
        loadingMessage.innerText = 'API Error: Scryfall images cannot be loaded!';
        clearTimeout(timeoutId); // Clear the timeout on error
    }
}
