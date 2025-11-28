// =================== CONFIG ===================
const API = "https://tymou282.github.io/crm-frn";

// Универсальная функция запросов
async function api(url, method = "GET", body = null, auth = true) {
    const headers = { "Content-Type": "application/json" };

    if (auth) {
        const token = localStorage.getItem("token");
        if (!token) {
            toast("Сессия истекла, войдите снова!");
            location.href = "login.html";
            return;
        }
        headers["Authorization"] = "Bearer " + token;
    }

    const options = { method, headers };
    if (body) options.body = JSON.stringify(body);

    try {
        const res = await fetch(API + url, options);
        const data = await res.json().catch(() => ({}));

        if (!res.ok) {
            throw new Error(data.error || "Ошибка запроса");
        }

        return data;
    } catch (err) {
        console.error(err);
        toast("Ошибка: " + err.message);
        throw err;
    }
}



// =========================================
// LOGIN
// =========================================
async function login() {
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value;

    if (!username || !password) return toast("Заполните поля!");

    try {
        const data = await api("/auth/login", "POST", { username, password }, false);

        if (data.token) {
            localStorage.setItem("token", data.token);
            toast("Успешный вход!");
            setTimeout(() => location.href = "clients.html", 600);
        } else {
            toast("Неверный логин или пароль");
        }
    } catch {}
}



// =========================================
// REGISTER
// =========================================
async function register() {
    const username = document.getElementById("r_username").value.trim();
    const email = document.getElementById("r_email").value.trim();
    const password = document.getElementById("r_password").value;
    const password2 = document.getElementById("r_password2").value;

    if (!username || !email || !password) return toast("Заполните все поля!");
    if (password !== password2) return toast("Пароли не совпадают!");

    try {
        await api("/auth/register", "POST", { username, email, password }, false);
        toast("Регистрация успешна!");
        setTimeout(() => location.href = "login.html", 900);
    } catch {}
}



// =========================================
// LOGOUT
// =========================================
function logout() {
    showModal("Вы уверены, что хотите выйти?", () => {
        localStorage.removeItem("token");
        location.href = "login.html";
    });
}



// =========================================
// CLIENTS
// =========================================

// Сохраняем клиентов для поиска
let CLIENTS_CACHE = [];

async function loadClients() {
    try {
        const clients = await api("/clients");
        CLIENTS_CACHE = clients;

        renderClients(clients);
    } catch {}
}

function renderClients(list) {
    const div = document.getElementById("client_list");
    div.innerHTML = "";

    if (!list.length) {
        div.innerHTML = `<p>Нет клиентов</p>`;
        return;
    }

    list.forEach(c => {
        div.innerHTML += `
            <div class="card">
                <h3>${c.name}</h3>
                <p><b>Телефон:</b> ${c.phone || "—"}</p>
                <p><b>Email:</b> ${c.email || "—"}</p>
                <p><b>Компания:</b> ${c.company || "—"}</p>
                <p><i>${c.notes || ""}</i></p>

                <div class="row-btns">
                    <button class="btn" onclick='editClient(${JSON.stringify(c)})'>✏ Редактировать</button>
                    <button class="btn delete" onclick="deleteClient(${c.id})">Удалить</button>
                </div>
            </div>
        `;
    });
}

async function addClient() {
    const body = {
        name: document.getElementById("c_name").value.trim(),
        phone: document.getElementById("c_phone").value.trim(),
        email: document.getElementById("c_email").value.trim(),
        company: document.getElementById("c_company").value.trim(),
        notes: document.getElementById("c_notes").value.trim()
    };

    if (!body.name) return toast("Введите имя клиента!");

    try {
        await api("/clients", "POST", body);
        toast("Клиент добавлен!");
        loadClients();
    } catch {}
}

async function deleteClient(id) {
    showModal("Удалить клиента?", async () => {
        try {
            await api(`/clients/${id}`, "DELETE");
            toast("Клиент удалён");
            loadClients();
        } catch {}
    });
}

function editClient(c) {
    openClientModal(c);
}



// =========================================
// TASKS
// =========================================

let TASKS_CACHE = [];

async function loadTasks() {
    try {
        const tasks = await api("/tasks");
        TASKS_CACHE = tasks;

        renderTasks(tasks);
    } catch {}
}

function renderTasks(list) {
    const div = document.getElementById("task_list");
    div.innerHTML = "";

    if (!list.length) {
        div.innerHTML = `<p>Нет задач</p>`;
        return;
    }

    list.forEach(t => {
        div.innerHTML += `
            <div class="card">
                <h3>${t.title}</h3>
                <p>${t.description}</p>
                <p><b>Статус:</b> ${t.status}</p>
                <p><b>Ответственный:</b> ${t.assigned_to}</p>
                <p><b>Срок:</b> ${t.due_date}</p>

                <div class="row-btns">
                    <button class="btn" onclick='editTask(${JSON.stringify(t)})'>✏ Редактировать</button>
                    <button class="btn delete" onclick="deleteTask(${t.id})">Удалить</button>
                </div>
            </div>
        `;
    });
}

