import axios from "axios";

export const registration = (formData, url) => {
    axios({
            method: "post",
            url: url,
            data: formData,
            headers: { "Content-Type": "multipart/form-data" }
        })
        .then(function(response) {
            console.log(response);
            let formData2 = new FormData(),
                name = formData.get('name'),
                lname = formData.get('lname'),
                email = formData.get('email'),
                password = formData.get('password');

            formData2.set("email", email);
            formData2.set("password", password);

            login(formData2, "https://api.topmediagroups.com/login", name, lname);
        })
        .catch(function(response) {
            console.log(response);
        });
}

const login = (formData, url, name, lname) => {
    axios({
            method: "post",
            url: url,
            data: formData
        })
        .then(function(response) {
            console.log(response);
            let formData3 = new FormData(),
                fullname = name + " " + lname,
                description = "Я успешно прошел тестовое задание",
                Bearer_token = response.data.message.Authorization;

            formData3.set("name", fullname);
            formData3.set("description", description);

            tasks(formData3, "https://api.topmediagroups.com/api/v1/tasks", Bearer_token, name);
        })
        .catch(function(response) {
            console.log(response);
        });
}

const tasks = (formData, url, token, username) => {
    axios({
            method: "get",
            url: url,
            data: formData,
            headers: { "Authorization": token }
        })
        .then(function(response) {
            console.log(response);
            if (response.status === 200) {
                localStorage.setItem("name", username);
                window.location.href = "thanks.html";
            }
        })
        .catch(function(response) {
            console.log(response);
        });
}