// ============ Constants ============
const CLOCKIFY_API_BASE = 'https://api.clockify.me/api/v1';

// ============ DOM Elements ============
const apiKeyInput = document.getElementById('apiKey');
const togglePasswordBtn = document.getElementById('togglePassword');
const startDateInput = document.getElementById('startDate');
const endDateInput = document.getElementById('endDate');
const workspaceSelect = document.getElementById('workspace');
const includeDescriptionCheckbox = document.getElementById('includeDescription');
const fetchBtn = document.getElementById('fetchBtn');
const exportBtn = document.getElementById('exportBtn');
const loadingState = document.getElementById('loadingState');
const loadingText = document.getElementById('loadingText');
const infoAlert = document.getElementById('infoAlert');
const successAlert = document.getElementById('successAlert');
const errorAlert = document.getElementById('errorAlert');
const resultsSection = document.getElementById('resultsSection');
const recordsTable = document.getElementById('recordsTable');
const recordsBody = document.getElementById('recordsBody');
const recordCountSpan = document.getElementById('recordCount');
const totalTimeSpan = document.getElementById('totalTime');

// ============ State ============
let currentApiKey = '';
let currentWorkspaceId = '';
let fetchedRecords = [];
let workspaceIdMap = {};

// ============ Initialize ============
document.addEventListener('DOMContentLoaded', () => {
    setupEventListeners();
    setDefaultDates();
    loadSavedApiKey();
    
    // Initially disable all buttons
    fetchBtn.disabled = true;
    exportBtn.disabled = true;
    workspaceSelect.disabled = true;
});

// ============ Event Listeners ============
function setupEventListeners() {
    togglePasswordBtn.addEventListener('click', togglePasswordVisibility);
    fetchBtn.addEventListener('click', handleFetch);
    exportBtn.addEventListener('click', handleExport);
    apiKeyInput.addEventListener('input', saveApiKey);
    apiKeyInput.addEventListener('change', saveApiKey);
    document.getElementById('checkWorkspacesBtn').addEventListener('click', handleCheckWorkspaces);
}

function togglePasswordVisibility() {
    const isPassword = apiKeyInput.type === 'password';
    apiKeyInput.type = isPassword ? 'text' : 'password';
    togglePasswordBtn.style.color = isPassword ? '#667eea' : '#718096';
}

async function handleCheckWorkspaces() {
    if (!apiKeyInput.value.trim()) {
        showAlert('error', 'Please enter your Clockify API key first');
        return;
    }

    currentApiKey = apiKeyInput.value.trim();
    showLoading(true, 'Loading workspaces...');
    
    try {
        const workspaces = await fetchWorkspaces();
        if (workspaces && workspaces.length > 0) {
            populateWorkspaceSelect(workspaces);
            fetchBtn.disabled = false;
            showLoading(false);
            showAlert('success', 'Workspaces loaded successfully. Select one to continue.');
        } else {
            showLoading(false);
            showAlert('error', 'No workspaces found');
        }
    } catch (error) {
        showLoading(false);
        showAlert('error', 'Failed to load workspaces: ' + error.message);
    }
}

function setDefaultDates() {
    const today = new Date();
    const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 25);
    const date25th = new Date(today.getFullYear(), today.getMonth(), 25);
    
    startDateInput.value = lastMonth.toISOString().split('T')[0];
    endDateInput.value = date25th.toISOString().split('T')[0];
}

async function saveApiKey() {
    const apiKey = apiKeyInput.value.trim();
    if (!apiKey) return;

    try {
        const response = await fetch('/api/key', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ apiKey })
        });

        if (!response.ok) {
            console.error('Failed to save API key');
        }
    } catch (error) {
        console.error('Error saving API key:', error);
    }
}

async function loadSavedApiKey() {
    try {
        const response = await fetch('/api/key');
        if (response.ok) {
            const data = await response.json();
            if (data.apiKey) {
                apiKeyInput.value = data.apiKey;
            }
        }
    } catch (error) {
        console.error('Error loading API key:', error);
    }
}

