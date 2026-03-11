async function generateIdea(){

const category = document.getElementById("category").value;
const output = document.getElementById("output");

output.innerHTML = '<div class="loader"></div>';

const prompt = `
Generate 3 developer project ideas for ${category}.

Format EXACTLY like this:

Idea 1
Idea Name:
Description:
Difficulty:
Tech Stack:

Idea 2
Idea Name:
Description:
Difficulty:
Tech Stack:

Idea 3
Idea Name:
Description:
Difficulty:
Tech Stack:

Do NOT use markdown symbols like # or *.
`;

try{

const response = await fetch("/api/generate",{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({prompt})

});

const data = await response.json();

if(data.text){

let ideas = data.text.split(/Idea\s*\d+/i).filter(i => i.trim() !== "");

let tabsHTML = `<div class="idea-tabs">`;
let contentHTML = "";

ideas.forEach((idea,index)=>{

let cleanIdea = idea
.replace(/[#*]/g,"")
.replace(/\*\*/g,"")
.replace(/Idea Name:/gi,"<strong>Idea Name:</strong>")
.replace(/Description:/gi,"<strong>Description:</strong>")
.replace(/Difficulty:/gi,"<strong>Difficulty:</strong>")
.replace(/Tech Stack:/gi,"<strong>Tech Stack:</strong>")
.replace(/\n/g,"<br>");

tabsHTML += `<button class="tab-btn ${index===0 ? 'active' : ''}" onclick="showIdea(${index})">Idea ${index+1}</button>`;

contentHTML += `
<div class="idea-content ${index===0 ? 'active' : ''}" id="idea-${index}">

<div class="idea-text">
${cleanIdea}
</div>

<button class="copy-btn" onclick="copyIdea(this)">
Copy Idea 📋
</button>
<button class="save-btn" onclick="saveIdea(this)">
Save Idea ⭐
</button>

</div>
`;

});

tabsHTML += `</div>`;

output.innerHTML = tabsHTML + contentHTML;

}else{

output.innerHTML="AI returned no text.";

}

}catch(error){

output.innerHTML="AI request failed.";

}

}


function showIdea(index){

document.querySelectorAll(".idea-content").forEach(c=>{
c.classList.remove("active");
});

document.querySelectorAll(".tab-btn").forEach(t=>{
t.classList.remove("active");
});

document.getElementById("idea-"+index).classList.add("active");

document.querySelectorAll(".tab-btn")[index].classList.add("active");

}


function copyIdea(button){

const ideaText = button.parentElement.querySelector(".idea-text").innerText;

navigator.clipboard.writeText(ideaText);

button.innerText = "Copied ✅";

setTimeout(()=>{
button.innerText = "Copy Idea 📋";
},2000);

}


function clearIdeas(){
document.getElementById("output").innerHTML="";
}
function saveIdea(button){

const ideaText = button.parentElement.querySelector(".idea-text").innerText;

let savedIdeas = JSON.parse(localStorage.getItem("savedIdeas")) || [];

savedIdeas.push(ideaText);

localStorage.setItem("savedIdeas", JSON.stringify(savedIdeas));

button.innerText = "Saved ⭐";

}
function showSavedIdeas(){

const output = document.getElementById("output");

let savedIdeas = JSON.parse(localStorage.getItem("savedIdeas")) || [];

output.innerHTML = "";

if(savedIdeas.length === 0){
output.innerHTML = "No saved ideas yet.";
return;
}

savedIdeas.forEach((idea, index)=>{

const card = document.createElement("div");
card.className = "idea-card";

card.innerHTML = `
<h3>⭐ Saved Idea ${index+1}</h3>

<p>${idea}</p>

<button onclick="deleteIdea(${index})">
Delete ❌
</button>
`;

output.appendChild(card);

});

}
function deleteIdea(index){

let savedIdeas = JSON.parse(localStorage.getItem("savedIdeas")) || [];

savedIdeas.splice(index,1);

localStorage.setItem("savedIdeas", JSON.stringify(savedIdeas));

showSavedIdeas();

}