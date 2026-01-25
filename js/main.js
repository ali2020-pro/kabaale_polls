// --- CONFIG ---
const candidatesContainer = document.getElementById('candidates-container');
const positionFilter = document.getElementById('pos-filter');
const candidateFilter = document.getElementById('cand-filter');
const gridPositionSelect = document.getElementById('grid-pos-filter');
const searchInput = document.getElementById('candidate-search');

let charts = {};
// Global reference to current filtered stats for search
let currentGridPosId = 'president';

document.addEventListener('DOMContentLoaded', () => {
    checkAuthState();
    if (!window.MockDB) return;

    // Init Grid
    populateGridFilter();
    renderCandidateGrid('president');

    // Init Charts
    populateChartFilters();
    initCharts();
    updateCharts('president', 'all');

    initCountUp();

    // Event Listeners for Search
    if (searchInput) {
        searchInput.addEventListener('keyup', (e) => {
            renderCandidateGrid(currentGridPosId, e.target.value);
        });
    }
});

// --- AUTH ---
function checkAuthState() {
    const userStr = sessionStorage.getItem('currentUser');
    const authContainer = document.querySelector('.auth-links');
    if (userStr && authContainer) {
        const user = JSON.parse(userStr);
        authContainer.innerHTML = `
            <div class="nav-user-area">
                <a href="profile.html" class="user-pill">
                    <i class="fa-solid fa-user-circle"></i> 
                    ${user.name.split(' ')[0]}
                </a>
                <a href="dashboard.html" class="btn btn-outline" style="padding: 6px 12px; font-size:0.9rem;">History</a>
                <button onclick="logout()" class="btn btn-outline" style="padding: 6px 12px; border:none; color:#EF4444;"><i class="fa-solid fa-power-off"></i></button>
            </div>
        `;
    }
}
window.logout = () => { sessionStorage.removeItem('currentUser'); window.location.reload(); };

// --- GRID LOGIC & SEARCH ---
function populateGridFilter() {
    if (!gridPositionSelect) return;
    window.MockDB.positions.forEach(p => {
        const opt = document.createElement('option');
        opt.value = p.id;
        opt.innerText = p.title;
        gridPositionSelect.appendChild(opt);
    });
    gridPositionSelect.value = 'president';
    gridPositionSelect.addEventListener('change', (e) => renderCandidateGrid(e.target.value));
}

function renderCandidateGrid(posId, searchTerm = '') {
    currentGridPosId = posId;
    if (!candidatesContainer) return;
    candidatesContainer.innerHTML = '';

    const stats = window.MockDB.getStats(posId);
    const totalVotes = stats.totalVotes;

    let candidatesToShow = stats.candidates;
    if (searchTerm.trim() !== '') {
        const term = searchTerm.toLowerCase();
        candidatesToShow = candidatesToShow.filter(c => c.name.toLowerCase().includes(term));
    }

    if (candidatesToShow.length === 0) {
        candidatesContainer.innerHTML = `<div style="grid-column:1/-1; text-align:center; padding:40px; color:var(--text-muted);">No candidates found.</div>`;
        return;
    }

    candidatesToShow.forEach(c => {
        const percent = totalVotes > 0 ? ((c.voteCount / totalVotes) * 100).toFixed(1) : 0;

        const div = document.createElement('div');
        div.className = 'candidate-card card';
        // Make card clickable for modal
        div.style.cursor = 'pointer';
        div.onclick = () => openCandidateModal(c, percent);

        div.innerHTML = `
            <div class="card-header-img" style="background: linear-gradient(135deg, ${c.color} 0%, #1e293b 100%);">
                <div class="avatar-wrapper"><img src="${c.photo}"></div>
            </div>
            <div class="card-body">
                <h4 class="c-name">${c.name}</h4>
                <div class="c-badge">Verified Candidate</div>
                <div class="c-info" style="text-align:center; font-size:1.5rem; font-weight:700; color:var(--primary); margin: 20px 0;">
                    ${percent}%
                </div>
                <div class="c-footer">
                    <div class="vote-status-closed"><i class="fa-solid fa-lock"></i> Closed</div>
                </div>
                <div style="text-align:center; margin-top:10px; font-size:0.9rem; color:var(--text-light);">
                    ${c.voteCount.toLocaleString()} votes
                </div>
            </div>
        `;
        candidatesContainer.appendChild(div);
    });
}

// --- MODAL LOGIC ---
window.openCandidateModal = (candidate, percent) => {
    const modal = document.getElementById('candidate-modal');
    if (!modal) return;

    // Populate Data
    document.getElementById('m-photo').src = candidate.photo;
    document.getElementById('m-bg').style.background = `linear-gradient(135deg, ${candidate.color} 0%, #1e293b 100%)`;
    document.getElementById('m-name').innerText = candidate.name;
    // Look up position Title
    const pos = window.MockDB.positions.find(p => p.id === currentGridPosId);
    document.getElementById('m-role').innerText = pos ? pos.title : 'Candidate';

    document.getElementById('m-slogan').innerText = candidate.slogan ? `"${candidate.slogan}"` : "";
    document.getElementById('m-age').innerText = candidate.age || "N/A";
    document.getElementById('m-course').innerText = candidate.course || "General";
    document.getElementById('m-votes').innerText = `${candidate.voteCount.toLocaleString()} (${percent}%)`;

    // Manifesto
    const ul = document.getElementById('m-manifesto');
    ul.innerHTML = '';
    if (candidate.manifesto && Array.isArray(candidate.manifesto)) {
        candidate.manifesto.forEach(pt => {
            const li = document.createElement('li');
            li.innerText = pt;
            ul.appendChild(li);
        });
    } else {
        ul.innerHTML = '<li>No manifesto details available.</li>';
    }

    modal.classList.add('active');
};

