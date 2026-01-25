/**
 * MOCK DATABASE 2.0 - LOGIC LAYER
 * Consumes settings from db_config.js
 * Generates Simulation Logic
 */

const CONF = window.DB_CONFIG;
if (!CONF) console.error("DB_CONFIG not loaded!");

// --- HELPERS (PRNG) ---
function mulberry32(a) {
    return function () {
        var t = a += 0x6D2B79F5;
        t = Math.imul(t ^ (t >>> 15), t | 1);
        t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    }
}

function cyrb128(str) {
    let h1 = 1779033703, h2 = 3144134277, h3 = 1013904242, h4 = 2773480762;
    for (let i = 0, k; i < str.length; i++) {
        k = str.charCodeAt(i);
        h1 = h2 ^ Math.imul(h1 ^ k, 597399067); h2 = h3 ^ Math.imul(h2 ^ k, 2869860233);
        h3 = h4 ^ Math.imul(h3 ^ k, 951274213); h4 = h1 ^ Math.imul(h4 ^ k, 2716044179);
    }
    h1 = Math.imul(h3 ^ (h1 >>> 18), 597399067); h2 = Math.imul(h4 ^ (h2 >>> 22), 2869860233);
    h3 = Math.imul(h1 ^ (h3 >>> 17), 951274213); h4 = Math.imul(h2 ^ (h4 >>> 19), 2716044179);
    return (h1 ^ h2 ^ h3 ^ h4) >>> 0;
}

// --- DATA ARRAYS ---
// Fallback names for auto-generation of non-president candidates
const names = ["James", "Mariam", "Robert", "Patricia", "John", "Jennifer", "Michael", "Linda", "David", "Elizabeth", "William", "Barbara", "Richard", "Susan", "Joseph", "Jessica", "Thomas", "Sarah", "Charles", "Karen"];
const surnames = ["Okello", "Musoke", "Namakula", "Akullo", "Ochieng", "Mugisha", "Kemigisha", "Byaruhanga", "Kato", "Babirye", "Lubega", "Nakato", "Tumusiime", "Kiryomuhindo", "Mwenda", "Nsubuga", "Kembabazi"];

// Candidates Setup
const mockCandidates = { ...CONF.candidates };

// Auto-fill other positions if not defined in CONFIG
CONF.positions.filter(p => !mockCandidates[p.id]).forEach(pos => {
    const posSeed = cyrb128(pos.id);
    const rng = mulberry32(posSeed);
    mockCandidates[pos.id] = [];

    // Determine count based on fixed_outcomes keys, default to 2
    let count = 2;
    if (CONF.fixed_outcomes && CONF.fixed_outcomes[pos.id]) {
        count = Object.keys(CONF.fixed_outcomes[pos.id]).length;
    } else {
        count = Math.floor(rng() * 2) + 2;
    }

    for (let i = 0; i < count; i++) {
        const n = `${names[Math.floor(rng() * names.length)]} ${surnames[Math.floor(rng() * surnames.length)]}`;
        mockCandidates[pos.id].push({
            id: `${pos.id}_c${i}`,
            name: n,
            photo: `https://api.dicebear.com/7.x/initials/svg?seed=${n}`,
            color: i === 0 ? '#10B981' : (i === 1 ? '#F59E0B' : '#6366F1'),
            // Default generic manifesto for generated cands
            manifesto: ["Serve the students.", "Improve facilities.", "Promote unity."]
        });
    }
});

// --- USERS & VOTES GENERATION ---
// --- USERS & VOTES GENERATION (HARDCODED QUOTA SYSTEM) ---
const staticUsers = window.STATIC_USERS || [];
const mockUsers = [];

// 1. Prepare Vote Queues
// For each position, create a deck of votes matching the exact counts in CONF.fixed_outcomes
const voteQueues = {};

CONF.positions.forEach(pos => {
    const outcomes = CONF.fixed_outcomes[pos.id] || {};
    let queue = [];

    // Add winning/losing votes to queue
    Object.keys(outcomes).forEach(candId => {
        const count = outcomes[candId];
        for (let j = 0; j < count; j++) {
            queue.push(candId);
        }
    });

    // Shuffle the queue so we don't just assign "Candidate A" to the first 300 users in order
    // Use a seed for deterministic shuffling
    const posSeed = cyrb128(pos.id + "shuffle");
    const rng = mulberry32(posSeed);

    // Fisher-Yates Shuffle
    for (let i = queue.length - 1; i > 0; i--) {
        const j = Math.floor(rng() * (i + 1));
        [queue[i], queue[j]] = [queue[j], queue[i]];
    }

    voteQueues[pos.id] = queue;
});

// 2. Assign Votes to Users
staticUsers.forEach((staticUser, i) => {
    // Full object
    const user = { ...staticUser, voteHistory: {} };

    CONF.positions.forEach(pos => {
        const queue = voteQueues[pos.id];
        let choiceId = null;

        if (queue && i < queue.length) {
            // Take the next vote card from the top of the deck
            choiceId = queue[i];
        }
        // If i >= queue.length, this user actively chose NOT to vote (Abstinence)
        // or we ran out of allocated votes.

        if (choiceId) {
            const candidate = mockCandidates[pos.id].find(c => c.id === choiceId);
            if (candidate) {
                user.voteHistory[pos.id] = {
                    candidateId: candidate.id,
                    candidateName: candidate.name,
                    candidatePhoto: candidate.photo,
                    timestamp: Date.now()
                };
            }
        }
    });
    mockUsers.push(user);
});

// --- ANALYTICS FUNCTION ---
function getPositionStats(posId, candidateIdFilter = 'all') {
    const candidates = mockCandidates[posId];
    if (!candidates) return null;

    const stats = {
        totalVotes: 0,
        candidates: candidates.map(c => ({
            ...c,
            voteCount: 0,
            gender: { Male: 0, Female: 0 },
            schools: {},
            years: {}
        })),
        turnoutBySchool: {},
        turnoutByYear: {}
    };

    // Init Counters
    CONF.courses.forEach(s => stats.turnoutBySchool[s] = 0);
    CONF.years.forEach(y => stats.turnoutByYear[y] = 0);
    stats.candidates.forEach(c => {
        CONF.courses.forEach(s => c.schools[s] = 0);
        CONF.years.forEach(y => c.years[y] = 0);
    });

    // Aggregate
    mockUsers.forEach(u => {
        const vote = u.voteHistory[posId];
        if (vote) {
            if (candidateIdFilter !== 'all' && vote.candidateId !== candidateIdFilter) return;

            stats.totalVotes++;
            stats.turnoutBySchool[u.school]++;
            stats.turnoutByYear[u.year]++;

            const cIndex = stats.candidates.findIndex(c => c.id === vote.candidateId);
            if (cIndex !== -1) {
                stats.candidates[cIndex].voteCount++;
                stats.candidates[cIndex].gender[u.gender]++;
                stats.candidates[cIndex].schools[u.school]++;
                stats.candidates[cIndex].years[u.year]++;
            }
        }
    });

    return stats;
}

window.MockDB = {
    positions: CONF.positions,
    candidates: mockCandidates,
    users: mockUsers,
    login: (r, p) => mockUsers.find(u => u.regNo === r && u.password === p),
    getStats: getPositionStats
};
