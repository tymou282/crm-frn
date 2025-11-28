/* ========= THEME TOGGLE ========= */
const themeToggle = document.getElementById("theme-toggle");

themeToggle?.addEventListener("click", () => {
    document.body.classList.toggle("dark-theme");
    localStorage.setItem("theme", document.body.classList.contains("dark-theme") ? "dark" : "light");
});

// Restore theme
if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark-theme");
}

/* ========= BURGER MENU ========= */
const burger = document.getElementById("burger");
const nav = document.getElementById("nav");

burger?.addEventListener("click", () => {
    nav.classList.toggle("open");
});

/* ========= TOASTS ========= */
const toastBox = document.createElement("div");
toastBox.classList.add("toast-box");
document.body.appendChild(toastBox);

function toast(msg) {
    const el = document.createElement("div");
    el.className = "toast";
    el.innerText = msg;
    toastBox.appendChild(el);
    setTimeout(() => el.remove(), 4000);
}
