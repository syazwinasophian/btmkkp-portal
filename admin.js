// Global State Storage
let cmsState = {
    services: [],
    notices: [],
    submissions: []
};

// Render Dashboard UI on Page Load
document.addEventListener('DOMContentLoaded', () => {
    if (window.lucide) lucide.createIcons();
    fetchCmsData();
});

// 1. Fetch All Real-Time Data from Node.js / PostgreSQL 18 API
async function fetchCmsData() {
    try {
        const response = await fetch('http://localhost:3000/api/portal-data');
        if (!response.ok) throw new Error('Network response was not ok');
        
        const data = await response.json();
        cmsState.services = data.services || [];
        cmsState.notices = data.notices || [];
        cmsState.submissions = data.submissions || [];

        renderCMS();
    } catch (err) {
        console.error('Failed to connect to backend server:', err);
        alert('Gagal berhubung dengan pangkalan data Node.js / PostgreSQL. Sila pastikan "npm start" sedang berjalan.');
    }
}

// 2. Render UI Components dynamically using Database Records
function renderCMS() {
    // Stats Calculations
    const ictCount = cmsState.submissions.filter(s => s.type === 'ICT Ticket').length;
    const hazardCount = cmsState.submissions.filter(s => s.type === 'Laporan Hazard').length;
    const inquiryCount = cmsState.submissions.filter(s => s.type === 'Pertanyaan').length;

    const statIct = document.getElementById('statIctCount');
    const statHazard = document.getElementById('statHazardCount');
    const statInquiry = document.getElementById('statInquiryCount');
    const statNotice = document.getElementById('statNoticeCount');

    if (statIct) statIct.innerText = ictCount;
    if (statHazard) statHazard.innerText = hazardCount;
    if (statInquiry) statInquiry.innerText = inquiryCount;
    if (statNotice) statNotice.innerText = cmsState.notices.length;

    // Status Controls
    const statusContainer = document.getElementById('cmsStatusList');
    if (statusContainer) {
        if (cmsState.services.length === 0) {
            statusContainer.innerHTML = `<p class="text-xs text-stone-400 italic p-2">Tiada rekod perkhidmatan dalam pangkalan data.</p>`;
        } else {
            statusContainer.innerHTML = cmsState.services.map((sys, idx) => `
                <div class="p-3.5 bg-stone-50 rounded-xl border border-stone-200 flex items-center justify-between">
                    <span class="text-xs font-bold text-stone-800">${sys.name}</span>
                    <select id="status_select_${sys.id}" class="text-xs border rounded-lg p-1.5 font-bold bg-white">
                        <option value="Beroperasi" ${sys.status === 'Beroperasi' ? 'selected' : ''}>Beroperasi</option>
                        <option value="Penyelenggaraan" ${sys.status === 'Penyelenggaraan' ? 'selected' : ''}>Penyelenggaraan</option>
                        <option value="Gangguan" ${sys.status === 'Gangguan' ? 'selected' : ''}>Gangguan Talian</option>
                    </select>
                </div>
            `).join('');
        }
    }

    // Notices Table
    const noticeTable = document.getElementById('cmsNoticeTable');
    if (noticeTable) {
        if (cmsState.notices.length === 0) {
            noticeTable.innerHTML = `<tr><td colspan="4" class="p-4 text-center text-sm text-stone-400 italic">Tiada notis direkodkan.</td></tr>`;
        } else {
            noticeTable.innerHTML = cmsState.notices.map(notice => `
                <tr>
                    <td class="p-3 font-bold text-stone-700">${notice.unit || 'Umum'}</td>
                    <td class="p-3 font-bold text-stone-900">${notice.title}</td>
                    <td class="p-3 text-stone-500">${notice.description || notice.desc || ''}</td>
                    <td class="p-3 text-right">
                        <button onclick="deleteNotice(${notice.id})" class="text-red-600 hover:text-red-800 font-bold transition">Padam</button>
                    </td>
                </tr>
            `).join('');
        }
    }

    // Submissions Table
    const subTable = document.getElementById('cmsSubmissionsTable');
    if (subTable) {
        if (cmsState.submissions.length === 0) {
            subTable.innerHTML = `<tr><td colspan="6" class="p-4 text-center text-sm text-stone-400 italic">Tiada aduan/tiket baharu diterima.</td></tr>`;
        } else {
            subTable.innerHTML = cmsState.submissions.map(sub => {
                const subDate = sub.created_at ? new Date(sub.created_at).toISOString().split('T')[0] : (sub.date || '-');
                const badgeColor = sub.type === 'ICT Ticket' 
                    ? 'bg-rose-100 text-rose-800' 
                    : sub.type === 'Laporan Hazard' 
                    ? 'bg-amber-100 text-amber-800' 
                    : 'bg-blue-100 text-blue-800';

                return `
                    <tr>
                        <td class="p-3 font-mono font-bold text-rose-900">${sub.ref_id || sub.id}</td>
                        <td class="p-3"><span class="px-2 py-0.5 rounded text-[10px] font-bold ${badgeColor}">${sub.type}</span></td>
                        <td class="p-3 font-bold text-stone-800">${sub.reporter_name || sub.name}</td>
                        <td class="p-3 text-stone-600">${sub.detail}</td>
                        <td class="p-3 text-stone-400 text-xs">${subDate}</td>
                        <td class="p-3 text-right">
                            <button onclick="deleteSubmission('${sub.ref_id || sub.id}')" class="text-stone-400 hover:text-stone-700 font-bold transition">Selesai / Padam</button>
                        </td>
                    </tr>
                `;
            }).join('');
        }
    }

    if (window.lucide) lucide.createIcons();
}

