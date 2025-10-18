// --- SIMULATED AI LOGIC ---
function getSimulatedAiResponse(prompt, type = 'explanation') {
    const lowerPrompt = prompt.toLowerCase();
    console.log(`Simulating AI for prompt: "${prompt}", type: ${type}`); // Log for debugging

    // Quiz Responses
    if (type === 'quiz') {
        if (lowerPrompt.includes('war') || lowerPrompt.includes('ww2')) {
            return "Quiz: **What event is considered the primary trigger for the start of World War II in Europe?**";
        }
        if (lowerPrompt.includes('krebs') || lowerPrompt.includes('cycle')) {
            return "Quiz: **What are the main products of one turn of the Krebs cycle?** (List at least two)";
        }
        if (lowerPrompt.includes('python') || lowerPrompt.includes('programming')) {
            return "Quiz: **What is the difference between a list and a tuple in Python regarding mutability?**";
        }
        // Generic fallback quiz question
        return `Quiz Sample for **${prompt}**: What are the three most important facts one should know about this topic?`;
    }

    // Explanation Responses
    if (lowerPrompt.includes('photo') || lowerPrompt.includes('synthesis')) {
        return `**Photosynthesis Study Plan:**
        * **Inputs & Outputs:** Plants use Carbon Dioxide (CO2), Water (H2O), and Sunlight. They produce Glucose (C6H12O6 - energy) and Oxygen (O2).
        * **Stages:** Learn the 'Light-Dependent Reactions' (capture light) and the 'Calvin Cycle' (make glucose).
        * **Visualize:** Draw a leaf diagram showing chloroplasts!`;
    }
    if (lowerPrompt.includes('backprop') || lowerPrompt.includes('propagation')) {
        return `**Backpropagation Explained Simply:**
        1.  **Forward Pass:** Network makes a guess.
        2.  **Calculate Error:** See how wrong the guess was.
        3.  **Backward Pass:** Send the error back, calculating each connection's 'blame'.
        4.  **Adjust Weights:** Tweak connections to reduce future error.
        5.  **Repeat:** Do this thousands of times to learn!`;
    }
    // Generic fallback explanation
    return `**Study Plan for ${prompt}:**
     * **Key Terms:** Define the 3-5 core terms.
     * **Core Concept:** Watch a short intro video (search "Intro to ${prompt}").
     * **Explain:** Try explaining it simply in your own words.`;
}

// --- DOM ELEMENT REFERENCES ---
const aditBtn = document.getElementById('adit-btn');
const aditOut = document.getElementById('adit-sugg'); // Corrected ID
const aditInput = document.getElementById('adit-q');
const aryanBtn = document.getElementById('aryan-btn');
const aryanOut = document.getElementById('aryan-quiz');
const aryanInput = document.getElementById('aryan-topic');
const themeSelector = document.getElementById('theme-selector');
const subjectInput = document.getElementById('new-subject');
const todoList = document.getElementById('todo-list');
const achievementsList = document.getElementById('achievements-list');

// --- AI HELPER LOGIC ---
function runAi(button, outputElement, prompt, type) {
    if (!button || !outputElement) {
        console.error("AI button or output element not found!");
        return;
    }

    button.disabled = true;
    outputElement.innerHTML = "🧠 Thinking...";

    // Simulate network delay
    setTimeout(() => {
        try {
            const responseText = getSimulatedAiResponse(prompt, type);
            // Ensure output element still exists before updating
             if(document.body.contains(outputElement)) {
                 outputElement.innerHTML = parseMarkdown(responseText);
             }
        } catch (error) {
            console.error("Error generating simulated response:", error);
             if(document.body.contains(outputElement)) {
                 outputElement.innerHTML = "<strong>Error:</strong> Could not generate response.";
             }
        } finally {
             if(document.body.contains(button)) {
                 button.disabled = false;
             }
        }
    }, 800); // 800ms delay
}

// Make functions globally available for inline onclick handlers
window.getAditSuggestion = function() {
  if (!aditInput || !aditOut || !aditBtn) return;
  const input = aditInput.value.trim();
  if(!input) {
      if(aditOut) aditOut.textContent='Please ask ADIT a question.';
      return;
  }
  runAi(aditBtn, aditOut, input, 'explanation');
}

window.genAryanQuiz = function() {
  if (!aryanInput || !aryanOut || !aryanBtn) return;
  const input = aryanInput.value.trim();
  if(!input) {
      if(aryanOut) aryanOut.textContent = 'Please give ARYAN a topic.';
      return;
   }
  runAi(aryanBtn, aryanOut, input, 'quiz');
}

// --- UTILITY ---
function parseMarkdown(text = "") {
    let html = text
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // Bold
        .replace(/^\* (.*$)/gm, '<li>$1</li>'); // Convert * lines to <li>

    // Improved list wrapping: Wrap consecutive <li> elements in <ul>
    html = html.replace(/^(<li>.*?<\/li>\s*)+/gm, (match) => `<ul>${match.trim()}</ul>`);
    // Remove potential <br> tags introduced before/after list items by line break conversion
    html = html.replace(/<br>\s*<li>/g, '<li>');
    html = html.replace(/<\/li>\s*<br>/g, '</li>');
    // Convert remaining newlines to <br> only if they are not inside list structures
    html = html.replace(/\n(?!<\/?ul>|<\/?li>)/g, '<br>');

    return html;
}


