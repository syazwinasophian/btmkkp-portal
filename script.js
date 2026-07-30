const translations = {
    bm: {
        top_portal_title: "Portal Rasmi BTMKKP - Kumpulan Yayasan Sabah",
        top_today: "Hari ini:",
        text_size: "Saiz Teks:",
        dept_name: "Bahagian Teknologi Maklumat & Komunikasi & Keselamatan Kesihatan Pekerja (BTMKKP)",
        nav_home: "Utama",
        nav_services: "Perkhidmatan",
        nav_status: "Status & Notis",
        nav_inquiries: "Pertanyaan",
        nav_location: "Lokasi",
        sub_hazard: "Lapor Bahaya & Hazard",
        sub_health: "Program Kesihatan Pekerja",
        sub_helpdesk: "Meja Bantuan Helpdesk ICT",
        sub_forms: "Borang & SOP ICT / KKP",
        sub_network: "Status Rangkaian Live",
        sub_announcements: "Notis KKP & ICT",
        btn_lapor_hazard: "Lapor Hazard",
        btn_new_ticket: "Tiket ICT",
        hero_badge: "Pusat Perkhidmatan Integrasi Aras 8 (KKP) & Aras 22 (ICT)",
        hero_title: "Portal E-Perkhidmatan BTMKKP",
        hero_desc: "Satu platform bersepadu untuk permohonan sokongan teknikal ICT, bantuan infrastruktur digital, serta pelaporan hazard dan keselamatan kesihatan pekerja Menara Tun Mustapha.",
        search_placeholder: "Cari perkhidmatan ICT / KKP (cth: Reset Password, Wi-Fi, Lapor Hazard, Borang)",
        btn_search: "Cari",
        bulletin_header: "Notis KKP & ICT",
        toast_ticket_success: "Tiket ICT berjaya dihantar ke Aras 22!",
        toast_hazard_success: "Laporan Hazard KKP berjaya dihantar ke Aras 8!",
        toast_inquiry_success: "Pertanyaan anda telah berjaya dihantar ke BTMKKP."
    },
    en: {
        top_portal_title: "Official Portal BTMKKP - Yayasan Sabah Group",
        top_today: "Today:",
        text_size: "Text Size:",
        dept_name: "Information Technology & Communication & Occupational Safety Health Division (BTMKKP)",
        nav_home: "Home",
        nav_services: "Services",
        nav_status: "Status & Notices",
        nav_inquiries: "Inquiries",
        nav_location: "Location",
        sub_hazard: "Report Hazard & Danger",
        sub_health: "Occupational Health Program",
        sub_helpdesk: "ICT Helpdesk Support",
        sub_forms: "ICT / OSH Forms & SOPs",
        sub_network: "Live Network Status",
        sub_announcements: "OSH & ICT Notices",
        btn_lapor_hazard: "Report Hazard",
        btn_new_ticket: "ICT Ticket",
        hero_badge: "Integrated Service Hub Level 8 (OSH) & Level 22 (ICT)",
        hero_title: "BTMKKP E-Services Portal",
        hero_desc: "A unified platform for ICT technical support requests, digital infrastructure assistance, as well as hazard and occupational safety reporting for Menara Tun Mustapha.",
        search_placeholder: "Search ICT / OSH services (e.g. Password Reset, Wi-Fi, Report Hazard, Forms)",
        btn_search: "Search",
        bulletin_header: "OSH & ICT Notices",
        toast_ticket_success: "ICT Ticket successfully submitted to Level 22!",
        toast_hazard_success: "OSH Hazard Report successfully submitted to Level 8!",
        toast_inquiry_success: "Your inquiry has been successfully sent to BTMKKP."
    }
};

let currentLang = 'bm';

// --- LANGUAGE SWITCHING SYSTEM ---
function setLanguage(lang) {
    if (!translations[lang]) return;
    currentLang = lang;

    // Update Language Button Active States (UI styling)
    const btnBm = document.getElementById('btnLangBm');
    const btnEn = document.getElementById('btnLangEn');

    if (btnBm && btnEn) {
        if (lang === 'bm') {
            btnBm.className = 'px-2 py-0.5 text-xs font-bold bg-amber-500 text-stone-900 rounded shadow-sm';
            btnEn.className = 'px-2 py-0.5 text-xs font-bold text-stone-600 hover:text-stone-900';
        } else {
            btnEn.className = 'px-2 py-0.5 text-xs font-bold bg-amber-500 text-stone-900 rounded shadow-sm';
            btnBm.className = 'px-2 py-0.5 text-xs font-bold text-stone-600 hover:text-stone-900';
        }
    }

    // Apply translations across all elements with data-i18n attributes or matching IDs
    updateDOMTexts();
}

function updateDOMTexts() {
    const t = translations[currentLang];

    // Map translation keys to DOM elements dynamically
    Object.keys(t).forEach(key => {
        // Find elements with data-i18n attribute or matching ID
        const elements = document.querySelectorAll(`[data-i18n="${key}"], #${key}`);
        elements.forEach(elem => {
            if (elem.tagName === 'INPUT' && elem.hasAttribute('placeholder')) {
                elem.placeholder = t[key];
            } else {
                elem.innerText = t[key];
            }
        });
    });
}

