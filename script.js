// Utility: calculate ability modifier
function abilityMod(score) {
    return Math.floor((score - 10) / 2);
}

// Update ability modifiers in UI
function updateMods() {
    ["str", "dex", "con", "int", "wis", "cha"].forEach(stat => {
        const score = parseInt(document.getElementById(stat).value) || 0;
        document.getElementById(stat + "Mod").textContent =
            (abilityMod(score) >= 0 ? "+" : "") + abilityMod(score);
    });
    saveToLocal();
}

// Save sheet data to localStorage
function saveToLocal() {
    const data = {};
    document.querySelectorAll("input, textarea").forEach(el => {
        data[el.id] = el.value;
    });
    localStorage.setItem("dnd5eSheet", JSON.stringify(data));
}

// Load sheet data from localStorage
function loadFromLocal() {
    const saved = JSON.parse(localStorage.getItem("dnd5eSheet") || "{}");
    Object.keys(saved).forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = saved[id];
    });
    updateMods();
}

// Add attack row
function addAttackRow(name = "", bonus = "", damage = "") {
    const tbody = document.querySelector("#attacksTable tbody");
    const row = document.createElement("tr");
    row.innerHTML = `
        <td><input type="text" value="${name}"></td>
        <td><input type="text" value="${bonus}"></td>
        <td><input type="text" value="${damage}"></td>
        <td><button class="deleteAttack">X</button></td>
    `;
    tbody.appendChild(row);
}

// Export JSON
function exportJSON() {
    const data = {};
    document.querySelectorAll("input, textarea").forEach(el => {
        data[el.id] = el.value;
    });
    const blob = new Blob([JSON.stringify(data, null, 2)], {type: "application/json"});
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "character.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

// Import JSON
function importJSON(file) {
    const reader = new FileReader();
    reader.onload = e => {
        const data = JSON.parse(e.target.result);
        Object.keys(data).forEach(id => {
            const el = document.getElementById(id);
            if (el) el.value = data[id];
        });
        updateMods();
        saveToLocal();
    };
    reader.readAsText(file);
}

// Event Listeners
document.addEventListener("DOMContentLoaded", () => {
    loadFromLocal();

    document.querySelectorAll("#str, #dex, #con, #int, #wis, #cha").forEach(el => {
        el.addEventListener("input", updateMods);
    });

    document.getElementById("saveSheet").addEventListener("click", saveToLocal);
    document.getElementById("loadSheet").addEventListener("click", loadFromLocal);
    document.getElementById("addAttack").addEventListener("click", () => addAttackRow());
    document.getElementById("exportJSON").addEventListener("click", exportJSON);
    document.getElementById("importButton").addEventListener("click", () => document.getElementById("importJSON").click());
    document.getElementById("importJSON").addEventListener("change", e => {
        if (e.target.files.length > 0) importJSON(e.target.files[0]);
    });
    document.getElementById("clearSheet").addEventListener("click", () => {
        localStorage.removeItem("dnd5eSheet");
        document.querySelectorAll("input, textarea").forEach(el => el.value = "");
        updateMods();
    });

    document.querySelector("#attacksTable").addEventListener("click", e => {
        if (e.target.classList.contains("deleteAttack")) {
            e.target.closest("tr").remove();
        }
    });
});