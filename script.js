const clientForm = document.getElementById('clientForm');
const resultContainer = document.getElementById('resultContainer');
const loading = document.getElementById('loading');
const results = document.getElementById('results');
const errorMessage = document.getElementById('errorMessage');
const errorText = document.getElementById('errorText');
const notification = document.getElementById('notification');
const notificationText = document.getElementById('notificationText');

clientForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('name').value.trim();
    const age = document.getElementById('age').value.trim();

    if (!name || !age) {
        showNotification('Please enter both name and age', 'error');
        return;
    }

    if (age < 1 || age > 120) {
        showNotification('Please enter a valid age (1-120)', 'error');
        return;
    }

    clientForm.parentElement.style.display = 'none';
    resultContainer.style.display = 'block';
    loading.style.display = 'block';
    results.style.display = 'none';
    errorMessage.style.display = 'none';

    try {
        const response = await fetch('/api/client-info', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, age })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Server error');
        }

        if (data.success) {
            displayResults(data.data);
            showNotification('Information retrieved successfully!', 'success');
        } else {
            throw new Error(data.message);
        }

    } catch (error) {
        console.error('Error:', error);
        showError(error.message || 'Failed to retrieve information. Please try again.');
    }
});

function displayResults(data) {
    document.getElementById('info-name').textContent = data.personal.name;
    document.getElementById('info-age').textContent = data.personal.age;

    document.getElementById('info-ip').querySelector('#ip-text').textContent = data.network.ipAddress;
    document.getElementById('info-public-ip').textContent = data.network.publicIp;

    document.getElementById('info-country').textContent = data.location.country;
    document.getElementById('info-city').textContent = data.location.city;
    document.getElementById('info-continent').textContent = data.location.continent;
    document.getElementById('info-currency').textContent = data.location.currency;
    document.getElementById('info-timezone').textContent = data.location.timezone;

    const flagElement = document.getElementById('info-country');
    const countryCode = data.location.country_code;
    if (countryCode && countryCode !== 'Unknown') {
        const flag = getFlagEmoji(countryCode);
        flagElement.innerHTML = `${flag} ${data.location.country}`;
    }

    document.getElementById('info-device').textContent = data.device.type;
    document.getElementById('info-browser').textContent = data.device.browser;
    document.getElementById('info-os').textContent = data.device.operatingSystem;

    const time = new Date(data.timestamp).toLocaleString();
    document.getElementById('info-time').textContent = time;

    const apiStatus = document.querySelector('#apiStatus i');
    const apiStatusText = document.querySelector('#apiStatus span');
    if (data.api.status === 'success') {
        apiStatus.style.color = '#4ade80';
        apiStatusText.textContent = 'API Status: Connected';
    } else {
        apiStatus.style.color = '#fbbf24';
        apiStatusText.textContent = 'API Status: Limited';
    }

    loading.style.display = 'none';
    results.style.display = 'block';
}

function showError(message) {
    errorText.textContent = message;
    loading.style.display = 'none';
    errorMessage.style.display = 'block';
}

function resetForm() {
    resultContainer.style.display = 'none';
    clientForm.parentElement.style.display = 'block';
    clientForm.reset();
    errorMessage.style.display = 'none';
}

function copyToClipboard(elementId) {
    const text = document.getElementById(elementId).textContent;
    navigator.clipboard.writeText(text)
        .then(() => {
            showNotification('IP address copied to clipboard!', 'success');
        })
        .catch(err => {
            console.error('Failed to copy: ', err);
            showNotification('Failed to copy to clipboard', 'error');
        });
}

function shareInfo() {
    const name = document.getElementById('info-name').textContent;
    const location = document.getElementById('info-country').textContent;
    const device = document.getElementById('info-device').textContent;

    const shareText = `Check out my client info: ${name} from ${location} using ${device} device. Discover yours too!`;

    if (navigator.share) {
        navigator.share({
            title: 'My Client Information',
            text: shareText,
            url: window.location.href
        });
    } else {
        navigator.clipboard.writeText(shareText)
            .then(() => {
                showNotification('Info copied to clipboard!', 'success');
            });
    }
}

function showNotification(message, type = 'info') {
    notificationText.textContent = message;
    notification.className = 'notification';

    if (type === 'error') {
        notification.style.background = 'linear-gradient(135deg, #f72585, #b5179e)';
    } else if (type === 'success') {
        notification.style.background = 'linear-gradient(135deg, #4cc9f0, #4895ef)';
    } else {
        notification.style.background = 'linear-gradient(135deg, #4361ee, #3a0ca3)';
    }

    notification.classList.add('show');

    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

function getFlagEmoji(countryCode) {
    if (!countryCode || countryCode === 'Unknown') return '🏴';

    const codePoints = countryCode
        .toUpperCase()
        .split('')
        .map(char => 127397 + char.charCodeAt());

    return String.fromCodePoint(...codePoints);
}

document.addEventListener('DOMContentLoaded', () => {
    const formCard = document.querySelector('.form-card');
    formCard.classList.add('animate__animated', 'animate__pulse');

    setTimeout(() => {
        showNotification('Welcome! Enter your details to discover your client information.', 'info');
    }, 1000);
});
