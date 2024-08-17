let quotes = [];
fetch('quotes.json')
    .then(response => response.json())
    .then(data => quotes = data)
    .catch(error => console.error('Error fetching quotes:', error));

function displayRandomQuote() {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    displayQuote(quotes[randomIndex]);
}

function displayRandomQuoteByCategory(category) {
    const filteredQuotes = quotes.filter(quote => quote.category === category);
    if (filteredQuotes.length > 0) {
        const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
        displayQuote(filteredQuotes[randomIndex]);
    } else {
        alert('No quotes found for this category.');
    }
}

function displayQuote(quote) {
    document.getElementById('quote-text').textContent = quote.text;
    document.getElementById('quote-author').textContent = `- ${quote.author}`;
}

document.getElementById('search').addEventListener('input', function() {
    const query = this.value.toLowerCase();
    const filteredQuotes = quotes.filter(quote =>
        quote.text.toLowerCase().includes(query) ||
        quote.author.toLowerCase().includes(query) ||
        quote.category.toLowerCase().includes(query)
    );
    if (filteredQuotes.length > 0) {
        displayQuote(filteredQuotes[0]);
    }
});

document.getElementById('random-quote').addEventListener('click', function() {
    const selectedCategory = document.getElementById('categories').value;
    if (selectedCategory === 'all') {
        displayRandomQuote();
    } else {
        displayRandomQuoteByCategory(selectedCategory);
    }
});

document.getElementById('next-quote').addEventListener('click', function() {
    const selectedCategory = document.getElementById('categories').value;
    if (selectedCategory === 'all') {
        displayRandomQuote();
    } else {
        displayRandomQuoteByCategory(selectedCategory);
    }
});

document.getElementById('save-quote').addEventListener('click', function() {
    const quoteText = document.getElementById('quote-text').textContent;
    const quoteAuthor = document.getElementById('quote-author').textContent;
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    favorites.push({ text: quoteText, author: quoteAuthor });
    localStorage.setItem('favorites', JSON.stringify(favorites));
    alert('Quote saved!');
});

document.getElementById('view-saved-quotes').addEventListener('click', function() {
    const savedQuotesList = document.getElementById('saved-quotes');
    savedQuotesList.innerHTML = '';

    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    if (favorites.length === 0) {
        savedQuotesList.innerHTML = '<li>No saved quotes yet.</li>';
    } else {
        favorites.forEach((quote, index) => {
            const listItem = document.createElement('li');
            listItem.textContent = `${quote.text} ${quote.author}`;
            
            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.className = 'delete-quote';
            deleteButton.addEventListener('click', function() {
                deleteSavedQuote(index);
            });
            
            listItem.appendChild(deleteButton);
            savedQuotesList.appendChild(listItem);
        });
    }

    document.getElementById('saved-quotes-list').style.display = 'block';
});

document.getElementById('close-saved-quotes').addEventListener('click', function() {
    document.getElementById('saved-quotes-list').style.display = 'none';
});

function deleteSavedQuote(index) {
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    favorites.splice(index, 1);
    localStorage.setItem('favorites', JSON.stringify(favorites));
    alert('Quote deleted!');
    document.getElementById('view-saved-quotes').click();
}

function isColorDark(color) {
    const rgb = color.replace(/[^\d,]/g, '').split(',');
    const brightness = (0.299 * rgb[0]) + (0.587 * rgb[1]) + (0.114 * rgb[2]);
    return brightness < 150;
}

function applyTheme(theme) {
    const themes = {
        'Light': { background: '#f5f5f5', color: '#333333', borderColor: '#dddddd' },
        'Dark': { background: '#333333', color: '#f5f5f5', borderColor: '#444444' },
        'Corporate': { background: '#ffffff', color: '#2e3b4e', borderColor: '#e0e0e0' },
        'Elegant': { background: '#ffffff', color: '#444444', borderColor: '#bcbcbc' },
        'Modern': { background: '#f4f4f4', color: '#3c3c3c', borderColor: '#dcdcdc' },
        'Ocean': { background: '#2a6f97', color: '#ffffff', borderColor: '#1b4e75' },
        'Forest': { background: '#2d6a4f', color: '#ffffff', borderColor: '#1b4332' },
        'Sunset': { background: '#ff7f51', color: '#ffffff', borderColor: '#cc5f44' },
        'Slate': { background: '#343a40', color: '#f8f9fa', borderColor: '#495057' },
        'Minimalist': { background: '#ffffff', color: '#333333', borderColor: '#eeeeee' },
    };

    const selectedTheme = themes[theme];
    if (selectedTheme) {
        document.body.style.backgroundColor = selectedTheme.background;
        document.body.style.color = selectedTheme.color;
        document.querySelectorAll('button, select, input').forEach(element => {
            element.style.borderColor = selectedTheme.borderColor;
            element.style.color = selectedTheme.color;
            element.style.backgroundColor = selectedTheme.background;
        });
        document.querySelectorAll('#quote-display, #saved-quotes-list').forEach(element => {
            element.style.borderColor = selectedTheme.borderColor;
        });

        document.getElementById('quote-text').style.color = selectedTheme.color;
        document.getElementById('quote-author').style.color = selectedTheme.color;

        if (isColorDark(selectedTheme.background)) {
            document.getElementById('quote-text').style.color = '#ffffff';
            document.getElementById('quote-author').style.color = '#ffffff';
        } else {
            document.getElementById('quote-text').style.color = '#333333';
            document.getElementById('quote-author').style.color = '#333333';
        }
    }
}

document.getElementById('customize').addEventListener('click', function() {
    const themeSelectContainer = document.getElementById('theme-select-container');
    themeSelectContainer.style.display = 'block';
});

document.getElementById('apply-theme').addEventListener('click', function() {
    const selectedTheme = document.getElementById('theme-options').value;
    applyTheme(selectedTheme);
});