// --- INITIALIZATION & AUTO-POLLING ---
document.addEventListener('DOMContentLoaded', () => {
    if (window.lucide) lucide.createIcons();

    // Set default language UI state
    setLanguage('bm');

    // 🚀 Load both live notices and live services status on load
    loadLiveNotices();
    loadLiveServices();

    // 🔄 Auto-refresh every 10 seconds to detect CMS edits in real-time
    setInterval(() => {
        loadLiveNotices();
        loadLiveServices();
    }, 10000);
});

// --- ACCESSIBILITY WIDGET ---
function toggleAccessibilityMenu() {
    const widget = document.getElementById('accessibilityWidget');
    if (widget) {
        widget.classList.toggle('hidden');
    }
}

function setTextSize(size) {
    const root = document.documentElement;
    if (size === 'normal') {
        root.style.fontSize = '16px';
    } else if (size === 'large') {
        root.style.fontSize = '19px';
    } else if (size === 'xlarge') {
        root.style.fontSize = '22px';
    }
}

function updateAccessibilityStyles() {
    const isGrayscale = document.getElementById('toggleGrayscale')?.checked;
    const isHighContrast = document.getElementById('toggleHighContrast')?.checked;
    const styleTag = document.getElementById('accessibility-styles');

    let css = '';

    if (isGrayscale) {
        css += `html { filter: grayscale(100%) !important; } `;
    }

    if (isHighContrast) {
        css += `
            body { 
                background-color: #000000 !important; 
                color: #ffff00 !important; 
            }
            button, a { 
                background-color: #1a1a1a !important; 
                color: #ffffff !important; 
                border-color: #ffff00 !important; 
            }
            .oku-widget-panel {
                background-color: #000000 !important;
                border-color: #ffff00 !important;
                color: #ffff00 !important;
            }
        `;
    }

    if (styleTag) {
        styleTag.innerHTML = css;
    }
}

function toggleGrayscale(checked) {
    updateAccessibilityStyles();
}

function toggleHighContrast(checked) {
    updateAccessibilityStyles();
}

function resetAccessibility() {
    document.documentElement.style.fontSize = '16px';

    const grayscaleCb = document.getElementById('toggleGrayscale');
    const contrastCb = document.getElementById('toggleHighContrast');

    if (grayscaleCb) grayscaleCb.checked = false;
    if (contrastCb) contrastCb.checked = false;

    updateAccessibilityStyles();
}

// --- FETCH LIVE NOTICES WITH MATCHING UNIT COLOR LABELS ---
async function loadLiveNotices() {
    const container = document.getElementById('noticesContainer') || document.getElementById('notices-list');
    if (!container) return;

    try {
        const response = await fetch('http://localhost:3000/api/notices');
        if (!response.ok) throw new Error('Failed to fetch notices');
        
        const notices = await response.json();

        container.innerHTML = '';

        if (!notices || notices.length === 0) {
            container.innerHTML = `<p class="text-stone-500 text-xs italic p-2">Tiada notis terkini buat masa ini.</p>`;
            return;
        }

        container.innerHTML = notices.map(notice => {
            const unitText = notice.unit || notice.category || 'Umum';
            const unitLower = unitText.toLowerCase();

            // Default fallback styles (Umum)
            let borderClass = 'border-amber-500';
            let badgeBg = 'bg-stone-200 text-stone-800';

            // 🟡 ARAS 8 / KKP (Amber / Orange theme)
            if (unitLower.includes('8') || unitLower.includes('kkp')) {
                borderClass = 'border-amber-500';
                badgeBg = 'bg-amber-100 text-amber-900';
            } 
            // 🔴 ARAS 22 / ICT (Maroon / Dark Red theme)
            else if (unitLower.includes('22') || unitLower.includes('ict')) {
                borderClass = 'border-rose-900';
                badgeBg = 'bg-rose-900 text-white';
            }

            return `
                <div class="card-interactive border-l-4 ${borderClass} pl-3 py-2 bg-stone-50/50 rounded-r-lg cursor-pointer mb-3" onclick="showToast('${notice.title.replace(/'/g, "\\'")}', 'info')">
                    <div class="flex items-center justify-between">
                        <span class="text-[10px] ${badgeBg} px-2 py-0.5 rounded font-bold uppercase tracking-wide">${unitText}</span>
                        <span class="text-[10px] text-stone-400 font-medium">${new Date(notice.created_at || Date.now()).toLocaleDateString('ms-MY')}</span>
                    </div>
                    <h5 class="text-xs font-bold text-stone-800 mt-1">${notice.title}</h5>
                    <p class="text-xs text-stone-500 mt-0.5">${notice.description || ''}</p>
                </div>
            `;
        }).join('');
    } catch (err) {
        console.error('Error loading notices from API:', err);
    }
}

