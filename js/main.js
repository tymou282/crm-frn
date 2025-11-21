const API = "https://НАЗВАНИЕ_САЙТА";

// ------------------- LOGIN -------------------

async function login() {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    const res = await fetch(API + "/auth/login", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({username, password})
    });

    const data = await res.json();

    if (data.token) {
        localStorage.setItem("token", data.token);
        location.href = "clients.html";
    } else {
        alert("Ошибка: " + data.error);
    }
}

// ------------------- CLIENTS -------------------

async function loadClients() {
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
}

async function addClient() {
    const body = {
        name: document.getElementById("c_name").value,
        phone: document.getElementById("c_phone").value,
        email: document.getElementById("c_email").value,
        company: document.getElementById("c_company").value,
        notes: document.getElementById("c_notes").value
    };

    await fetch(API + "/clients", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + localStorage.getItem("token")
        },
        body: JSON.stringify(body)
    });

    loadClients();
}

async function deleteClient(id) {
    await fetch(API + "/clients/" + id, {
        method: "DELETE",
        headers: { "Authorization": "Bearer " + localStorage.getItem("token") }
    });

    loadClients();
}

// ------------------- TASKS -------------------

async function loadTasks() {
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
}

async function addTask() {
    const body = {
        title: document.getElementById("t_title").value,
        description: document.getElementById("t_desc").value,
        status: document.getElementById("t_status").value,
        assigned_to: document.getElementById("t_assigned").value,
        due_date: document.getElementById("t_due").value
    };

    await fetch(API + "/tasks", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + localStorage.getItem("token")
        },
        body: JSON.stringify(body)
    });

    loadTasks();
}

async function deleteTask(id) {
    await fetch(API + "/tasks/" + id, {
        method: "DELETE",
        headers: { "Authorization": "Bearer " + localStorage.getItem("token") }
    });

    loadTasks();
}
