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


// function to get dashboard api
function dashboardApi(){
    const getModal = document.querySelector(".pagemodal");
    getModal.style.display = "block";

    const getToken = localStorage.getItem("adminlogin");
    const theToken = JSON.parse(getToken);
    const token = theToken.token;

    const dashHeader = new Headers();
    dashHeader.append("Authorization", `Bearer ${token}`);

    const dashReq = {
        method: 'GET',
        headers: dashHeader
    };

    const url = "https://pluralcodesandbox.com/yorubalearning/api/admin/admin_dashboardapi";
    fetch(url, dashReq)
    .then(response => response.json())
    .then(result => {
    console.log(result)
    const admin = document.getElementById("adminId");
    const category = document.getElementById("category");
    const learnMat = document.getElementById("learnmat");
    const subCat = document.getElementById("subCat");
    const quiz = document.getElementById("quiz");
    const student = document.getElementById("student");

    admin.innerHTML = result.admin_name;
    category.innerHTML = result.total_number_of_categories;
    learnMat.innerHTML = result.total_number_of_learningmaterial;
    subCat.innerHTML = result.total_number_of_subcategories;
    quiz.innerHTML = result.total_number_of_quize;
    student.innerHTML = result.total_number_of_students;

    getModal.style.display = "none";
})
    .catch(error => console.log('error', error));
}

//function for getting top three students
function studentModal(event){
    event.preventDefault();
    const getModal = document.getElementById("dash-modal");
    getModal.style.display = "block";
    const getModal2 = document.querySelector(".pagemodal");
    getModal2.style.display = "block";
    const  getToken = localStorage.getItem("adminlogin");
    const theToken = JSON.parse(getToken);
    const token = theToken.token;
    const dashHeader = new Headers();
    dashHeader.append("Authorization", `Bearer ${token}`);
    const dashReq = {
        method: 'GET',
        headers: dashHeader
    };
    let data = [];
    const url = "https://pluralcodesandbox.com/yorubalearning/api/admin/top_three_students";
    fetch(url, dashReq)
    .then(response => response.json())
    .then(result => {
       console.log(result)
       const getStudent = document.querySelector(".allstudent");
       getModal2.style.display = "none";
       if (result.lenght === 0) {
         getStudent.innerHTML = "No records found!"
       }
       else{
       result.map((item) => {
       data += `
        <div class="search-card">
            <div class="d-flex dew">
                <p>Email: </p>
                <p><b>${item.email}</b></p>
            </div>
            <div class="d-flex dew">
                <p>Name: </p>
                <p><b>${item.name}</b></p>
            </div>
            <div class="d-flex dew">
                <p>Phone Number: </p>
                <p><b>${item.phone_number}</b></p>
            </div>
            <div class="d-flex dew">
                <p>Total score: </p>
                <p><b>${item.total_score}</b></p>
            </div>
            <div class="d-flex dew">
                <p>Position: </p>
                <p><b>${item.position}</b></p>
            </div>
        </div>
      `
       getStudent.innerHTML = data;
       getModal2.style.display = "none";
       })
    }
    })
    .catch(error => console.log('error', error));
}

function closeDashModal() {
    const getModal = document.getElementById("dash-modal");
    getModal.style.display = "none";
}

// get all students
function getAllStudents() {
    const getModal2 = document.querySelector(".pagemodal");
    getModal2.style.display = "block";

    const getToken = localStorage.getItem("adminlogin");
    const theToken = JSON.parse(getToken);
    const token = theToken.token;

    const dashHeader = new Headers();
    dashHeader.append("Authorization", `Bearer ${token}`);

    const dashReq = {
        method: 'GET',
        headers: dashHeader
    }

    let data = [];

    const url = "https://pluralcodesandbox.com/yorubalearning/api/admin/get_all_students";

    fetch(url, dashReq)
.then(response => response.json())
.then(result => {
    console.log(result)
    const tableDetails = document.getElementById("table-id");

    if (result.lenght === 0 || result.length === "null") {
        tableDetails.innerHTML = "No records found!"
    }
    else{
        result.map((item) => {
            data +=`
            <tr>
            <td>${item.name}</td>
            <td>${item.email}</td>
            <td>${item.phone_number}</td>
            <td>${item.position}</td>
            <td>${item.total_score}</td>
            </tr>
            `
            tableDetails.innerHTML = data;
            getModal2.style.display = "none";
        })
    }
})
    .catch(error => console.log('error', error));
}

