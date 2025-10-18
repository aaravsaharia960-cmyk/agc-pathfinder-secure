// --- SIMULATED AI LOGIC ---
function getSimulatedAiResponse(prompt, type = 'explanation') {
    const lowerPrompt = prompt.toLowerCase();
    console.log(`Simulating AI for prompt: "${prompt}", type: ${type}`); // Log for debugging

    // Quiz Responses
    if (type === 'quiz') {
        if (lowerPrompt.includes('war') || lowerPrompt.includes('ww2')) {
            return "Here is your quiz question: **What event is considered the primary trigger for the start of World War II in Europe?**";
        }
        if (lowerPrompt.includes('krebs') || lowerPrompt.includes('cycle')) {
            return "Here is your quiz question: **What are the main products of one turn of the Krebs cycle?** (List at least two)";
        }
        if (lowerPrompt.includes('python') || lowerPrompt.includes('programming')) {
            return "Here is your quiz question: **What is the difference between a list and a tuple in Python regarding mutability?**";
        }
        // Generic fallback quiz question
        return `Here is a sample quiz question about **${prompt}**: What are the three most important facts one should know about this topic?`;
    }

    // Explanation Responses
    if (lowerPrompt.includes('photo') || lowerPrompt.includes('synthesis')) {
        return `**Photosynthesis** is a fascinating process! Here is a simple study plan:
        * **Step 1: Inputs & Outputs.** Understand that plants take in Carbon Dioxide (CO2), Water (H2O), and Sunlight energy. They produce Glucose (C6H12O6 - sugar for energy) and Oxygen (O2).
        * **Step 2: Two Main Stages.** Learn about the 'Light-Dependent Reactions' (capture sunlight energy in chlorophyll) and the 'Calvin Cycle' (use that energy to make glucose from CO2).
        * **Step 3: Visualize.** Try drawing a simple diagram of a plant leaf showing where these processes happen (chloroplasts!). This really helps memory!`;
    }
    if (lowerPrompt.includes('backprop') || lowerPrompt.includes('propagation')) {
        return `**Backpropagation** is the core algorithm for training most neural networks. Think of it like this:
        1.  **Forward Pass:** The network takes an input (like an image) and makes a prediction (e.g., 'it's a cat').
        2.  **Calculate Error:** It compares its prediction to the correct answer and calculates how 'wrong' it was (the error or loss).
        3.  **Backward Pass:** This is backpropagation! The error is sent backward through the network, layer by layer. At each layer, it calculates how much each connection ('weight') contributed to the error.
        4.  **Adjust Weights:** Based on how much they contributed, the weights are adjusted slightly in a direction that will reduce the error next time.
        5.  **Repeat:** This whole process (forward, calculate error, backward, adjust) is repeated thousands or millions of times with many examples, making the network gradually improve.`;
    }
    // Generic fallback explanation
    return `Here is a structured study plan for **${prompt}**:
     * **Define Key Terms:** Start by identifying and writing down the definitions of the 3-5 most important vocabulary words or concepts related to "${prompt}".
     * **Find a Core Concept:** Search for and watch a short (5-10 minute) educational video that explains the main idea simply. Try searching "Introduction to ${prompt}".
     * **Practice / Explain:** Attempt to explain the core concept in your own words, either by writing a short paragraph or telling it to someone else. This is the best way to check your understanding!`;
}

// --- DOM ELEMENT REFERENCES ---
// Ensure elements exist before adding listeners or manipulating them
const aditBtn = document.getElementById('adit-btn');
const aditOut = document.getElementById('adit-sugg');
const aditInput = document.getElementById('adit-q'); // Added input reference
const aryanBtn = document.getElementById('aryan-btn');
const aryanOut = document.getElementById('aryan-quiz');
const aryanInput = document.getElementById('aryan-topic'); // Added input reference
const themeButtons = document.querySelectorAll('.theme-button');
const subjectInput = document.getElementById('new-subject');
const todoList = document.getElementById('todo-list');
const achievementsList = document.getElementById('achievements-list');

// --- AI HELPER LOGIC ---
function runAi(button, outputElement, prompt, type) {
    if (!button || !outputElement) return; // Prevent errors if elements don't exist

    button.disabled = true;
    outputElement.innerHTML = "🧠 Thinking...";

    // Simulate network delay
    setTimeout(() => {
        try {
            const responseText = getSimulatedAiResponse(prompt, type);
            outputElement.innerHTML = parseMarkdown(responseText);
        } catch (error) {
            console.error("Error generating simulated response:", error);
            outputElement.innerHTML = "<strong>Error:</strong> Could not generate response.";
        } finally {
            button.disabled = false;
        }
    }, 800); // 800ms delay
}

