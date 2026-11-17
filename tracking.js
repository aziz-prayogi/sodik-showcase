// Sodik Mobile - Tracking & Activity Functionality

// Mock tracking data
const trackingData = {
    'SODIK123456789': {
        resi: 'SODIK123456789',
        orderId: 'ORD-20241113-001',
        service: 'Sodik Express',
        status: 'transit',
        statusText: 'Sedang Dikirim',
        currentLocation: 'Hub Jakarta Selatan',
        estimatedDelivery: '2024-11-15 14:00',
        timeline: [
            { time: '2024-11-13 08:30', status: 'Pesanan Dibuat', location: 'Sistem Sodik', completed: true },
            { time: '2024-11-13 10:15', status: 'Dikemas & Disiapkan', location: 'Gudang Jakarta Pusat', completed: true },
            { time: '2024-11-13 14:20', status: 'Diterima Kurir', location: 'Hub Jakarta Pusat', completed: true },
            { time: '2024-11-14 06:45', status: 'Berangkat ke Hub Tujuan', location: 'Hub Jakarta Selatan', completed: true, current: true },
            { time: '2024-11-15 09:00', status: 'Sedang Diantar', location: 'Area Tujuan', pending: true },
            { time: '2024-11-15 14:00', status: 'Estimasi Sampai', location: 'Alamat Penerima', pending: true }
        ]
    },
    'RESI987654321': {
        resi: 'RESI987654321',
        orderId: 'ORD-20241112-045',
        service: 'Sodik Reguler',
        status: 'completed',
        statusText: 'Selesai',
        currentLocation: 'Diterima oleh Budi Santoso',
        estimatedDelivery: '2024-11-13 16:30',
        timeline: [
            { time: '2024-11-12 09:00', status: 'Pesanan Dibuat', location: 'Sistem Sodik', completed: true },
            { time: '2024-11-12 11:30', status: 'Dikemas & Disiapkan', location: 'Gudang Bandung', completed: true },
            { time: '2024-11-12 15:45', status: 'Diterima Kurir', location: 'Hub Bandung', completed: true },
            { time: '2024-11-13 08:20', status: 'Berangkat ke Hub Tujuan', location: 'Hub Jakarta Utara', completed: true },
            { time: '2024-11-13 13:15', status: 'Sedang Diantar', location: 'Area Tujuan', completed: true },
            { time: '2024-11-13 16:30', status: 'Paket Diterima', location: 'Alamat Penerima', completed: true, current: true }
        ]
    },
    'TRACK456789123': {
        resi: 'TRACK456789123',
        orderId: 'ORD-20241114-002',
        service: 'Sodik Same Day',
        status: 'pending',
        statusText: 'Menunggu Pembayaran',
        currentLocation: 'Menunggu Konfirmasi',
        estimatedDelivery: '2024-11-14 23:59',
        timeline: [
            { time: '2024-11-14 07:00', status: 'Pesanan Dibuat', location: 'Sistem Sodik', completed: true },
            { time: '2024-11-14 07:05', status: 'Menunggu Pembayaran', location: 'Virtual Account BCA', pending: true, current: true },
            { time: '2024-11-14 08:00', status: 'Pembayaran Dikonfirmasi', location: 'Sistem Pembayaran', pending: true },
            { time: '2024-11-14 09:00', status: 'Dikemas & Disiapkan', location: 'Gudang Jakarta', pending: true }
        ]
    }
};

// Mock order history data
const orderHistory = [
    { id: 'ORD-20241113-001', resi: 'SODIK123456789', date: '2024-11-13', service: 'Sodik Express', amount: 85000, status: 'transit', statusText: 'Sedang Dikirim' },
    { id: 'ORD-20241112-045', resi: 'RESI987654321', date: '2024-11-12', service: 'Sodik Reguler', amount: 45000, status: 'completed', statusText: 'Selesai' },
    { id: 'ORD-20241111-023', resi: 'SODIK555666777', date: '2024-11-11', service: 'Sodik Cargo', amount: 125000, status: 'completed', statusText: 'Selesai' },
    { id: 'ORD-20241110-012', resi: 'SODIK888999000', date: '2024-11-10', service: 'Sodik Express', amount: 95000, status: 'processing', statusText: 'Diproses' },
    { id: 'ORD-20241109-008', resi: 'SODIK111222333', date: '2024-11-09', service: 'Sodik Reguler', amount: 35000, status: 'cancelled', statusText: 'Dibatalkan' },
    { id: 'ORD-20241108-015', resi: 'SODIK444555666', date: '2024-11-08', service: 'Sodik Same Day', amount: 150000, status: 'transit', statusText: 'Sedang Dikirim' },
    { id: 'ORD-20241107-033', resi: 'SODIK777888999', date: '2024-11-07', service: 'Sodik Express', amount: 75000, status: 'completed', statusText: 'Selesai' },
    { id: 'ORD-20241106-021', resi: 'SODIK000111222', date: '2024-11-06', service: 'Sodik Reguler', amount: 55000, status: 'pending', statusText: 'Menunggu Pembayaran' }
];

