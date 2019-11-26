const username = document.querySelector('#name');
const password = document.querySelector('#password');
const login = document.querySelector('#login');
const fail = document.querySelector('#fail');

async function POST(url, data) {
    const CREATED = 200;
    let response = await fetch(url, {
        method: "POST",
        body: JSON.stringify(data),
        headers: {'Content-Type': 'application/json'}
    });
    if (response.status !== CREATED)
        throw new Error("POST status code " + response.status);
    return await response.json();
}

async function GET(url) {
    const OK = 200;
    let response = await fetch(url);
    if (response.status !== OK)
        throw new Error("GET status code " + response.status);
    return await response.json();
}

login.onclick = async () => {
    try {
        const response = await POST("/api/login", {username: username.value, password: password.value});
        if (response.ok) {
            window.location.href = '/api/login/session';
        } else {
            password.value = "";
            fail.innerHTML = "Forkert password!";
        }
    } catch (e) {
        fail.innerHTML = e.name + ": " + e.message;
    }
};

