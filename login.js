// ======================= UTILS =======================
function toast(msg, duration=3000){
    const t=document.createElement('div');
    t.className='toast';
    t.textContent=msg;
    document.body.appendChild(t);
    setTimeout(()=>{ t.style.opacity='0'; setTimeout(()=>t.remove(),500); }, duration);
}

// ======================= PASSWORD TOGGLE =======================
function togglePassword(){
    const passInput = document.querySelector('.password input');
    passInput.type = passInput.type === 'password' ? 'text' : 'password';
}

// ======================= LOGIN =======================
document.querySelector('.login-btn').onclick = function(){
    const username = document.querySelector('.login-card input[type="text"]').value.trim();
    const password = document.getElementById('password').value;

    if(!username || !password){
        toast("Заполните все поля!");
        return;
    }

    // Встроенный логин admin
    if(username === "admin" && password === "12345678"){
        localStorage.setItem("token", "dummy-admin-token"); // сохраняем токен для сессии
        toast("Успешный вход!");
        setTimeout(()=>location.href="tasks.html", 600);
        return;
    }

    // Если нужна интеграция с сервером, можно добавить обычный api-запрос здесь
    toast("Неверный логин или пароль");
};