// --- FETCH LIVE SERVICES STATUS ---
async function loadLiveServices() {
    const container = document.getElementById('statusListContainer');
    if (!container) return;

    try {
        const response = await fetch('http://localhost:3000/api/portal-data');
        if (!response.ok) throw new Error('Failed to fetch portal data');

        const data = await response.json();
        const services = data.services;

        if (!services || services.length === 0) return;

        container.innerHTML = '';

        container.innerHTML = services.map(service => {
            let badgeBg = 'bg-emerald-100 text-emerald-700';
            let dotBg = 'bg-emerald-500';
            let statusLabel = service.status || 'Beroperasi';

            const statusLower = service.status?.toLowerCase() || '';
            if (statusLower.includes('penyelenggaraan') || statusLower.includes('maintenance')) {
                badgeBg = 'bg-amber-100 text-amber-700';
                dotBg = 'bg-amber-500';
            } else if (statusLower.includes('gangguan') || statusLower.includes('down')) {
                badgeBg = 'bg-rose-100 text-rose-700';
                dotBg = 'bg-rose-500';
            }

            return `
                <div class="card-interactive flex items-center justify-between p-3.5 bg-stone-50 rounded-lg border border-stone-100 mb-2">
                    <div class="flex items-center space-x-3">
                        <span class="w-3 h-3 rounded-full ${dotBg}"></span>
                        <span class="font-medium text-sm text-stone-700">${service.name}</span>
                    </div>
                    <span class="text-xs ${badgeBg} font-semibold px-2.5 py-1 rounded-full">${statusLabel}</span>
                </div>
            `;
        }).join('');

    } catch (err) {
        console.error('Error loading live services:', err);
    }
}

// --- TOAST SYSTEM ---
function showToast(message, type = 'success') {
    const toast = document.getElementById('toastNotification');
    const toastMsg = document.getElementById('toastMessage');
    if (!toast || !toastMsg) return;

    toastMsg.innerText = message;
    toast.classList.remove('-translate-y-10', 'opacity-0', 'pointer-events-none');
    toast.classList.add('translate-y-0', 'opacity-100');

    setTimeout(() => {
        toast.classList.add('-translate-y-10', 'opacity-0', 'pointer-events-none');
        toast.classList.remove('translate-y-0', 'opacity-100');
    }, 3500);
}

// --- MODAL HANDLING ---
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('hidden');
        modal.classList.add('flex');
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
    }
}

// --- API SUBMISSION HANDLERS ---
async function handleFormSubmit(e) {
    e.preventDefault();
    const wing = document.getElementById('formWingSelect')?.value || 'ict';
    const inputs = e.target.querySelectorAll('input, select, textarea');
    
    let nameVal = '', floorVal = '', detailVal = '';
    inputs.forEach(input => {
        if (input.type === 'text') {
            if (!nameVal) nameVal = input.value;
            else if (!floorVal) floorVal = input.value;
        }
        if (input.tagName === 'TEXTAREA') detailVal = input.value;
    });

    const isHazard = wing === 'hazard';
    const submissionType = isHazard ? 'Laporan Hazard' : 'ICT Ticket';

    try {
        const response = await fetch('http://localhost:3000/api/submissions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                type: submissionType,
                name: nameVal || 'Pemohon',
                target_unit: isHazard ? 'Aras 8 (KKP)' : 'Aras 22 (ICT)',
                subject: floorVal ? `Lokasi: Tingkat ${floorVal}` : submissionType,
                detail: detailVal || ''
            })
        });

        if (response.ok) {
            const data = await response.json();
            closeModal('ticketModal');
            showToast(`${data.ref_id} ${isHazard ? translations[currentLang].toast_hazard_success : translations[currentLang].toast_ticket_success}`);
            e.target.reset();
        }
    } catch (error) {
        alert('Server API disconnect.');
    }
}

async function handleInquirySubmit(e) {
    e.preventDefault();
    const inputs = e.target.querySelectorAll('input, select, textarea');
    let nameVal = '', emailVal = '', targetUnitVal = '', subjectVal = '', detailVal = '';

    inputs.forEach((input, idx) => {
        if (input.type === 'email') emailVal = input.value;
        else if (input.tagName === 'INPUT' && idx === 0) nameVal = input.value;
        else if (input.tagName === 'SELECT') targetUnitVal = input.value;
        else if (input.tagName === 'INPUT' && idx === 3) subjectVal = input.value;
        else if (input.tagName === 'TEXTAREA') detailVal = input.value;
    });

    try {
        const response = await fetch('http://localhost:3000/api/submissions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                type: 'Pertanyaan',
                name: nameVal || 'Pelawat',
                email: emailVal || '',
                target_unit: targetUnitVal || 'Umum',
                subject: subjectVal || 'Pertanyaan',
                detail: detailVal || ''
            })
        });

        if (response.ok) {
            const data = await response.json();
            showToast(`${data.ref_id}: ${translations[currentLang].toast_inquiry_success}`);
            e.target.reset();
        }
    } catch (error) {
        alert('Server API disconnect.');
    }
}