// --- THEME LOGIC ---
const currentTheme = localStorage.getItem('theme') || 'dark';

function applyTheme(theme) {
    // Clear only theme-related classes
    document.body.classList.remove('light-theme', 'sakura-theme', 'sunset-theme', 'ocean-theme', 'zen-theme');

    // Add the new theme class if it's not the default (dark)
    const themeClass = theme === 'dark' ? '' : `${theme}-theme`;
    if (themeClass) {
        document.body.classList.add(themeClass);
    }

    // Update active button state inside the theme selector
    const themeButtons = themeSelector ? themeSelector.querySelectorAll('.theme-button') : [];
    if (themeButtons.length > 0) {
        themeButtons.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.theme === theme);
        });
    } else {
         console.warn("Theme selector buttons not found for updating active state!");
    }

    // Save the preference
    localStorage.setItem('theme', theme);
}

// Attach event listeners ONLY if the themeSelector exists
if (themeSelector) {
    const themeButtons = themeSelector.querySelectorAll('.theme-button');
    if (themeButtons.length > 0) {
        themeButtons.forEach(button => {
            button.addEventListener('click', (event) => {
                 // Ensure we get the theme from the button clicked
                 const theme = event.target.dataset.theme;
                 if(theme) {
                     applyTheme(theme);
                 }
            });
        });
        // Apply the initial theme when the page loads
        applyTheme(currentTheme);
    } else {
        console.warn("Theme selector buttons not found!");
    }
} else {
    console.warn("Theme selector element (#theme-selector) not found!");
}


// --- SUBJECT TRACKER LOGIC ---
const icons = {
    complete: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" style="width:20px; height:20px;"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>`,
    delete: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" style="width:20px; height:20px;"><path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.144-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.057-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" /></svg>`,
    revert: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" style="width:20px; height:20px;"><path stroke-linecap="round" stroke-linejoin="round" d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3" /></svg>`
};

function createListItem(text, isAchievement = false) {
    const li = document.createElement('li');
    li.dataset.text = text;
    li.className = isAchievement ? 'achievement-item' : '';

    const textSpan = document.createElement('span');
    // Sanitize text before inserting to prevent potential XSS issues if text comes from untrusted sources in future
    textSpan.textContent = text;
    li.appendChild(textSpan);

    const controlsDiv = document.createElement('div');
    controlsDiv.className = 'list-item-controls';

    if (isAchievement) {
        const revertBtn = document.createElement('button');
        revertBtn.className = 'revert-btn';
        revertBtn.title = 'Move back to-do';
        revertBtn.type = 'button';
        revertBtn.innerHTML = icons.revert;
        revertBtn.addEventListener('click', () => revertToTodo(li)); // Use event listener
        controlsDiv.appendChild(revertBtn);
    } else {
        const completeBtn = document.createElement('button');
        completeBtn.className = 'complete-btn';
        completeBtn.title = 'Mark as complete';
        completeBtn.type = 'button';
        completeBtn.innerHTML = icons.complete;
        completeBtn.addEventListener('click', () => moveToAchievements(li)); // Use event listener
        controlsDiv.appendChild(completeBtn);

        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-btn';
        deleteBtn.title = 'Delete';
        deleteBtn.type = 'button';
        deleteBtn.innerHTML = icons.delete;
        deleteBtn.addEventListener('click', () => li.remove()); // Use event listener
        controlsDiv.appendChild(deleteBtn);
    }
    li.appendChild(controlsDiv);
    return li;
}

function addSubject() {
    // Check if elements exist before using them
    if (!subjectInput || !todoList) {
        console.error("Subject input or todo list element not found");
        return;
    }
    const subjectText = subjectInput.value.trim();
    if (subjectText) {
        const newItem = createListItem(subjectText, false);
        todoList.appendChild(newItem);
        subjectInput.value = ''; // Clear input after adding
    }
}

function moveToAchievements(listItem) {
    if (!achievementsList || !listItem || !listItem.dataset || !listItem.dataset.text) {
         console.error("Cannot move item to achievements - element or data missing");
         return;
    }
    const text = listItem.dataset.text;
    const newItem = createListItem(text, true);
    achievementsList.appendChild(newItem);
    listItem.remove();
}

function revertToTodo(listItem) {
    if (!todoList || !listItem || !listItem.dataset || !listItem.dataset.text) {
        console.error("Cannot revert item to todo - element or data missing");
        return;
    }
    const text = listItem.dataset.text;
    const newItem = createListItem(text, false);
    todoList.appendChild(newItem);
    listItem.remove();
}

// Add subject on Enter key press in the input field
if (subjectInput) {
    subjectInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault(); // Prevent potential form submission if inside a form
            addSubject();
        }
    });
}

// Make functions globally available ONLY IF using inline onclick="" in HTML
// If not using inline onclick, remove these lines
window.addSubject = addSubject;

// --- INITIALIZATION ---
document.addEventListener('DOMContentLoaded', () => {
    console.log("AGC Pathfinder Initialized with Themes and Animations!");
    // Apply initial theme on DOM ready to ensure body class is set correctly
    applyTheme(localStorage.getItem('theme') || 'dark');
    // Load saved subjects/achievements from localStorage if implemented
});