// Status icon mapping
const statusIcons = {
    pending: 'fa-clock',
    processing: 'fa-cogs',
    transit: 'fa-truck',
    completed: 'fa-check-circle',
    cancelled: 'fa-times-circle'
};

// DOM Elements
const trackingForm = document.getElementById('tracking-form');
const trackingInput = document.getElementById('tracking-input');
const trackingResult = document.getElementById('tracking-result');
const closeTracking = document.getElementById('close-tracking');
const timeline = document.getElementById('timeline');
const statusBadge = document.getElementById('status-badge');
const statusMessage = document.getElementById('status-message');
const statusLocation = document.getElementById('status-location');
const statusTime = document.getElementById('status-time');
const resultResi = document.getElementById('result-resi');
const resultOrder = document.getElementById('result-order');
const resultService = document.getElementById('result-service');
const demoCodes = document.querySelectorAll('.demo-code');

const activityTabs = document.querySelectorAll('.activity-tab');
const activityPanels = document.querySelectorAll('.activity-panel-content');
const orderLists = {
    all: document.getElementById('orders-all'),
    pending: document.getElementById('orders-pending'),
    processing: document.getElementById('orders-processing'),
    transit: document.getElementById('orders-transit'),
    completed: document.getElementById('orders-completed'),
    cancelled: document.getElementById('orders-cancelled')
};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    renderAllOrders();
    setupEventListeners();
});

function setupEventListeners() {
    // Tracking form submit
    trackingForm.addEventListener('submit', handleTrackingSubmit);
    
    // Close tracking result
    closeTracking.addEventListener('click', hideTrackingResult);
    
    // Demo codes
    demoCodes.forEach(btn => {
        btn.addEventListener('click', () => {
            trackingInput.value = btn.dataset.code;
            handleTrackingSubmit(new Event('submit'));
        });
    });
    
    // Activity tabs
    activityTabs.forEach(tab => {
        tab.addEventListener('click', () => switchTab(tab.dataset.tab));
    });
    
    // Keyboard navigation for tabs
    activityTabs.forEach((tab, index) => {
        tab.addEventListener('keydown', (e) => {
            let newIndex = index;
            if (e.key === 'ArrowRight') newIndex = (index + 1) % activityTabs.length;
            if (e.key === 'ArrowLeft') newIndex = (index - 1 + activityTabs.length) % activityTabs.length;
            if (e.key === 'Home') newIndex = 0;
            if (e.key === 'End') newIndex = activityTabs.length - 1;
            if (newIndex !== index) {
                e.preventDefault();
                activityTabs[newIndex].focus();
                activityTabs[newIndex].click();
            }
        });
    });
}

function handleTrackingSubmit(e) {
    e.preventDefault();
    const code = trackingInput.value.trim().toUpperCase();
    
    if (!code) return;
    
    const data = trackingData[code];
    if (data) {
        showTrackingResult(data);
    } else {
        showNotFound(code);
    }
}