// Make functions globally available for inline onclick handlers
window.getAditSuggestion = function() {
  if (!aditInput || !aditOut || !aditBtn) return;
  const input = aditInput.value.trim();
  if(!input) { aditOut.textContent='Please ask ADIT a question.'; return; }
  runAi(aditBtn, aditOut, input, 'explanation');
}

window.genAryanQuiz = function() {
  if (!aryanInput || !aryanOut || !aryanBtn) return;
  const input = aryanInput.value.trim();
  if(!input) { aryanOut.textContent = 'Please give ARYAN a topic.'; return; }
  runAi(aryanBtn, aryanOut, input, 'quiz');
}

// --- UTILITY ---
function parseMarkdown(text = "") { // Add default value
    // Basic Markdown: Bold and Line Breaks
    let html = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    // Handle list items more robustly
    html = html.replace(/^\* (.*$)/gm, '<li>$1</li>'); // Convert * lines to <li>
    html = html.replace(/(<li>.*?<\/li>)/gs, '<ul>$1</ul>'); // Wrap consecutive <li> in <ul>
    html = html.replace(/<\/ul>\s*<ul>/g, ''); // Merge adjacent <ul>
    // Basic newline to <br> conversion (only outside lists)
    html = html.replace(/<br>\s*<li>/g, '<li>'); // Clean up breaks before list items
    html = html.replace(/<\/li>\s*<br>/g, '</li>'); // Clean up breaks after list items
    html = html.replace(/\n/g, '<br>'); // Convert remaining newlines
    
    return html;
}

// --- THEME LOGIC ---
const currentTheme = localStorage.getItem('theme') || 'dark';

function applyTheme(theme) {
    // Clear only theme-related classes
    document.body.classList.remove('light-theme', 'sunset-theme', 'forest-theme', 'retro-theme', 'nature-theme');

    // Add the new theme class if it's not the default (dark)
    const themeClass = theme === 'dark' ? '' : `${theme}-theme`;
    if (themeClass) {
        document.body.classList.add(themeClass);
    }

    // Update active button state
    themeButtons.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.theme === theme);
    });

    // Save the preference
    localStorage.setItem('theme', theme);
}

// Attach event listeners to theme buttons
if (themeButtons.length > 0) {
    themeButtons.forEach(button => {
        button.addEventListener('click', () => {
            applyTheme(button.dataset.theme);
        });
    });
    // Apply the initial theme when the page loads
    applyTheme(currentTheme);
}

// --- SUBJECT TRACKER LOGIC ---
const icons = {
    complete: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>`,
    delete: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.144-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.057-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" /></svg>`,
    revert: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3" /></svg>`
};

function createListItem(text, isAchievement = false) {
    const li = document.createElement('li');
    li.dataset.text = text; // Store original text
    li.className = isAchievement ? 'achievement-item' : '';

    const textSpan = document.createElement('span');
    textSpan.textContent = text;
    li.appendChild(textSpan);

    const controlsDiv = document.createElement('div');
    controlsDiv.className = 'list-item-controls';

    if (isAchievement) {
        const revertBtn = document.createElement('button');
        revertBtn.className = 'revert-btn';
        revertBtn.title = 'Move back to-do';
        revertBtn.innerHTML = icons.revert;
        revertBtn.onclick = () => revertToTodo(li);
        controlsDiv.appendChild(revertBtn);
    } else {
        const completeBtn = document.createElement('button');
        completeBtn.className = 'complete-btn';
        completeBtn.title = 'Mark as complete';
        completeBtn.innerHTML = icons.complete;
        completeBtn.onclick = () => moveToAchievements(li);
        controlsDiv.appendChild(completeBtn);

        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-btn';
        deleteBtn.title = 'Delete';
        deleteBtn.innerHTML = icons.delete;
        deleteBtn.onclick = () => li.remove();
        controlsDiv.appendChild(deleteBtn);
    }
    li.appendChild(controlsDiv);
    return li;
}

function addSubject() {
    if (!subjectInput || !todoList) return;
    const subjectText = subjectInput.value.trim();
    if (subjectText) {
        const newItem = createListItem(subjectText, false);
        todoList.appendChild(newItem);
        subjectInput.value = ''; // Clear input after adding
    }
}

function moveToAchievements(listItem) {
    if (!achievementsList) return;
    const text = listItem.dataset.text;
    const newItem = createListItem(text, true);
    achievementsList.appendChild(newItem);
    listItem.remove();
}

function revertToTodo(listItem) {
    if (!todoList) return;
    const text = listItem.dataset.text;
    const newItem = createListItem(text, false);
    todoList.appendChild(newItem);
    listItem.remove();
}

// Add subject on Enter key press in the input field
if (subjectInput) {
    subjectInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addSubject();
        }
    });
}

// Make addSubject globally available if needed by inline onclick
window.addSubject = addSubject;