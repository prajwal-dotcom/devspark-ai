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

// 🚨 If API limit message appears
if(data.text.includes("limit reached") || data.text.includes("try again later")){

output.innerHTML = `
<div class="idea-content active">
${data.text}
</div>
`;

return;
}

// Normal idea rendering
let ideas = data.text.split(/Idea\s*\d+/i).filter(i => i.trim() !== "");

let tabsHTML = `<div class="idea-tabs">`;
let contentHTML = "";

ideas.forEach((idea,index)=>{

let cleanIdea = idea
.replace(/[#*]/g,"")
.replace(/\*\*/g,"")
.replace(/Idea Name:/gi,"<br><strong>Idea Name:</strong> ")
.replace(/Description:/gi,"<br><br><strong>Description:</strong> ")
.replace(/Difficulty:/gi,"<br><br><strong>Difficulty:</strong> ")
.replace(/Tech Stack:/gi,"<br><br><strong>Tech Stack:</strong> ");

tabsHTML += `<button class="tab-btn ${index===0 ? 'active' : ''}" onclick="showIdea(${index})">Idea ${index+1}</button>`;

contentHTML += `
<div class="idea-content ${index===0 ? 'active' : ''}" id="idea-${index}">

<div class="idea-text">
${cleanIdea}
</div>

<div class="idea-actions">
<button class="copy-btn" onclick="copyIdea(this)">
Copy Idea 
</button>

<button class="save-btn" onclick="saveIdea(this)">
Save Idea 
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