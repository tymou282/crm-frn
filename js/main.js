// =================== CONFIG ===================
const API = "https://tymou282.github.io/crm-frn"; // УБРАЛ лишний слэш

// Универсальный запрос с обработкой ошибок
async function api(url, method = "GET", body = null, auth = true) {
    const headers = {
        "Content-Type": "application/json"
    };

    // Добавляем токен
    if (auth) {
        const token = localStorage.getItem("token");
        if (!token) {
            alert("Сессия истекла, войдите заново!");
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
            throw new Error(data.error || JSON.stringify(data) || "Ошибка запроса");
        }

        return data;
    } catch (err) {
        console.error(err);
        alert(err.message || "Ошибка сети!");
        throw err;
    }
}



// =================== LOGIN ===================
async function login() {
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value;

    if (!username || !password) {
        alert("Введите логин и пароль!");
        return;
    }

    try {
        const data = await api("/auth/login", "POST", { username, password }, false);

        if (data.token) {
            localStorage.setItem("token", data.token);
            location.href = "clients.html";
        } else {
            alert("Ошибка авторизации!");
        }
    } catch {}
}



// =================== REGISTER ===================
async function register() {
    const username = document.getElementById("r_username").value.trim();
    const email = document.getElementById("r_email").value.trim();
    const password = document.getElementById("r_password").value;
    const password2 = document.getElementById("r_password2").value;

    if (!username || !email || !password) {
        alert("Заполните все поля!");
        return;
    }

    if (password !== password2) {
        alert("Пароли не совпадают!");
        return;
    }

    try {
        await api("/auth/register", "POST", { username, email, password }, false);
        alert("Регистрация успешна!");
        location.href = "login.html";
    } catch {}
}



// =================== LOGOUT ===================
function logout() {
    if (confirm("Вы уверены, что хотите выйти?")) {
        localStorage.removeItem("token");
        location.href = "login.html";
    }
}



// =================== CLIENTS ===================
async function loadClients() {
    try {
        const clients = await api("/clients", "GET", null);

        const div = document.getElementById("client_list");
        div.innerHTML = "";

        if (clients.length === 0) {
            div.innerHTML = `<p>Клиентов нет. Добавьте первого!</p>`;
            return;
        }

        clients.forEach(c => {
            div.innerHTML += `
                <div class="client">
                    <h3>${c.name}</h3>
                    <p><b>Телефон:</b> ${c.phone || "—"}</p>
                    <p><b>Email:</b> ${c.email || "—"}</p>
                    <p><b>Компания:</b> ${c.company || "—"}</p>
                    <p><i>${c.notes || ""}</i></p>

                    <button class="btn delete" onclick="deleteClient(${c.id})">Удалить</button>
                </div>
            `;
        });

    } catch {}
}

async function addClient() {
    const body = {
        name: document.getElementById("c_name").value.trim(),
        phone: document.getElementById("c_phone").value.trim(),
        email: document.getElementById("c_email").value.trim(),
        company: document.getElementById("c_company").value.trim(),
        notes: document.getElementById("c_notes").value.trim()
    };

    if (!body.name) {
        alert("Введите имя клиента!");
        return;
    }

    try {
        await api("/clients", "POST", body);
        loadClients();
    } catch {}
}

async function deleteClient(id) {
    if (!confirm("Удалить клиента?")) return;

    try {
        await api(`/clients/${id}`, "DELETE");
        loadClients();
    } catch {}
}



// =================== TASKS ===================
async function loadTasks() {
    try {
        const tasks = await api("/tasks");

        const div = document.getElementById("task_list");
        div.innerHTML = "";

        if (tasks.length === 0) {
            div.innerHTML = `<p>Задач нет. Добавьте первую!</p>`;
            return;
        }

        tasks.forEach(t => {
            div.innerHTML += `
                <div class="task-item">
                    <h3>${t.title}</h3>
                    <p>${t.description}</p>
                    <p><b>Статус:</b> ${t.status}</p>
                    <p><b>Ответственный:</b> ${t.assigned_to}</p>
                    <p><b>Срок:</b> ${t.due_date}</p>

                    <button class="btn delete" onclick="deleteTask(${t.id})">Удалить</button>
                </div>
            `;
        });
    } catch {}
}

async function addTask() {
    const body = {
        title: document.getElementById("t_title").value.trim(),
        description: document.getElementById("t_desc").value.trim(),
        status: document.getElementById("t_status").value,
        assigned_to: document.getElementById("t_assigned").value.trim(),
        due_date: document.getElementById("t_due").value
    };

    if (!body.title) {
        alert("Введите название задачи!");
        return;
    }

    try {
        await api("/tasks", "POST", body);
        loadTasks();
    } catch {}
}

async function deleteTask(id) {
    if (!confirm("Удалить задачу?")) return;

    try {
        await api(`/tasks/${id}`, "DELETE");
        loadTasks();
    } catch {}
}