function createCategory(event) {
    event.preventDefault();
     
    const getSpin = document.querySelector(".spin");
    getSpin.style.display = "inline-block";

    const getCat = document.getElementById("cat").value;
    const getImgCat = document.getElementById("imcat").files[0];

    if (getCat === "" || getImgCat === "") {
        Swal.fire({
            icon: 'info',
            text: 'All fields are required..',
            confirmationButtonColor: "#2D85DE"
        })
        getSpin.style.display = "none";
    }

    else {

    const  getToken = localStorage.getItem("adminlogin");
    const theToken = JSON.parse(getToken);
    const token = theToken.token;

    const catHeader = new FormData();
    catHeader.append("name", getCat);
    catHeader.append("image", getImgCat);



    const dashHeader = new Headers();
    dashHeader.append("Authorization", `Bearer ${token}`);

    const dashReq = {
        method: 'POST',
        body: catHeader,
        headers: dashHeader
    };

    const url = "https://pluralcodesandbox.com/yorubalearning/api/admin/create_category";

    fetch(url, dashReq)
    .then(response => response.json())
    .then(result => {
        console.log(result)
        if (result.status === "success") {
        Swal.fire({
            icon: 'success',
            text: `${result.message}`,
            confirmButtonColor: "2D85DE"
        })
        
        setTimeout(() => {
            location.reload();
        }, 3000)

        }

        else {
            Swal.fie({
                icon: 'info',
                text: 'Unsuccessful...',
                confirmationButtonColor: "#2D85DE"

            })

            getSpin.style.display = "none";
        }

        })

        .catch(error => console.log('error', error));
 }

 }

  


function getCategoryList() {
    const myModal = document.querySelector(".pagemodal");
    myModal.style.display = "block";
    const getData = localStorage.getItem("adminlogin");
    const myData = JSON.parse(getData);
    const data = myData.token;
    const logHeader = new Headers();
    logHeader.append("Authorization", `Bearer ${data}`);
    const logReq = {
        method: 'GET',
        headers: logHeader
    }
    let dt = [];
    const url = "https://pluralcodesandbox.com/yorubalearning/api/admin/category_list";
    fetch(url, logReq)
    .then(response => response.json())
    .then(result =>{
        console.log(result)
        const getDetails = document.querySelector(".scroll-object");
        if (result.length === 0) {
            getDetails.innerHTML = "No category found!"
        }
        else {
            result.map((item) => {
                dt +=`
                <div class="search-card">
                <a href="details.html?name=${item.name}&&id=${item.id}"><img src=${item.image} alt="image">
                </a>
                <p>${item.image}</p>
                <button class="update-button">update</button>
                <button class="delete-button">delete</button>
                </div>
                `
                getDetails.innerHTML = dt;
                myModal.style.display = "none"
            })
        }
    })
    .catch((error) => console.log('error', error))
}

function subCategory(event){
    event.preventDefault();

    const param = new URLSearchParams(window.location.search);
    const getId = param.get('id');

    const getSpin = document.querySelector(".spin");
    getSpin.style.display = "inline-block";

    const getSubName = document.getElementById("subCatName").value;
    const getSubImg = document.getElementById("subCatImg").files[0];

    if (getSubName === "" || getSubImg === ""){
        swal.fire({
            icon: 'info',
            text: 'All fields are Required...',
            confirmButtonColor: "#2D85DE"
        })
        getSpin.style.display = "none";
    }
    else{
        const getToken = localStorage.getItem("adminlogin"); 
        const theToken = JSON.parse(getToken); 
        const token = theToken.token;
    
    
        const dashHeader = new Headers(); 
        dashHeader.append("Authorization", `Bearer ${token}`);
        
        const SubForm = new FormData();
        SubForm.append("name", getSubName);
        SubForm.append("image", getSubImg);
        SubForm.append("category_id", getId);

        const subReq = {
            method: "POST",
            headers: dashHeader,
            body: SubForm
          
        }
         
      const url = "https://pluralcodesandbox.com/yorubalearning/api/admin/create_subcategory";

      fetch(url, subReq)
      .then((response) => response.json())
      .then(result => {
             console.log(result)
            
             if (result.status === "success") {
                Swal.fire({
                    icon: 'success',
                    text: `${result.message}`,
                    confirmButtonColor: "#2D85DE"
                })
                setTimeout(() => {
                    location.reload();
                }, 3000)
            
             }
            else{
                Swal.fire({
                    icon: 'info',
                    text: `${result.message}`,
                    confirmButtonColor: "#2D85DE"
                })
                getSpin.style.display = "none";
            }

        })
               
      .catch(error => {
        console.log('error', error)
    
      Swal.fire({
        icon: 'warning',
        text: error,
        confirmButtonColor: "#2D85DE"
      })
        getSpin.style.display = "none";
       });

  }
}

