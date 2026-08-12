(()=> {
'use strict';

const BACKUP_VERSION = 1;
const FILE_NAME = 'build-the-machine-backup.json';

function getAllStorage() {
  const data = {};
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key !== null) data[key] = localStorage.getItem(key);
  }
  return data;
}

function downloadBackup() {
  const payload = {
    format: 'BUILD_THE_MACHINE_BACKUP',
    version: BACKUP_VERSION,
    createdAt: new Date().toISOString(),
    origin: location.origin,
    data: getAllStorage()
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], {type: 'application/json'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = FILE_NAME.replace('.json', `-${new Date().toISOString().slice(0,10)}.json`);
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function restoreBackup(file) {
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const payload = JSON.parse(reader.result);
      if (!payload || payload.format !== 'BUILD_THE_MACHINE_BACKUP' || !payload.data || typeof payload.data !== 'object' || Array.isArray(payload.data)) {
        throw new Error('Invalid backup file.');
      }
      const keys = Object.keys(payload.data);
      if (!keys.length) throw new Error('Backup contains no saved app data.');
      const confirmed = window.confirm(`Restore ${keys.length} saved app items from this backup?\n\nThis will replace matching saved BUILD THE MACHINE data on this device. Your current data is not changed unless you confirm.`);
      if (!confirmed) return;
      keys.forEach(key => {
        const value = payload.data[key];
        if (typeof value === 'string') localStorage.setItem(key, value);
      });
      window.alert('Backup restored. The app will reload now.');
      location.reload();
    } catch (error) {
      window.alert(`Could not restore this backup. ${error?.message || ''}`.trim());
    }
  };
  reader.readAsText(file);
}

function wireBackupControls() {
  const exportBtn = document.getElementById('backupData');
  const importBtn = document.getElementById('restoreData');
  const fileInput = document.getElementById('restoreDataFile');
  if (!exportBtn || !importBtn || !fileInput) return;
  exportBtn.addEventListener('click', downloadBackup);
  importBtn.addEventListener('click', () => fileInput.click());
  fileInput.addEventListener('change', () => {
    const file = fileInput.files?.[0];
    if (file) restoreBackup(file);
    fileInput.value = '';
  });
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', wireBackupControls, {once:true});
else wireBackupControls();
})();