if (localStorage.getItem('adminToken')) {
    window.location.href = 'admin.html';
}

document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const errorDiv = document.getElementById('error');

    try {
        await api.login(username, password);
        window.location.href = 'admin.html';
    } catch (err) {
        errorDiv.textContent = `Error: ${err.message}`;
        errorDiv.classList.remove('hidden');
    }
});