// 3. Service Status Actions (Save to Database)
async function saveStatuses() {
    // Gather all service dropdown selections dynamically from cmsState
    const updatedServices = cmsState.services.map(sys => {
        const selectElem = document.getElementById(`status_select_${sys.id}`);
        return {
            id: sys.id,
            name: sys.name,
            status: selectElem ? selectElem.value : sys.status
        };
    });

    try {
        const response = await fetch('http://localhost:3000/api/services', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ services: updatedServices })
        });

        if (response.ok) {
            alert('Status perkhidmatan berjaya dikemaskini ke pangkalan data!');
            // Refresh local state to confirm changes
            await fetchCmsData();
        } else {
            const errData = await response.json();
            alert('Gagal mengemaskini status: ' + (errData.error || 'Ralat tidak diketahui'));
        }
    } catch (err) {
        console.error('Error updating service statuses:', err);
        alert('Gagal berhubung dengan pelayan server.');
    }
}

// 4. Notice Modal Controls & API Actions
function openNoticeModal() {
    const modal = document.getElementById('noticeModal');
    if (modal) {
        modal.classList.remove('hidden');
        modal.classList.add('flex');
    }
}

function closeNoticeModal() {
    const modal = document.getElementById('noticeModal');
    if (modal) {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
    }
}

// Submit New Notice to Node.js -> PostgreSQL 18
async function handleNoticeSubmit(e) {
    e.preventDefault();

    const unitVal = document.getElementById('noticeUnit')?.value || 'KKP & ICT';
    const titleVal = document.getElementById('noticeTitle')?.value;
    const descVal = document.getElementById('noticeDesc')?.value;

    if (!titleVal || !descVal) {
        alert('Sila lengkapkan Tajuk dan Keterangan Notis.');
        return;
    }

    try {
        const response = await fetch('http://localhost:3000/api/notices', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                unit: unitVal,
                title: titleVal,
                description: descVal
            })
        });

        if (response.ok) {
            closeNoticeModal();
            e.target.reset();
            // Re-fetch database records so UI reflects instantly
            await fetchCmsData();
            alert('Notis baru berjaya disimpan ke pangkalan data PostgreSQL!');
        } else {
            const err = await response.json();
            alert('Ralat Pangkalan Data: ' + err.error);
        }
    } catch (err) {
        console.error('Error adding notice:', err);
        alert('Gagal menghubungi pelayan server.');
    }
}

// Delete Notice from PostgreSQL 18
async function deleteNotice(id) {
    if (!confirm('Adakah anda pasti mahu memadam notis ini?')) return;

    try {
        const response = await fetch(`http://localhost:3000/api/notices/${id}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            await fetchCmsData();
        } else {
            alert('Gagal memadam notis.');
        }
    } catch (err) {
        console.error('Delete notice error:', err);
    }
}

// Resolve/Delete Ticket or Submission from PostgreSQL 18
async function deleteSubmission(refId) {
    if (!confirm(`Tandakan rekod ${refId} sebagai SELESAI / PADAM?`)) return;

    try {
        const response = await fetch(`http://localhost:3000/api/submissions/${encodeURIComponent(refId)}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            await fetchCmsData();
        } else {
            alert('Gagal mengemas kini rekod.');
        }
    } catch (err) {
        console.error('Delete submission error:', err);
    }
}