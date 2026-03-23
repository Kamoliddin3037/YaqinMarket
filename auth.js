// auth.js

function login(username, password){
    if(username === "admin" && password === "12345"){
        localStorage.setItem("auth", "ok");
        window.location.href = "dashboard.html";
    } else {
        alert("Login yoki parol noto‘g‘ri");
    }
}

function checkAuth(){
    if(localStorage.getItem("auth") !== "ok"){
        window.location.href = "index.html";
    }
}

function logout(){
    localStorage.removeItem("auth");
    window.location.href = "index.html";
}