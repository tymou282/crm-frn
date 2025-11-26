const API = "https://НАЗВАНИЕ_САЙТА"; // Замените на ваш API

// ------------------- LOGIN -------------------
async function login() {
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value;

    if (!username || !password) {
        alert("Пожалуйста, заполните логин и пароль!");
        return;
    }

    try {
        const res = await fetch(API + "/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password })
        });

        const data = await res.json();

        if (res.ok && data.token) {
            localStorage.setItem("token", data.token);
            location.href = "clients.html";
        } else {
            alert("Ошибка: " + (data.error || "Неверный логин или пароль"));
        }
    } catch (err) {
        console.error(err);
        alert("Ошибка сети или сервера!");
    }
}

// ------------------- REGISTER -------------------
async function register() {
    const username = document.getElementById("r_username").value.trim();
    const email = document.getElementById("r_email").value.trim();
    const password = document.getElementById("r_password").value;
    const password2 = document.getElementById("r_password2").value;

    if (!username || !email || !password || !password2) {
        alert("Пожалуйста, заполните все поля!");
        return;
    }

    if (password !== password2) {
        alert("Пароли не совпадают!");
        return;
    }

    try {
        const res = await fetch(API + "/auth/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, email, password })
        });

        const data = await res.json();

        if (res.ok) {
            alert("Регистрация успешна! Войдите в систему.");
            location.href = "login.html";
        } else {
            alert("Ошибка: " + (data.error || JSON.stringify(data)));
        }
    } catch (err) {
        console.error(err);
        alert("Ошибка сети или сервера!");
    }
}

// ------------------- LOGOUT -------------------
function logout() {
    localStorage.removeItem("token");
    location.href = "login.html";
}

// ------------------- CLIENTS -------------------
async function loadClients() {
    try {
        const res = await fetch(API + "/clients", {
            headers: { "Authorization": "Bearer " + localStorage.getItem("token") }
        });
        const clients = await res.json();
        const div = document.getElementById("client_list");
        div.innerHTML = "";

        clients.forEach(c => {
            div.innerHTML += `
            <div class="client">
                <b>${c.name}</b><br>
                Телефон: ${c.phone}<br>
                Email: ${c.email}<br>
                Компания: ${c.company}<br>
                <i>${c.notes}</i><br><br>
                <button class="btn delete" onclick="deleteClient(${c.id})">Удалить</button>
            </div>`;
        });
    } catch (err) {
        console.error(err);
        alert("Не удалось загрузить клиентов!");
    }
}

async function addClient() {
    const body = {
        name: document.getElementById("c_name").value,
        phone: document.getElementById("c_phone").value,
        email: document.getElementById("c_email").value,
        company: document.getElementById("c_company").value,
        notes: document.getElementById("c_notes").value
    };

    try {
        await fetch(API + "/clients", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("token")
            },
            body: JSON.stringify(body)
        });
        loadClients();
    } catch (err) {
        console.error(err);
        alert("Не удалось добавить клиента!");
    }
}

async function deleteClient(id) {
    try {
        await fetch(API + "/clients/" + id, {
            method: "DELETE",
            headers: { "Authorization": "Bearer " + localStorage.getItem("token") }
        });
        loadClients();
    } catch (err) {
        console.error(err);
        alert("Не удалось удалить клиента!");
    }
}

// ------------------- TASKS -------------------
async function loadTasks() {
    try {
        const res = await fetch(API + "/tasks", {
            headers: { "Authorization": "Bearer " + localStorage.getItem("token") }
        });
        const tasks = await res.json();
        const div = document.getElementById("task_list");
        div.innerHTML = "";

        tasks.forEach(t => {
            div.innerHTML += `
            <div class="task-item">
                <b>${t.title}</b><br>
                ${t.description}<br>
                Статус: ${t.status}<br>
                Ответственный: ${t.assigned_to}<br>
                Срок: ${t.due_date}<br><br>
                <button class="btn delete" onclick="deleteTask(${t.id})">Удалить</button>
            </div>`;
        });
    } catch (err) {
        console.error(err);
        alert("Не удалось загрузить задачи!");
    }
}

async function addTask() {
    const body = {
        title: document.getElementById("t_title").value,
        description: document.getElementById("t_desc").value,
        status: document.getElementById("t_status").value,
        assigned_to: document.getElementById("t_assigned").value,
        due_date: document.getElementById("t_due").value
    };

    try {
        await fetch(API + "/tasks", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("token")
            },
            body: JSON.stringify(body)
        });
        loadTasks();
    } catch (err) {
        console.error(err);
        alert("Не удалось добавить задачу!");
    }
}

async function deleteTask(id) {
    try {
        await fetch(API + "/tasks/" + id, {
            method: "DELETE",
            headers: { "Authorization": "Bearer " + localStorage.getItem("token") }
        });
        loadTasks();
    } catch (err) {
        console.error(err);
        alert("Не удалось удалить задачу!");
    }
}
