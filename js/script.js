/* ===================================================== */
/* ================== REGISTER ========================== */
/* ===================================================== */

function register(){

let name = document.getElementById("regName").value;
let user = document.getElementById("regUsername").value;
let pass = document.getElementById("regPassword").value;

let students = JSON.parse(localStorage.getItem("students")) || [];

/* Prevent duplicate username */
let exists = students.find(s => s.username === user);
if(exists){
alert("Username already exists!");
return;
}

students.push({
name:name,
username:user,
password:pass,
role:"student",
grades:[]
});

localStorage.setItem("students",JSON.stringify(students));

alert("Student Account Created!");
window.location.href="index.html";
}


/* ===================================================== */
/* ===================== LOGIN ========================== */
/* ===================================================== */

function login(){

let user = document.getElementById("loginUsername").value;
let pass = document.getElementById("loginPassword").value;

/* ================= ADMIN ================= */

if(user === "TUPV" && pass === "6115"){

localStorage.setItem("currentUser","TUPV");
localStorage.setItem("role","admin");

window.location.href="dashboard.html";
return;
}

/* ================= STUDENT ================= */

let students = JSON.parse(localStorage.getItem("students")) || [];

for(let s of students){

if(s.username === user && s.password === pass){

localStorage.setItem("currentUser",user);
localStorage.setItem("role","student");

window.location.href="dashboard.html";
return;

}

}

alert("Invalid Username or Password");
}


/* ===================================================== */
/* ================= LOAD DASHBOARD ===================== */
/* ===================================================== */

function loadDashboard(){

let role = localStorage.getItem("role");
let user = localStorage.getItem("currentUser");

if(!user){
window.location.href="index.html";
return;
}

document.getElementById("userNameDisplay").innerText =
user + " (" + role + ")";

if(role === "admin"){
document.getElementById("adminPanel").style.display="block";
}else{
document.getElementById("adminPanel").style.display="none";
}

loadGrades();
}


/* ===================================================== */
/* ================= ADD STUDENT ======================== */
/* ===================================================== */

function addStudent(){

let name = document.getElementById("studentName").value;
let user = document.getElementById("studentUsername").value;
let pass = document.getElementById("studentPassword").value;

let students = JSON.parse(localStorage.getItem("students")) || [];

students.push({
name:name,
username:user,
password:pass,
role:"student",
grades:[]
});

localStorage.setItem("students",JSON.stringify(students));

alert("Student Added!");
location.reload();
}


/* ===================================================== */
/* ================= ADD GRADE ========================== */
/* ===================================================== */

function addGrade(){

let role = localStorage.getItem("role");

let studentUser = role === "admin"
? document.getElementById("selectStudent").value
: localStorage.getItem("currentUser");

let code = document.getElementById("code").value;
let desc = document.getElementById("desc").value;
let p = parseFloat(document.getElementById("prelim").value) || 0;
let m = parseFloat(document.getElementById("midterm").value) || 0;
let e = parseFloat(document.getElementById("endterm").value) || 0;

/* SAME FORMULA AS YOUR C++ */
let avg = (p*0.3)+(m*0.3)+(e*0.4);

let students = JSON.parse(localStorage.getItem("students")) || [];

for(let s of students){

if(s.username === studentUser){

s.grades.push({
code:code,
desc:desc,
prelim:p,
midterm:m,
endterm:e,
average:avg
});

}

}

localStorage.setItem("students",JSON.stringify(students));

loadGrades();
}


/* ===================================================== */
/* ================= LOAD GRADES ======================== */
/* ===================================================== */

function loadGrades(){

let table = document.getElementById("gradeTable");
if(!table) return;

let role = localStorage.getItem("role");
let user = localStorage.getItem("currentUser");

let students = JSON.parse(localStorage.getItem("students")) || [];

table.innerHTML="";

for(let s of students){

if(role === "admin" || s.username === user){

let grades = s.grades || [];

grades.forEach((g,index)=>{

table.innerHTML += `
<tr>
<td>${s.username}</td>
<td>${g.code}</td>
<td>${g.desc}</td>
<td>${g.prelim}</td>
<td>${g.midterm}</td>
<td>${g.endterm}</td>
<td>${g.average.toFixed(2)}</td>

<td>
${role === "admin" ? `
<button onclick="editGrade('${s.username}',${index})">Edit</button>
<button onclick="deleteGrade('${s.username}',${index})">Delete</button>
` : ""}
</td>

</tr>
`;

});

}

}

}


/* ===================================================== */
/* ================= DELETE GRADE ======================= */
/* ===================================================== */

function deleteGrade(studentUser, gradeIndex){

let students = JSON.parse(localStorage.getItem("students")) || [];

for(let s of students){

if(s.username === studentUser){
s.grades.splice(gradeIndex,1);
}

}

localStorage.setItem("students",JSON.stringify(students));

alert("Grade Deleted!");
loadGrades();
}


/* ===================================================== */
/* ================= EDIT GRADE ========================= */
/* ===================================================== */

function editGrade(studentUser, gradeIndex){

let students = JSON.parse(localStorage.getItem("students")) || [];

for(let s of students){

if(s.username === studentUser){

let g = s.grades[gradeIndex];

let newCode = prompt("Subject:", g.code);
let newDesc = prompt("Description:", g.desc);
let newPrelim = parseFloat(prompt("Prelim:", g.prelim)) || 0;
let newMidterm = parseFloat(prompt("Midterm:", g.midterm)) || 0;
let newEndterm = parseFloat(prompt("Endterm:", g.endterm)) || 0;

let newAvg = (newPrelim*0.3)+(newMidterm*0.3)+(newEndterm*0.4);

s.grades[gradeIndex] = {
code:newCode,
desc:newDesc,
prelim:newPrelim,
midterm:newMidterm,
endterm:newEndterm,
average:newAvg
};

}

}

localStorage.setItem("students",JSON.stringify(students));

alert("Grade Updated!");
loadGrades();
}


/* ===================================================== */
/* ================= REFRESH DROPDOWN =================== */
/* ===================================================== */

function refreshStudentDropdown(){

let students = JSON.parse(localStorage.getItem("students")) || [];
let select = document.getElementById("selectStudent");

if(!select) return;

select.innerHTML="";

students.forEach(s=>{
let option = document.createElement("option");
option.value = s.username;
option.text = s.username;
select.appendChild(option);
});

}


/* ===================================================== */
/* ================= LOGOUT ============================= */
/* ===================================================== */

function logout(){

localStorage.removeItem("currentUser");
localStorage.removeItem("role");

window.location.href="index.html";
}


/* Auto Load */
loadGrades();