function categoryList() {
    

    const catList = document.querySelector(".scroll-div"); 
    catList.style.display = "block";
  
    const getToken = localStorage.getItem("adminlogin"); 
    const theToken = JSON.parse(getToken); 
    const token = theToken.token;



    const dashHeader = new Headers(); 
    dashHeader.append("Authorization", `Bearer ${token}`); 
  
    const dashReq = {
      method: "GET",
      headers: dashHeader
    };

  
    let myImage = []; 

  
    const url = "https://pluralcodesandbox.com/yorubalearning/api/admin/category_list";
  
       fetch(url, dashReq)
      .then((response) => response.json())
      .then((result) => {
        console.log(result);

  
        if (result.length === 0) { 
          catList.innerHTML = "No Records Found";
        } else {
          result.map((item) => { 

            myImage += `
            <div class="search-card">
            <a href="details.html?name=${item.name}&&id=${item.id}"><img src=${item.image}> </a>
            <p class"cat-details">${item.name}</p>
            <button class="update-button" onclick="updateCat(${item.id})">Update</button>
            <button class="delete-button" onclick="deleteCat(${item.id})">Delete</button>
            </div>
            `;
            catList.innerHTML = myImage;
          });
        }
      })
      .catch((error) => console.log("error", error));
  }



//function to get subcategory

 function getSubCategory() {
      
    const param = new URLSearchParams(window.location.search);
    const getId = param.get('id');

    const getToken = localStorage.getItem("adminlogin"); 
    const theToken = JSON.parse(getToken); 
    const token = theToken.token;

    const dashHeader = new Headers(); 
    dashHeader.append("Authorization", `Bearer ${token}`);

    const subReq = {
        method: "GET",
        headers: dashHeader,
    }

    let data = [];

    const url = `https://pluralcodesandbox.com/yorubalearning/api/admin/category_details/${getId}`;

    fetch(url, subReq)
    .then((response) => response.json())
    .then(result => {
           console.log(result) 
        
        
        const getRow = document.querySelector(".row");
        if(result.length === 0){
            getRow.innerHTML = "No Records found under this Category";
        }
        else{
            result.map((item) => {
                data +=`
                <div class="col-sm-12 col-md-12 col-lg-4">
                <div class="search-card">
                <img src="${item.image}" alt="image">
                <p>${item.name}</p>
                <button class="update-button" onclick="openSubCatModal(${item.id})">Update</button>
                </div>
                </div>
                `
                getRow.innerHTML = data;
            })
        }
        })
 .catch(error => console.log('error', error))

 }
 function updateCat(upcatid) {
    const getMod = document.getElementById("my-modal3");
    getMod.style.display = "block"

    localStorage.setItem("unid", upcatid);

    const getData = localStorage.getItem("adminlogin");
    const myData = JSON.parse(getData);
    const data = myData.token;


    const logHeader = new Headers();
    logHeader.append("Authorization", `Bearer ${data}`);

    const logReq = {
        method: 'GET',
        headers: logHeader
    }

    const url = `https://pluralcodesandbox.com/yorubalearning/api/admin/get_details?category_id=${upcatid}`;
    fetch(url, logReq)
    .then(response => response.json())
    .then(result => {
        console.log(result)
        const getName = document.getElementById("updateName");
        const getImage = document.getElementById("updateNameImage");

        getName.setAttribute("value", `${result.name}`);
        getImage.setAttribute("value", `${result.image}`);

    })
    .catch(error => console.log('error', error));
    
}

function closeModal3() {
    const getMod = document.getElementById("my-modal3");
    getMod.style.display = "none"
}

function chooseImg(event) {
    event.preventDefault();

    const firstdiv = document.querySelector(".wrapper");
    const seconddiv = document.querySelector(".getWrapp");

    firstdiv.style.display = "block";
    seconddiv.style.display = "none";


}

// function updateSubCategory(event) {
//     event.preventDefault();
  
//     const getSpin = document.getElementById("spin");
//     getSpin.style.display = "inline-block";
  
//     let newId = mySubId;
  
//     const upName = document.getElementById("updateSubName").value;
//     const upImg = document.getElementById("updateSubImage").files[0];
  
