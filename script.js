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
    // Save generation to history
let history = JSON.parse(localStorage.getItem("ideaHistory")) || [];
history.unshift(data.text);

if(history.length > 10){
history.pop();
}

localStorage.setItem("ideaHistory", JSON.stringify(history));

let ideas = data.text.split(/Idea\s*\d+/i).filter(i => i.trim() !== "");

let tabsHTML = `<div class="idea-tabs">`;
let contentHTML = "";

ideas.forEach((idea,index)=>{

let cleanIdea = idea
.replace(/[#*]/g,"")
.replace(/\*\*/g,"")
.replace(/Idea Name:/gi,"<br><strong>Idea Name:</strong> ")
.replace(/Description:/gi,"<br><br><strong>Description:</strong> ")
.replace(/Difficulty:\s*Easy/gi,'<br><br><strong>Difficulty:</strong> <span class="badge easy">Easy</span>')
.replace(/Difficulty:\s*Medium/gi,'<br><br><strong>Difficulty:</strong> <span class="badge medium">Medium</span>')
.replace(/Difficulty:\s*Hard/gi,'<br><br><strong>Difficulty:</strong> <span class="badge hard">Hard</span>')
.replace(/Tech Stack:/gi,"<br><br><strong>Tech Stack:</strong> ");

tabsHTML += `<button class="tab-btn ${index===0 ? 'active' : ''}" onclick="showIdea(${index})">Idea ${index+1}</button>`;

contentHTML += `
<div class="idea-content ${index===0 ? 'active' : ''}" id="idea-${index}">

<div class="idea-text">
${cleanIdea}
</div>

<div class="idea-actions">
<button class="copy-btn" onclick="copyIdea(this)">
Copy Idea 📋
</button>

<button class="save-btn" onclick="saveIdea(this)">
Save Idea ⭐
</button>
</div>

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

const ideaText = button.parentElement.parentElement.querySelector(".idea-text").innerText;

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

const ideaText = button.parentElement.parentElement.querySelector(".idea-text").innerText;

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
output.innerHTML = "<p>No saved ideas yet.</p>";
return;
}

savedIdeas.forEach((idea, index)=>{

let formattedIdea = idea
.replace(/Idea Name:/gi,"<br><strong>Idea Name:</strong> ")
.replace(/Description:/gi,"<br><br><strong>Description:</strong> ")
.replace(/Difficulty:\s*Easy/gi,'<br><br><strong>Difficulty:</strong> <span class="badge easy">Easy</span>')
.replace(/Difficulty:\s*Medium/gi,'<br><br><strong>Difficulty:</strong> <span class="badge medium">Medium</span>')
.replace(/Difficulty:\s*Hard/gi,'<br><br><strong>Difficulty:</strong> <span class="badge hard">Hard</span>')
.replace(/Tech Stack:/gi,"<br><br><strong>Tech Stack:</strong> ");

const card = document.createElement("div");
card.className = "idea-card";

card.innerHTML = `
<h3>⭐ Saved Idea ${index+1}</h3>

<div class="idea-text">
${formattedIdea}
</div>

<div class="idea-actions">

<button class="copy-btn" onclick="copyIdea(this)">
Copy Idea 📋
</button>

<button class="pdf-btn" onclick="downloadPDF(this)">
Download PDF 📄
</button>

<button class="delete-btn" onclick="deleteIdea(${index})">
Delete ❌
</button>

</div>
`;

output.appendChild(card);

});

}

function copySavedIdea(index){

let savedIdeas = JSON.parse(localStorage.getItem("savedIdeas")) || [];

navigator.clipboard.writeText(savedIdeas[index]);

alert("Idea copied!");

}


function deleteIdea(index){

let savedIdeas = JSON.parse(localStorage.getItem("savedIdeas")) || [];

savedIdeas.splice(index,1);

localStorage.setItem("savedIdeas", JSON.stringify(savedIdeas));

showSavedIdeas();

}
function downloadPDF(button){

const { jsPDF } = window.jspdf;

const ideaText = button.parentElement.parentElement.querySelector(".idea-text").innerText;

const doc = new jsPDF();

const lines = doc.splitTextToSize(ideaText, 180);

doc.text(lines, 10, 20);

doc.save("DevSpark-Idea.pdf");

}
tsParticles.load("particles", {
  background: {
    color: "transparent"
  },
  fpsLimit: 60,
  particles: {
    number: {
      value: 60,
      density: {
        enable: true,
        area: 800
      }
    },
    color: {
      value: "#38bdf8"
    },
    links: {
      enable: true,
      color: "#38bdf8",
      distance: 150,
      opacity: 0.3,
      width: 1
    },
    move: {
      enable: true,
      speed: 1
    },
    opacity: {
      value: 0.4
    },
    size: {
      value: { min: 1, max: 3 }
    }
  },
  detectRetina: true
});
function showHistory(){

const output = document.getElementById("output");

let history = JSON.parse(localStorage.getItem("ideaHistory")) || [];

output.innerHTML = "";

if(history.length === 0){
output.innerHTML = "<p>No idea history yet.</p>";
return;
}

history.forEach((entry, index)=>{

let clean = entry
.replace(/[#*]/g,"")
.replace(/\*\*/g,"")
.replace(/Idea Name:/gi,"<br><strong>Idea Name:</strong> ")
.replace(/Description:/gi,"<br><br><strong>Description:</strong> ")
.replace(/Difficulty:/gi,"<br><br><strong>Difficulty:</strong> ")
.replace(/Tech Stack:/gi,"<br><br><strong>Tech Stack:</strong> ");

const card = document.createElement("div");
card.className = "idea-card";

card.innerHTML = `
<h3>🕒 Generation ${index+1}</h3>

<div class="idea-text">
${clean}
</div>
`;

output.appendChild(card);

});

}