async function addTask() {
    const body = {
        title: document.getElementById("t_title").value.trim(),
        description: document.getElementById("t_desc").value.trim(),
        status: document.getElementById("t_status").value,
        assigned_to: document.getElementById("t_assigned").value.trim(),
        due_date: document.getElementById("t_due").value
    };

    if (!body.title) return toast("Введите название задачи!");

    try {
        await api("/tasks", "POST", body);
        toast("Задача добавлена!");
        loadTasks();
    } catch {}
}

async function deleteTask(id) {
    showModal("Удалить задачу?", async () => {
        try {
            await api(`/tasks/${id}`, "DELETE");
            toast("Задача удалена");
            loadTasks();
        } catch {}
    });
}

function editTask(t) {
    openTaskModal(t);
}



// =========================================
// ПОИСК
// =========================================
function searchClients(value) {
    value = value.toLowerCase();
    const filtered = CLIENTS_CACHE.filter(c =>
        c.name.toLowerCase().includes(value) ||
        (c.company || "").toLowerCase().includes(value)
    );
    renderClients(filtered);
}

function searchTasks(value) {
    value = value.toLowerCase();
    const filtered = TASKS_CACHE.filter(t =>
        t.title.toLowerCase().includes(value) ||
        (t.description || "").toLowerCase().includes(value)
    );
    renderTasks(filtered);
}



// =========================================
// MODALS (simple)
// =========================================

function showModal(text, onYes) {
    const bg = document.createElement("div");
    bg.className = "modal-bg active";

    bg.innerHTML = `
        <div class="modal">
            <h3>${text}</h3>
            <div style="margin-top:20px; display:flex; gap:10px;">
                <button class="btn" id="yesBtn">Да</button>
                <button class="btn btn-outline" id="noBtn">Отмена</button>
            </div>
        </div>
    `;

    document.body.appendChild(bg);

    bg.querySelector("#yesBtn").onclick = () => {
        onYes();
        bg.remove();
    };

    bg.querySelector("#noBtn").onclick = () => bg.remove();
}



// =========================================
// MODALS FOR EDITING (CLIENT / TASK)
// =========================================
// (хотя если хочешь — сделаю их красивыми с tabs, svg-иконками и т.п.)

function openClientModal(c) {
    const bg = document.createElement("div");
    bg.className = "modal-bg active";

    bg.innerHTML = `
        <div class="modal">
            <h3>Редактировать клиента</h3>
            <p>Имя</p>
            <input id="edit_name" value="${c.name}">
            <p>Телефон</p>
            <input id="edit_phone" value="${c.phone || ""}">
            <p>Email</p>
            <input id="edit_email" value="${c.email || ""}">
            <p>Компания</p>
            <input id="edit_company" value="${c.company || ""}">
            <p>Заметки</p>
            <textarea id="edit_notes">${c.notes || ""}</textarea>

            <div style="margin-top:20px; display:flex; gap:10px;">
                <button class="btn" id="saveBtn">Сохранить</button>
                <button class="btn btn-outline" id="cancelBtn">Отмена</button>
            </div>
        </div>
    `;

    document.body.appendChild(bg);

    bg.querySelector("#saveBtn").onclick = async () => {
        const body = {
            name: document.getElementById("edit_name").value.trim(),
            phone: document.getElementById("edit_phone").value.trim(),
            email: document.getElementById("edit_email").value.trim(),
            company: document.getElementById("edit_company").value.trim(),
            notes: document.getElementById("edit_notes").value.trim()
        };

        await api(`/clients/${c.id}`, "PUT", body);
        toast("Клиент обновлён!");
        bg.remove();
        loadClients();
    };

    bg.querySelector("#cancelBtn").onclick = () => bg.remove();
}

function openTaskModal(t) {
    const bg = document.createElement("div");
    bg.className = "modal-bg active";

    bg.innerHTML = `
        <div class="modal">
            <h3>Редактировать задачу</h3>
            <p>Название</p>
            <input id="et_title" value="${t.title}">
            <p>Описание</p>
            <textarea id="et_desc">${t.description || ""}</textarea>
            <p>Статус</p>
            <input id="et_status" value="${t.status}">
            <p>Ответственный</p>
            <input id="et_assigned" value="${t.assigned_to}">
            <p>Срок</p>
            <input id="et_due" type="date" value="${t.due_date}">

            <div style="margin-top:20px; display:flex; gap:10px;">
                <button class="btn" id="saveBtn">Сохранить</button>
                <button class="btn btn-outline" id="cancelBtn">Отмена</button>
            </div>
        </div>
    `;

    document.body.appendChild(bg);

    bg.querySelector("#saveBtn").onclick = async () => {
        const body = {
            title: document.getElementById("et_title").value.trim(),
            description: document.getElementById("et_desc").value.trim(),
            status: document.getElementById("et_status").value.trim(),
            assigned_to: document.getElementById("et_assigned").value.trim(),
            due_date: document.getElementById("et_due").value
        };

        await api(`/tasks/${t.id}`, "PUT", body);
        toast("Задача обновлена!");
        bg.remove();
        loadTasks();
    };

    bg.querySelector("#cancelBtn").onclick = () => bg.remove();
}