//     if (upName === "" || upImg === "") {
//       Swal.fire({
//         icon: "info",
//         text: "All fields are required!",
//         confirmButtonColor: "#2D85DE",
//       });
//       getSpin.style.display = "none";
//     } else {
//       const getToken = localStorage.getItem("adminLogData");
//       const theToken = JSON.parse(getToken);
//       const token = theToken.token;
  
//       const dashHeader = new Headers();
//       dashHeader.append("Authorization", `Bearer ${token}`);
  
//       const upData = new FormData();
//       upData.append("name", upName);
//       upData.append("image", upImg);
 
//       upData.append("subcategory_id", newId);
  
//       const upMethod = {
//         method: "POST",
//         headers: dashHeader,
//         body: upData,
//       };
  
//       const url = `https://pluralcodesandbox.com/yorubalearning/api/admin/update_subcategory`;
//       fetch(url, upMethod)
//         .then((response) => response.json())
//         .then((result) => {
//           console.log(result);
  
//           if (result.status === "success") {
//             Swal.fire({
//               icon: "success",
//               text: `${result.message}`,
//               confirmButtonColor: "#2D85DE",
//             });
  
//             setTimeout(() => {
//               location.reload();
//             }, 3000);
//           } else {
//             Swal.fire({
//               icon: "info",
//               text: `${result.message}`,
//               confirmButtonColor: "#2D85DE",
//             });
//             getSpin.style.display = "none";
//           }
//         })
//         .catch((error) => {
//           console.log("error", error);
//           Swal.fire({
//             icon: "warning",
//             text: error,
//             confirmButtonColor: "#2D85DE",
//           });
//           getSpin.style.display = "none";
//         });
//     }
//   }
  
//   function closeModalMode() {
//     const subCatModal = document.getElementById("my-modal-mode");
//     subCatModal.style.display = "none";
// }

function updateCategory(event) {
    event.preventDefault();

    const myModal = document.querySelector(".spin2");
    myModal.style.display = "inline-block";

    const catName = document.getElementById("updateName").value;
    const catImg1 = document.getElementById("updateNameImage").value;
    const catImg2 = document.getElementById("updateImage").files[0];

    if (catName === "" || catImg1 === "") {
        Swal.fire({
            icon: 'info',
            text: 'All fields are required!',
            confirmButtonColor: "#2D85DE"
        })
        myModal.style.display = "none";
    }
    else {
        const getData = localStorage.getItem("adminlogin");
        const myData = JSON.parse(getData);
        const data = myData.token;


        const logHeader = new Headers();
        logHeader.append("Authorization", `Bearer ${data}`);

        const getId = localStorage.getItem("unid");

        const updata = new FormData();
        updata.append("name", catName);
        updata.append("image", catImg1);
        updata.append("image", catImg2);
        updata.append("category_id", getId);

        const upreq = {
            method: 'POST',
            headers: logHeader,
            body: updata
        }

        const url = "https://pluralcodesandbox.com/yorubalearning/api/admin/update_category";
        fetch(url, upreq)
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
                    location.reload()
                }, 3000)
            }
            else {
                Swal.fire({
                    icon: 'info',
                    text: `${result.message}`,
                    confirmButtonColor: "#2D85DE"
                })
            }
        })
        .catch(error => console.log('error', error));

    }

}

    function getNameDetails() {
        const params = new URLSearchParams(window.location.search)
        const getName = params.get('name');

        const name = document.querySelector(".det")
        name.innerHTML = getName
    }

    function openSubCatModal(subId) {
        const subCatModal = document.getElementById("my-modal-mode");
        subCatModal.style.display = "block";

        mySubId = subId;
        const getToken = localStorage.getItem("adminlogin");
  const theToken = JSON.parse(getToken);
  const token = theToken.token;
  const subCat = new Headers();
  subCat.append("Authorization", `Bearer ${token}`);
  const url = `https://pluralcodesandbox.com/yorubalearning/api/admin/get_details?subcategory_id=${subId}`;
  const subReq = {
    method: "GET",
    headers: subCat,
  };
  const subName = document.getElementById("updateSubName");
  fetch(url, subReq)
    .then((response) => response.json())
    .then((result) => {
      console.log(result);
    //   console.log(JSON.stringify(result));
       subName.value = result.name;
       Swal.fire({
        icon: "success",
        text: "Success",
        confirmButtonColor: "#2D85DE",
      });
    });
    }
    
