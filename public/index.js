const username = document.querySelector('#name');
const password = document.querySelector('#password');
const login = document.querySelector("button");
const fail = document.querySelector('#fail');
sessionCheck();

/**
 * Simple post function posting on a url
 */

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

/**
 * Simple get function for fetching json from a url
 */

async function GET(url) {
    const OK = 200;
    let response = await fetch(url);
    if (response.status !== OK)
        throw new Error("GET status code " + response.status);
    return await response.json();
}
async function sessionCheck() {
    let userRole = await GET("api/login/session");
    if (userRole !== "noAccess") {
        window.location = "adminAccess.html"
    }
}

/**
 * Simple onclick function for login screen
 */

login.onclick = async () => {
    try {
        let response = await POST("/api/login", {username: username.value, password: password.value});
        if (response.ok) {
            window.location = 'adminAccess.html';
        } else {
            password.value = "";
            fail.innerHTML = "Forkert password!";
        }
    } catch (e) {
        fail.innerHTML = e.name + ": " + e.message;
    }
};

