const SERVER_URL = 'http://localhost:3000';
let lastUpdate = 0;
const UPDATE_DELAY = 0;

async function quickFetch(endpoint, data) {
    try {
        const response = await fetch(`${SERVER_URL}${endpoint}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        if (!response.ok) throw new Error('Network response was not ok');
    } catch (error) {
        console.error('Fetch error:', error);
    }
}

function shouldUpdate() {
    const now = Date.now();
    if (now - lastUpdate >= UPDATE_DELAY) {
        lastUpdate = now;
        return true;
    }
    return false;
}

async function updatePresence(tab) {
    if (!tab?.url || !shouldUpdate()) return;

    await quickFetch('/update-tab', {
        tab: tab.title,
        url: tab.url,
        active: true
    });
}

// Fast window focus handling
chrome.windows.onFocusChanged.addListener((windowId) => {
    if (windowId === chrome.windows.WINDOW_ID_NONE) {
        quickFetch('/clear', {});
    } else {
        chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
            if (tabs[0]) updatePresence(tabs[0]);
        });
    }
});

// Immediate tab switch handling
chrome.tabs.onActivated.addListener(activeInfo => {
    chrome.tabs.get(activeInfo.tabId, updatePresence);
});

// Efficient tab update handling
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete' && tab.active) {
        updatePresence(tab);
    }
});

// Initial state
chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
    if (tabs[0]) updatePresence(tabs[0]);
});