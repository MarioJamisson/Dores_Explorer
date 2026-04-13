const API_URL = 'http://127.0.0.1:5000/api/list';
let currentPath = '';
let historyStack = [];

// Elements
const fileListEl = document.getElementById('fileList');
const breadcrumbEl = document.getElementById('breadcrumb');
const backBtn = document.getElementById('backBtn');
const statsEl = document.getElementById('stats');
const scanBtn = document.getElementById('scanBtn');
const organizeBtn = document.getElementById('organizeBtn');
const modalOverlay = document.getElementById('modalOverlay');
const closeModal = document.getElementById('closeModal');
const scanResultsEl = document.getElementById('scanResults');
const calcSizesToggle = document.getElementById('calcSizesToggle');
const progressBar = document.getElementById('progressBar');
const loadingState = document.getElementById('loadingState');

let scanChart = null;

async function loadDirectory(path = '') {
    const calc = calcSizesToggle.checked;
    try {
        const response = await fetch(`${API_URL}?path=${encodeURIComponent(path)}&calc_sizes=${calc}`);
        const data = await response.json();

        if (data.error) {
            alert('Erro: ' + data.error);
            return;
        }

        renderItems(data.items);
        currentPath = data.current_path;
        updateUI(data);
    } catch (err) {
        console.error('Failed to load directory:', err);
        fileListEl.innerHTML = `<div style="grid-column: 1/-1; text-align: center; color: #ef4444; padding-top: 4rem;">
            <p>Erro ao conectar com o servidor.</p>
        </div>`;
    }
}

async function scanFolder() {
    if (!currentPath) {
        alert('Por favor, selecione uma pasta ou disco primeiro.');
        return;
    }

    // Show modal and loading state
    document.body.classList.add('scanning');
    modalOverlay.classList.add('active');
    scanResultsEl.innerHTML = '';
    scanResultsEl.appendChild(loadingState);
    progressBar.style.width = '0%';
    
    // Simulate progress
    let progress = 0;
    const interval = setInterval(() => {
        progress += Math.random() * 15;
        if (progress > 95) progress = 95;
        progressBar.style.width = `${progress}%`;
    }, 200);

    try {
        const response = await fetch(`http://127.0.0.1:5000/api/scan?path=${encodeURIComponent(currentPath)}`);
        const data = await response.json();

        clearInterval(interval);
        progressBar.style.width = '100%';
        
        setTimeout(() => {
            document.body.classList.remove('scanning');
            if (data.error) {
                scanResultsEl.innerHTML = `<p style="color: #ef4444; text-align: center; padding: 2rem;">Erro: ${data.error}</p>`;
                return;
            }
            renderScanResults(data);
        }, 300);

    } catch (err) {
        clearInterval(interval);
        document.body.classList.remove('scanning');
        scanResultsEl.innerHTML = `<p style="color: #ef4444; text-align: center; padding: 2rem;">Erro ao escanear pasta.</p>`;
    }
}

async function organizeFolder() {
    if (!currentPath) return;
    
    if (!confirm(`Deseja organizar os arquivos de "${currentPath}" em pastas por categoria?`)) return;

    organizeBtn.disabled = true;
    organizeBtn.innerText = 'Organizando...';

    try {
        const response = await fetch('http://127.0.0.1:5000/api/organize', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ path: currentPath })
        });
        const data = await response.json();

        if (data.error) {
            alert('Erro ao organizar: ' + data.error);
        } else {
            alert(data.message);
            loadDirectory(currentPath);
        }
    } catch (err) {
        alert('Erro ao conectar com o servidor.');
    } finally {
        organizeBtn.disabled = false;
        organizeBtn.innerText = 'Organizar';
    }
}