// function closeModalMode() {
//     const subCatModal = documet.getElementById("my-email-mode");
//     subCatModal.style.display = "none"
// }   

function upDateAdmin(event) {
  event.preventDefault();
  const getSpin = document.querySelector(".spin2");
  getSpin.style.display = "inline-block";
  const upName = document.getElementById("updateName").value;
  const upEmail = document.getElementById("updateEmail").value;
  if (upName === "" || upEmail === "") {
    Swal.fire({
      icon: "success",
      text: "All fields are required",
      confirmButtonColor: "#2D85DE",
    });
    getSpin.style.display = "none";
  }
  else {
     // get token
     const getToken = localStorage.getItem("adminlogin");
     const theToken = JSON.parse(getToken);
     const token = theToken.token;
     // authorization
     const dashHeader = new Headers();
     dashHeader.append("Authorization", `Bearer ${token}`);
     const upForm = new FormData();
     upForm.append("email", upEmail);
     upForm.append("name", upName);
     const upMethod = {
      method: "POST",
      headers: dashHeader,
      body: upForm,
    };
    const url = `https://pluralcodesandbox.com/yorubalearning/api/admin/admin_update_profile`;
    fetch(url, upMethod)
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        if (result.status === "success") {
          Swal.fire({
            icon: "success",
            text: `${result.message}`,
            confirmButtonColor: "#2D85DE",
          });
          setTimeout(() => {
            location.href= "index.html";
          }, 3000);
        } else {
          Swal.fire({
            icon: "info",
            text: `${result.message}`,
            confirmButtonColor: "#2D85DE",
          });
          getSpin.style.display = "none";
        }
      })
  }
}
    
function upDatePassword(event) {
    event.preventDefault();
    const getSpin = document.querySelector(".spin");
    getSpin.style.display = "inline-block";
    const upPass = document.getElementById("updatePassword").value;
    const confirmPass = document.getElementById("confirmPassword").value;
    const upEmail = document.getElementById("updatePassEmail").value;
    if (upPass === "" || upEmail === "" || confirmPass === "")  {
      Swal.fire({
        icon: "success",
        text: "All fields are required",
        confirmButtonColor: "#2D85DE",
      });
      getSpin.style.display = "none";
      console.log(upPass,)
    } else{
    if (confirmPass !== upPass) {
      Swal.fire({
        icon: "warning",
        text: "Password do not match",
        confirmButtonColor: "#2D85DE",
      });
      getSpin.style.display = "none";
    }
      else {
      // get token
      const getToken = localStorage.getItem("adminlogin");
      const theToken = JSON.parse(getToken);
      const token = theToken.token;
      // authorization
      const dashHeader = new Headers();
      dashHeader.append("Authorization", `Bearer ${token}`);
      const upForm = new FormData();
      upForm.append("email", upEmail);
      upForm.append("password", upPass);
      upForm.append("password_confirmation", confirmPass);
      const upMethod = {
        method: "POST",
        headers: dashHeader,
        body: upForm,
      };
      const url = `https://pluralcodesandbox.com/yorubalearning/api/admin/admin_update_password`;
      fetch(url, upMethod)
        .then((response) => response.json())
        .then((result) => {
          console.log(result);
          if (result.status === "success") {
            Swal.fire({
              icon: "success",
              text: `${result.message}`,
              confirmButtonColor: "#2D85DE",
            });
            setTimeout(() => {
              location.href = "index.html";
            }, 3000);
          } else {
            Swal.fire({
              icon: "info",
              text: `${result.message}`,
              confirmButtonColor: "#2D85DE",
            });
            getSpin.style.display = "none";
          }
        });
    }
  }
  }

  function deleteCat(id) {
    let myToken = localStorage.getItem("adminlogin");
    let token = JSON.parse(myToken).token;
    let url =
      `https://pluralcodesandbox.com/yorubalearning/api/admin/delete_category/` +
      `${id}`;
    let headers = new Headers({ Authorization: `Bearer ${token}` });
    let options = {
      method: "GET",
      headers: headers
    };
    fetch(url, options)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        if (data.status === "success") {
          Swal.fire({
            icon: "success",
            text: `${data.message}`,
            confirmButtonColor: "green",
          });
          setTimeout(() => {
            location.reload();
          }, 4000);
        } else {
          Swal.fire({
            icon: "info",
            text: `delete was Unsuccessful`,
            confirmButtonColor: "red",
          });
        }
      })
      .catch((error) => (error.message, error));
  }

 // logout
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