// ============ Alert Functions ============
function showAlert(type, message) {
    const alertElement = 
        type === 'info' ? infoAlert :
        type === 'success' ? successAlert :
        type === 'error' ? errorAlert : null;

    if (alertElement) {
        alertElement.textContent = message;
        alertElement.style.display = 'flex';
        
        if (type === 'success' || type === 'info') {
            setTimeout(() => {
                alertElement.style.display = 'none';
            }, 5000);
        }
    }
}

function hideAllAlerts() {
    infoAlert.style.display = 'none';
    successAlert.style.display = 'none';
    errorAlert.style.display = 'none';
}

// ============ API Functions ============
async function fetchUserData() {
    try {
        const response = await fetch(`${CLOCKIFY_API_BASE}/user`, {
            headers: {
                'X-Api-Key': currentApiKey
            }
        });

        if (!response.ok) {
            throw new Error('Invalid API key or network error');
        }

        return await response.json();
    } catch (error) {
        throw new Error('Failed to fetch user data: ' + error.message);
    }
}

async function fetchWorkspaces() {
    try {
        const response = await fetch(`${CLOCKIFY_API_BASE}/workspaces`, {
            headers: {
                'X-Api-Key': currentApiKey
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch workspaces');
        }

        return await response.json();
    } catch (error) {
        throw new Error('Failed to fetch workspaces: ' + error.message);
    }
}

async function fetchTimeEntries(workspaceId, startDate, endDate) {
    try {
        // First, get the current user
        const userResponse = await fetch(`${CLOCKIFY_API_BASE}/user`, {
            headers: {
                'X-Api-Key': currentApiKey
            }
        });

        if (!userResponse.ok) {
            throw new Error('Failed to fetch user data');
        }

        const userData = await userResponse.json();
        const userId = userData.id;

        // Then fetch time entries for the user
        const rangeStart = startDate + 'T00:00:00.000Z';
        const rangeEnd = endDate + 'T23:59:59.999Z';

        const params = new URLSearchParams({
            'start': rangeStart,
            'end': rangeEnd,
            'page-size': 5000
        });

        const response = await fetch(
            `${CLOCKIFY_API_BASE}/workspaces/${workspaceId}/user/${userId}/time-entries?${params}`,
            {
                headers: {
                    'X-Api-Key': currentApiKey
                }
            }
        );

        if (!response.ok) {
            throw new Error(`Failed to fetch time entries: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        throw new Error('Failed to fetch time entries: ' + error.message);
    }
}

// ============ Main Handler Functions ============
async function handleFetch() {
    hideAllAlerts();
    
    if (!currentWorkspaceId) {
        showAlert('error', 'Please select a workspace first');
        return;
    }

    if (!startDateInput.value || !endDateInput.value) {
        showAlert('error', 'Please select both start and end dates');
        return;
    }

    recordsBody.innerHTML = '';
    resultsSection.style.display = 'none';
    fetchBtn.disabled = true;
    exportBtn.disabled = true;
    showLoading(true, 'Fetching time entries...');

    try {
        const startDate = startDateInput.value;
        const endDate = endDateInput.value;

        const timeEntries = await fetchTimeEntries(currentWorkspaceId, startDate, endDate);
        
        if (!timeEntries || timeEntries.length === 0) {
            showLoading(false);
            showAlert('info', 'No time entries found for the selected period');
            fetchBtn.disabled = false;
            return;
        }

        // Process and display records
        fetchedRecords = processTimeEntries(timeEntries);
        displayRecords(fetchedRecords);

        showLoading(false);
        showAlert('success', `Successfully fetched ${fetchedRecords.length} time entries`);
        exportBtn.disabled = false;
        fetchBtn.disabled = false;

    } catch (error) {
        showLoading(false);
        showAlert('error', error.message);
        fetchBtn.disabled = false;
    }
}

function populateWorkspaceSelect(workspaces) {
    workspaceSelect.innerHTML = '<option value="">Select a workspace...</option>';
    workspaceIdMap = {};
    
    workspaces.forEach(ws => {
        workspaceIdMap[ws.id] = ws.name;
        const option = document.createElement('option');
        option.value = ws.id;
        option.textContent = ws.name;
        workspaceSelect.appendChild(option);
    });

    // Enable workspace selection
    workspaceSelect.disabled = false;
    workspaceSelect.addEventListener('change', (e) => {
        if (e.target.value) {
            currentWorkspaceId = e.target.value;
        }
    });
}

function processTimeEntries(entries) {
    return entries.map(entry => {
        const startTime = new Date(entry.timeInterval.start);
        const endTime = entry.timeInterval.end ? new Date(entry.timeInterval.end) : new Date();
        
        const durationMs = endTime - startTime;
        const hours = (durationMs / (1000 * 60 * 60)).toFixed(2);

        return {
            date: startTime.toLocaleDateString('en-US'),
            project: entry.projectName || 'No Project',
            task: entry.description || 'No Description',
            duration: `${hours}h`,
            startTime: startTime.toLocaleTimeString('en-US', { 
                hour: '2-digit', 
                minute: '2-digit',
                second: '2-digit',
                hour12: true 
            }),
            endTime: endTime.toLocaleTimeString('en-US', { 
                hour: '2-digit', 
                minute: '2-digit',
                second: '2-digit',
                hour12: true 
            }),
            durationMs: durationMs
        };
    }).sort((a, b) => new Date(b.date) - new Date(a.date));
}

function displayRecords(records) {
    recordsBody.innerHTML = '';
    
    // Calculate totals
    const totalMs = records.reduce((sum, r) => sum + r.durationMs, 0);
    const totalHours = (totalMs / (1000 * 60 * 60)).toFixed(2);
    
    recordCountSpan.textContent = records.length;
    totalTimeSpan.textContent = `${totalHours}h`;

    // Populate table
    records.forEach(record => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${record.date}</td>
            <td>${includeDescriptionCheckbox.checked ? record.task : '—'}</td>
            <td><span style="background: #f0f0f0; padding: 4px 8px; border-radius: 4px; font-weight: 600; color: #667eea;">${record.duration}</span></td>
            <td>${record.startTime}</td>
            <td>${record.endTime}</td>
        `;
        recordsBody.appendChild(row);
    });

    resultsSection.style.display = 'block';
    resultsSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

async function handleExport() {
    if (!fetchedRecords || fetchedRecords.length === 0) {
        showAlert('error', 'No records to export');
        return;
    }

    // Check if XLSX is loaded
    if (typeof XLSX === 'undefined') {
        showAlert('error', 'Excel library is not loaded. Please refresh the page and try again.');
        return;
    }

    try {
        showLoading(true, 'Generating Excel file...');

        // Prepare data for Excel
        const excelData = fetchedRecords.map(record => ({
            Date: record.date,
            Task: includeDescriptionCheckbox.checked ? record.task : '',
            Duration: record.duration,
            'Start Time': record.startTime,
            'End Time': record.endTime
        }));

        // Add summary row
        const totalMs = fetchedRecords.reduce((sum, r) => sum + r.durationMs, 0);
        const totalHours = (totalMs / (1000 * 60 * 60)).toFixed(2);
        
        excelData.push({
            Date: '',
            Project: 'TOTAL',
            Task: '',
            Duration: `${totalHours}h`,
            'Start Time': '',
            'End Time': ''
        });

        // Create workbook
        const ws = XLSX.utils.json_to_sheet(excelData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Time Entries');

        // Set column widths
        ws['!cols'] = [
            { wch: 12 },
            { wch: 30 },
            { wch: 12 },
            { wch: 12 },
            { wch: 12 }
        ];

        // Generate filename
        const startDate = startDateInput.value;
        const endDate = endDateInput.value;
        const filename = `Clockify_Export_${startDate}_to_${endDate}.xlsx`;

        // Download
        XLSX.writeFile(wb, filename);
        
        showLoading(false);
        showAlert('success', `Successfully exported to ${filename}`);

    } catch (error) {
        showLoading(false);
        showAlert('error', 'Failed to generate Excel file: ' + error.message);
    }
}

// ============ Utility Functions ============
function showLoading(show, text = 'Processing...') {
    if (show) {
        loadingState.style.display = 'flex';
        if (text) loadingText.textContent = text;
    } else {
        loadingState.style.display = 'none';
    }
}