function renderScanResults(data) {
    scanResultsEl.innerHTML = `
        <div class="scan-stat-card">
            <div class="stat-item">
                <span class="label">Espaço Total</span>
                <span class="value">${formatSize(data.total_size)}</span>
            </div>
            <div class="stat-item">
                <span class="label">Total de Itens</span>
                <span class="value">${data.children.length}</span>
            </div>
        </div>
        <div style="margin-top: 1rem; position: relative; height: 350px;">
            <canvas id="scanChartCanvas"></canvas>
            <div id="chartCenterText" style="position: absolute; top: 55%; left: 50%; transform: translate(-50%, -50%); text-align: center; pointer-events: none;">
                <span style="display: block; font-size: 0.7rem; color: var(--text-dim);">MAIOR ITEM</span>
                <span style="font-weight: 700; color: var(--primary); font-size: 0.9rem;">${data.children.length > 0 ? (data.children[0].name.length > 20 ? data.children[0].name.substring(0, 17) + '...' : data.children[0].name) : 'N/A'}</span>
            </div>
        </div>
        <p style="font-size: 0.7rem; color: var(--text-dim); margin-top: 1rem; text-align: center;">
            Análise Hierárquica (Top 10)
        </p>
    `;

    if (scanChart) {
        scanChart.destroy();
    }

    const ctx = document.getElementById('scanChartCanvas').getContext('2d');
    
    const labels = data.children.map(c => c.name);
    const sizes = data.children.map(c => c.size);
    const colors = data.children.map(c => c.is_dir ? 'rgba(255, 49, 49, 0.8)' : 'rgba(255, 255, 255, 0.5)');
    const borderColors = data.children.map(c => c.is_dir ? '#ff3131' : '#ffffff');

    scanChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: labels,
            datasets: [{
                data: sizes,
                backgroundColor: colors,
                borderColor: borderColors,
                borderWidth: 1,
                hoverOffset: 20
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '70%',
            plugins: {
                legend: { display: false },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return ` ${context.label}: ${formatSize(context.raw)}`;
                        }
                    },
                    backgroundColor: '#000',
                    titleColor: '#ff3131',
                    bodyColor: '#fff',
                    borderColor: '#ff3131',
                    borderWidth: 1
                }
            }
        }
    });
}

function formatSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function renderItems(items) {
    fileListEl.innerHTML = '';
    
    if (items.length === 0) {
        fileListEl.innerHTML = `<div style="grid-column: 1/-1; text-align: center; padding-top: 4rem; color: var(--text-dim);">
            <p>Esta pasta está vazia.</p>
        </div>`;
        return;
    }

    items.forEach(item => {
        const div = document.createElement('div');
        div.className = 'item';
        
        const icon = item.is_dir ? '📂' : '📄';
        const iconClass = item.is_dir ? 'folder-icon' : 'file-icon';
        const sizeInfo = item.is_dir && item.size === 0 ? 'Pasta' : formatSize(item.size);

        div.innerHTML = `
            <div class="icon ${iconClass}">${icon}</div>
            <div class="item-name" title="${item.name}">${item.name}</div>
            <div class="item-info">${sizeInfo}</div>
        `;

        div.onclick = () => {
            if (item.is_dir) {
                historyStack.push(currentPath);
                loadDirectory(item.path);
            }
        };

        fileListEl.appendChild(div);
    });

    statsEl.innerText = `${items.length} itens`;
}

function updateUI(data) {
    breadcrumbEl.innerText = data.current_path || 'Meu Computador';
    backBtn.disabled = !data.current_path;
}

backBtn.onclick = () => {
    if (historyStack.length > 0) {
        const prev = historyStack.pop();
        loadDirectory(prev);
    } else {
        loadDirectory('');
    }
};

calcSizesToggle.onchange = () => loadDirectory(currentPath);
scanBtn.onclick = scanFolder;
organizeBtn.onclick = organizeFolder;
closeModal.onclick = () => modalOverlay.classList.remove('active');
modalOverlay.onclick = (e) => {
    if (e.target === modalOverlay) modalOverlay.classList.remove('active');
};

// Initial load
loadDirectory('');