function showTrackingResult(data) {
    // Update package info
    resultResi.textContent = data.resi;
    resultOrder.textContent = data.orderId;
    resultService.textContent = data.service;
    
    // Update current status
    statusBadge.textContent = data.statusText;
    statusBadge.className = 'status-badge ' + data.status;
    statusMessage.textContent = getStatusMessage(data.status);
    statusLocation.innerHTML = `<i class="fa-solid fa-location-dot"></i> ${data.currentLocation}`;
    statusTime.innerHTML = `<i class="fa-solid fa-clock"></i> Estimasi: ${data.estimatedDelivery}`;
    
    // Render timeline
    renderTimeline(data.timeline);
    
    // Show result
    trackingResult.hidden = false;
    trackingResult.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function hideTrackingResult() {
    trackingResult.hidden = true;
}

function showNotFound(code) {
    // Simple alert for demo - could be replaced with a toast notification
    alert(`Nomor Resi "${code}" tidak ditemukan. Silakan coba kode demo yang tersedia.`);
}

function getStatusMessage(status) {
    const messages = {
        pending: 'Pesanan menunggu pembayaran. Silakan selesaikan pembayaran untuk memproses pengiriman.',
        processing: 'Pesanan sedang diproses di gudang. Kurir akan segera mengambil paket.',
        transit: 'Paket sedang dalam perjalanan ke alamat tujuan.',
        completed: 'Paket telah berhasil diterima oleh penerima.',
        cancelled: 'Pesanan telah dibatalkan. Hubungi layanan pelanggan untuk informasi lebih lanjut.'
    };
    return messages[status] || 'Status tidak diketahui.';
}

function renderTimeline(timelineData) {
    timeline.innerHTML = '';
    
    timelineData.forEach((item, index) => {
        const itemEl = document.createElement('div');
        itemEl.className = 'timeline-item';
        
        if (item.current) itemEl.classList.add('current');
        else if (item.completed) itemEl.classList.add('completed');
        else if (item.pending) itemEl.classList.add('pending');
        
        const timeFormatted = formatTime(item.time);
        
        itemEl.innerHTML = `
            <div class="timeline-marker" aria-hidden="true"></div>
            <div class="timeline-content">
                <div class="timeline-time">${timeFormatted}</div>
                <div class="timeline-status">${item.status}</div>
                <div class="timeline-location">
                    <i class="fa-solid fa-location-dot" aria-hidden="true"></i>
                    ${item.location}
                </div>
            </div>
        `;
        
        timeline.appendChild(itemEl);
    });
}

function formatTime(dateTimeStr) {
    const date = new Date(dateTimeStr);
    return date.toLocaleString('id-ID', {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

function switchTab(tabName) {
    // Update tabs
    activityTabs.forEach(tab => {
        const isActive = tab.dataset.tab === tabName;
        tab.classList.toggle('active', isActive);
        tab.setAttribute('aria-selected', isActive);
    });
    
    // Update panels
    activityPanels.forEach(panel => {
        const isActive = panel.dataset.panel === tabName;
        panel.classList.toggle('active', isActive);
        panel.hidden = !isActive;
    });
    
    // Render orders for this tab if not already rendered
    if (orderLists[tabName] && orderLists[tabName].children.length === 0) {
        renderOrdersForTab(tabName);
    }
}

function renderAllOrders() {
    renderOrdersForTab('all');
}

function renderOrdersForTab(tabName) {
    const container = orderLists[tabName];
    if (!container) return;
    
    const filtered = tabName === 'all' 
        ? orderHistory 
        : orderHistory.filter(o => o.status === tabName);
    
    if (filtered.length === 0) {
        container.innerHTML = `
            <div class="empty-state" style="padding: var(--spacing-lg);">
                <i class="fa-solid fa-box-open" style="font-size: 2.5rem;"></i>
                <p style="margin: var(--spacing-sm) 0;">Tidak ada pesanan dengan status ini</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = filtered.map(order => `
        <div class="order-item">
            <div class="order-status ${order.status}" aria-label="${order.statusText}">
                <i class="fa-solid ${statusIcons[order.status]}" aria-hidden="true"></i>
            </div>
            <div class="order-details">
                <div class="order-header">
                    <span class="order-id">${order.id}</span>
                    <span class="order-date">${formatDate(order.date)}</span>
                </div>
                <div class="order-info">
                    <span><i class="fa-solid fa-tag" aria-hidden="true"></i> ${order.service}</span>
                    <span><i class="fa-solid fa-truck" aria-hidden="true"></i> ${order.resi}</span>
                </div>
            </div>
            <span class="order-amount">Rp ${formatCurrency(order.amount)}</span>
        </div>
    `).join('');
}

function formatDate(dateStr) {
    const date = new Date(dateStr + 'T00:00:00');
    return date.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
    });
}

function formatCurrency(amount) {
    return new Intl.NumberFormat('id-ID').format(amount);
}