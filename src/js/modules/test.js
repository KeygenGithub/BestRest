import axios from "axios";

const post = (formData, url) => {
    // for (var pair of formData.entries()) {
    //     console.log(pair[0] + ', ' + pair[1]);
    // }
    axios({
            method: "post",
            url: url,
            data: formData,
            headers: { "Content-Type": "multipart/form-data" }
        })
        .then(function(response) {
            console.log(response);
            let formData2 = new FormData(),
                email = formData.get('email'),
                password = formData.get('password');

            formData2.set("email", email);
            formData2.set("password", password);
            axios({
                    method: "post",
                    url: "https://api.topmediagroups.com/login",
                    data: formData2
                })
                .then(function(response) {
                    console.log(response);
                    // let formData3 = new FormData(),
                    //     name = formData.get('name') + " " + formData.get('lname'),
                    //     description = "Я успешно прошел тестовое задание",
                    //     Bearer_token = response.

                    // formData3.set("name", name);
                    // formData3.set("description", description);
                    // formData3.set("Bearer token", Bearer_token);
                    // axios({
                    //         method: "post",
                    //         url: "https://api.topmediagroups.com/api/v1/tasks",
                    //         data: formData3
                    //     })
                    //     .then(function(response) {
                    //         console.log(response);
                    //     })
                    //     .catch(function(response) {
                    //         console.log(response);
                    //     });
                })
                .catch(function(response) {
                    console.log(response);
                });
        })
        .catch(function(response) {
            console.log(response);
        });
}

export default post;