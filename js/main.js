// ------------------- LOGIN -------------------

async function login() {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    // Простая локальная проверка
    if (username === "admin" && password === "1234") {
        localStorage.setItem("token", "fake-token");
        location.href = "clients.html"; // Перенаправление на страницу клиентов
    } else {
        alert("Ошибка: неверный логин или пароль");
    }
}

// ------------------- AUTH CHECK -------------------

function checkAuth() {
    if (!localStorage.getItem("token")) {
        alert("Сначала войдите в систему!");
        location.href = "login.html";
    }
}

// ------------------- CLIENTS -------------------

function loadClients() {
    checkAuth();

    let clients = JSON.parse(localStorage.getItem("clients") || "[]");
    const div = document.getElementById("client_list");
    div.innerHTML = "";

    clients.forEach((c, index) => {
        div.innerHTML += `
        <div class="client">
            <b>${c.name}</b><br>
            Телефон: ${c.phone}<br>
            Email: ${c.email}<br>
            Компания: ${c.company}<br>
            <i>${c.notes}</i><br><br>
            <button class="btn delete" onclick="deleteClient(${index})">Удалить</button>
        </div>`;
    });
}

function addClient() {
    const clients = JSON.parse(localStorage.getItem("clients") || "[]");

    const client = {
        name: document.getElementById("c_name").value,
        phone: document.getElementById("c_phone").value,
        email: document.getElementById("c_email").value,
        company: document.getElementById("c_company").value,
        notes: document.getElementById("c_notes").value
    };

    clients.push(client);
    localStorage.setItem("clients", JSON.stringify(clients));
    loadClients();
}

function deleteClient(index) {
    let clients = JSON.parse(localStorage.getItem("clients") || "[]");
    clients.splice(index, 1);
    localStorage.setItem("clients", JSON.stringify(clients));
    loadClients();
}

// ------------------- TASKS -------------------

function loadTasks() {
    checkAuth();

    let tasks = JSON.parse(localStorage.getItem("tasks") || "[]");
    const div = document.getElementById("task_list");
    div.innerHTML = "";

    tasks.forEach((t, index) => {
        div.innerHTML += `
        <div class="task-item">
            <b>${t.title}</b><br>
            ${t.description}<br>
            Статус: ${t.status}<br>
            Ответственный: ${t.assigned_to}<br>
            Срок: ${t.due_date}<br><br>
            <button class="btn delete" onclick="deleteTask(${index})">Удалить</button>
        </div>`;
    });
}

function addTask() {
    let tasks = JSON.parse(localStorage.getItem("tasks") || "[]");

    const task = {
        title: document.getElementById("t_title").value,
        description: document.getElementById("t_desc").value,
        status: document.getElementById("t_status").value,
        assigned_to: document.getElementById("t_assigned").value,
        due_date: document.getElementById("t_due").value
    };

    tasks.push(task);
    localStorage.setItem("tasks", JSON.stringify(tasks));
    loadTasks();
}

function deleteTask(index) {
    let tasks = JSON.parse(localStorage.getItem("tasks") || "[]");
    tasks.splice(index, 1);
    localStorage.setItem("tasks", JSON.stringify(tasks));
    loadTasks();
}

// ------------------- LOGOUT -------------------

function logout() {
    localStorage.removeItem("token");
    location.href = "login.html";
}
