// function for registration
function signUp(event) {
    // prevent any form of page reload
    event.preventDefault();
    // local variable
    const getSpin = document.querySelector(".spin");
    getSpin.style.display = "inline-block";
    // get your your values from the form
    const getName = document.getElementById("name").value;
    const getEmail = document.getElementById("email").value;
    const getPassword = document.getElementById("password").value;
    const getConfirmPassword = document.getElementById("confirmPassword").value;
    // validation for submitting empty form
    if (getName === "" || getEmail === "" || getPassword === "" || getConfirmPassword === "") {
        Swal.fire({
            icon: 'info',
            text: "All fields are required",
            confirmButtonColor: "#2D85DE"
        })
       getSpin.style.display = "none";
    }
    // validation for password match
    if (getConfirmPassword !== getPassword) {
        swal.fire({
            icon: 'warning',
            text: "Password do not match",
            confirmButtonColor: "#2D85DE"
        })
       getSpin.style.display = "none";
    }
    else {
        const signFormData = new FormData();
        signFormData.append("name", getName);
        signFormData.append("email", getEmail);
        signFormData.append("password", getPassword);
        signFormData.append("password_confirmation", getConfirmPassword);
        const signMethod = {
            method: 'POST',
            body: signFormData
        };
        const url = "https://pluralcodesandbox.com/yorubalearning/api/register_admin";
        fetch(url, signMethod)
        .then(response => response.json())
        .then(result => {
            console.log(result)
            if (result.status === "success") {
                Swal.fire({
                    icon: 'success',
                    text: `${result.message}`,
                    confirmButtonColor: "#2D85DE"
                })
                setTimeout(() => {
                    location.href = "index.html"
                }, 5000)
            }
            else {
                Swal.fire({
                    icon: 'info',
                    text: "Registration Unsuccessful!",
                    confirmButtonColor: "#2D85DE"
                })
                getSpin.style.display = "none";
            }
        })
        .catch(error => console.log('error', error));
    }
}

function logIn(event) {
    event.preventDefault();

    const getSpin = document.querySelector(".spin");
    getSpin.style.display = "inline-block";

    const getEmail = document.querySelector("#email").value;
    const getPassword = document.querySelector("#password").value;

    //validating for submiting form
    if ( getEmail === "" || getPassword === "") {
        swal.fire({
            icon: 'info',
            text: 'All fields are required',
            confirmButtonColor: "#2DB85DE"
        })
    //STOP THE BUTTON FROM SPINNING
    getSpin.style.display = "none";
    }

    else {
        const logFormData = new FormData();
        logFormData.append("email", getEmail);
        logFormData.append("password", getPassword);

        const logReq = {
            method: 'POST',
            body: logFormData
        }

        const url = "https://pluralcodesandbox.com/yorubalearning/api/admin_login";

        fetch(url, logReq)
        .then(response => response.json())
        .then(result => {
            console.log(result)
            // saves to local storage
            localStorage.setItem("adminlogin", JSON.stringify(result));

            const getDetails = localStorage.getItem("adminlogin")
            const details = JSON.parse(getDetails);

            if (details.hasOwnProperty("email")) {
                location.href = "dashboard.html"
            }

            else {
                Swal.fire ({
                    icon: 'info',
                    text: 'Login Unsuccessful...',
                    confirmButtonColor: "#2D85DE"
                })

                getSpin.style.display = "none"
            }
        })
        .catch(error => console.log('error', error));
    }
}

function logout() {
    const myModal = document.querySelector(".pagemodal");
    myModal.style.display = "block";
    // getting stored in local staorage
    const getData = localStorage.getItem("adminlogin");
    const myData = JSON.parse(getData);
    const data = myData.token;
    const logHeader = new Headers();
    logHeader.append("Authorization", `Bearer ${data}`);
    const logReq = {
        method: 'GET',
        headers: logHeader
    }
    const url = "https://pluralcodesandbox.com/yorubalearning/api/admin/logout";
    fetch(url, logReq)
    .then(response => response.json())
    .then(result => {
        console.log(result)
        if (result.message === "success") {
            Swal.fire({
                icon: 'success',
                text: 'Logout Successful',
                confirmButtonColor: "#2D85DE"
            })
            setTimeout(() => {
                localStorage.clear();
                location.href = "index.html";
            }, 3000);
        }
        else {
            Swal.fire({
                icon: 'info',
                text: 'Unsuccessful',
                confirmButtonColor: "#2D85DE"
            })
            myModal.style.display = "none";
        }
    })
    .catch(error => console.log('error', error));
}