window.closeModal = () => {
    document.getElementById('candidate-modal').classList.remove('active');
};

// Close on outside click
document.addEventListener('click', (e) => {
    const modal = document.getElementById('candidate-modal');
    if (e.target === modal) window.closeModal();
});


// --- EXPORT LOGIC ---
window.exportResults = () => {
    if (!window.MockDB) return;

    // Create a simple CSV content
    let csv = "Position,Candidate,Votes,Percentage\n";

    window.MockDB.positions.forEach(pos => {
        const stats = window.MockDB.getStats(pos.id);
        const total = stats.totalVotes;

        stats.candidates.forEach(c => {
            const pct = total > 0 ? (c.voteCount / total * 100).toFixed(2) : 0;
            // Escape commas in names
            const name = `"${c.name}"`;
            const title = `"${pos.title}"`;
            csv += `${title},${name},${c.voteCount},${pct}%\n`;
        });
    });

    // Create download link
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Election_Results_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
};


// --- CHART LOGIC ---
function populateChartFilters() {
    if (!positionFilter) return;

    // Position Select
    window.MockDB.positions.forEach(p => {
        const opt = document.createElement('option');
        opt.value = p.id;
        opt.innerText = p.title;
        positionFilter.appendChild(opt);
    });
    positionFilter.value = 'president';

    // Initial Candidate Populate
    populateCandidateFilter('president');

    // Events
    positionFilter.addEventListener('change', (e) => {
        populateCandidateFilter(e.target.value);
        updateCharts(e.target.value, 'all');
    });

    candidateFilter.addEventListener('change', (e) => {
        updateCharts(positionFilter.value, e.target.value);
    });
}

function populateCandidateFilter(posId) {
    if (!candidateFilter) return;
    candidateFilter.innerHTML = '<option value="all">All Candidates</option>';

    const cands = window.MockDB.candidates[posId];
    if (cands) {
        cands.forEach(c => {
            const opt = document.createElement('option');
            opt.value = c.id;
            opt.innerText = c.name;
            candidateFilter.appendChild(opt);
        });
    }
}

function updateCharts(posId, candId) {
    const stats = window.MockDB.getStats(posId, candId);
    if (!stats) return;

    const contextStats = window.MockDB.getStats(posId, 'all');

    if (charts.voteShare) {
        charts.voteShare.data.labels = contextStats.candidates.map(c => c.name);
        charts.voteShare.data.datasets[0].data = contextStats.candidates.map(c => c.voteCount);
        charts.voteShare.data.datasets[0].backgroundColor = contextStats.candidates.map(c => c.color || '#2563eb');
        charts.voteShare.update();
    }

    const dataset = candId === 'all' ?
        {
            gender: {
                Male: contextStats.candidates.reduce((s, c) => s + c.gender.Male, 0),
                Female: contextStats.candidates.reduce((s, c) => s + c.gender.Female, 0)
            },
            schools: contextStats.turnoutBySchool,
            years: contextStats.turnoutByYear
        } :
        {
            gender: contextStats.candidates.find(c => c.id === candId).gender,
            schools: contextStats.candidates.find(c => c.id === candId).schools,
            years: contextStats.candidates.find(c => c.id === candId).years
        };

    if (charts.gender) {
        charts.gender.data.datasets[0].data = [dataset.gender.Male, dataset.gender.Female];
        charts.gender.update();
    }

    if (charts.school) {
        charts.school.data.labels = Object.keys(dataset.schools);
        charts.school.data.datasets[0].data = Object.values(dataset.schools);
        charts.school.update();
    }

    if (charts.year) {
        charts.year.data.labels = Object.keys(dataset.years);
        charts.year.data.datasets[0].data = Object.values(dataset.years);
        charts.year.update();
    }
}

function initCharts() {
    if (typeof Chart === 'undefined') return;
    Chart.defaults.font.family = "'Inter', sans-serif";
    const opts = { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } };

    if (document.getElementById('voteShareChart')) {
        charts.voteShare = new Chart(document.getElementById('voteShareChart'), {
            type: 'doughnut', data: { datasets: [{ borderWidth: 0 }] }, options: { ...opts, plugins: { legend: { position: 'bottom' } } }
        });
        charts.gender = new Chart(document.getElementById('genderChart'), {
            type: 'pie', data: { labels: ['Male', 'Female'], datasets: [{ backgroundColor: ['#3B82F6', '#EC4899'], borderWidth: 0 }] }, options: { ...opts, plugins: { legend: { position: 'bottom' } } }
        });
        charts.school = new Chart(document.getElementById('schoolChart'), {
            type: 'bar', data: { datasets: [{ label: 'Votes', backgroundColor: '#2563EB', borderRadius: 4 }] }, options: { ...opts, scales: { x: { grid: { display: false } }, y: { beginAtZero: true } } }
        });
        charts.year = new Chart(document.getElementById('yearChart'), {
            type: 'bar', data: { datasets: [{ label: 'Votes', backgroundColor: '#10B981', borderRadius: 4 }] }, options: { ...opts, indexAxis: 'y', scales: { x: { beginAtZero: true }, y: { grid: { display: false } } } }
        });
    }
}

function initCountUp() {
    const el = document.querySelector('.count-up');
    if (el) {
        let c = 0, t = (window.DB_CONFIG && window.DB_CONFIG.total_voters) ? window.DB_CONFIG.total_voters : 627, i = 20;
        setInterval(() => { c += i; if (c >= t) c = t; el.innerText = c; }, 30);
    }
}
