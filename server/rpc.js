const RPC = require('discord-rpc');
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const PORT = process.env.PORT ;
const CLIENT_ID = process.env.DISCORD_CLIENT_ID ;

const rpc = new RPC.Client({ transport: 'ipc' });
const app = express();
app.use(cors());
app.use(express.json());

let browserState = {
    isActive: false,
    activeTab: null,
    url: null,
    startTimestamp: null
};

const SERVICES = {
    'youtube.com': {
        name: 'YouTube',
        imageKey: 'youtube',
        formatDetails: (title, url) => {
            const videoTitle = title.split(' - YouTube')[0];
            return `Watching: ${videoTitle}`;
        }
    },
    'github.com': {
        name: 'GitHub',
        imageKey: 'github',
        formatDetails: (title) => `On GitHub: ${title.split(' · GitHub')[0]}`
    },
    'google.com': {
        name: 'Google',
        imageKey: 'google',
        formatDetails: (title) => `Searching on Google`
    },
    'netflix.com': {
        name: 'Netflix',
        imageKey: 'netflix',
        formatDetails: (title) => `Watching: ${title.split(' - Netflix')[0]}`
    },
    'twitter.com': {
        name: 'Twitter',
        imageKey: 'twitter',
        formatDetails: (title) => `On Twitter: ${title.split(' / X')[0]}`
    },
    'x.com': {
        name: 'Twitter',
        imageKey: 'twitter',
        formatDetails: (title) => `On Twitter: ${title.split(' / X')[0]}`
    },
    'discord.com': {
        name: 'Discord',
        imageKey: 'discord',
        formatDetails: (title) => `On Discord`
    },
    'reddit.com': {
        name: 'Reddit',
        imageKey: 'reddit',
        formatDetails: (title) => `On Reddit: ${title.split(' : reddit')[0]}`
    },
    'twitch.tv': {
        name: 'Twitch',
        imageKey: 'twitch',
        formatDetails: (title) => `Watching: ${title.split(' - Twitch')[0]}`
    },
    'chat.openai.com': {
        name: 'ChatGPT',
        imageKey: 'chatgpt',
        formatDetails: (title) => `Using ChatGPT`
    },
    'claude.ai': {
        name: 'Claude',
        imageKey: 'claude',
        formatDetails: (title) => `Using Claude AI`
    }
};


function getDomain(url) {
    try {
        return new URL(url).hostname.replace('www.', '');
    } catch {
        return null;
    }
}


function updatePresence() {
    if (!browserState.isActive || !browserState.url) {
        rpc.clearActivity().catch(console.error);
        return;
    }

    try {
        const domain = getDomain(browserState.url);
        const service = SERVICES[domain];
        
        let details;
        if (service) {
            details = service.formatDetails(browserState.activeTab, browserState.url);
        } else {
            details = `Browsing: ${domain || 'unknown site'}`;
        }

        rpc.setActivity({
            details: details.substring(0, 128),
            largeImageKey: service ? service.imageKey : 'browser',
            largeImageText: service ? service.name : domain,
            startTimestamp: browserState.startTimestamp,
            instance: false
        }).catch(console.error);
    } catch (error) {
        console.error('Update failed:', error);
    }
}

app.post('/update-tab', (req, res) => {
    const { tab, url, active } = req.body;
    
    if (!url) {
        res.status(400).json({ error: 'URL required' });
        return;
    }

    browserState = {
        isActive: active !== false,
        activeTab: tab || '',
        url: url,
        startTimestamp: browserState.startTimestamp || Date.now()
    };

    updatePresence();
    res.status(200).end();
});

app.post('/clear', (req, res) => {
    browserState = {
        isActive: false,
        activeTab: null,
        url: null,
        startTimestamp: null
    };
    rpc.clearActivity().catch(console.error);
    res.status(200).end();
});

rpc.on('ready', () => {
    console.log('Discord RPC Connected');
    updatePresence();
});

rpc.on('disconnected', () => {
    rpc.login({ clientId: CLIENT_ID }).catch(console.error);
});

startServer();

async function startServer() {
    try {
        await rpc.login({ clientId: CLIENT_ID });
        app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    } catch (error) {
        console.error('Server start failed:', error);
        process.exit(1);
    }
}