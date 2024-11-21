let currentQuestionIndex = 0;  // Aktuální index otázky

// Pole, ve kterém budou uloženy otázky vygenerovány Gemini
let examQuestions = [];

function generateExam() {
    // parsovat HTML abychom získali důležité informace z výstupu od Gemini
    const parser = new DOMParser();
    const doc = parser.parseFromString(window.ExamOutput, 'text/html');
    const rawText = doc.body.textContent.trim();

    // Rozdělit text dvěma novými řádky (předpokládá, že jsou otázky odděleny volným řádkem)
    const questionBlocks = rawText.split('\n\n').map(block => block.trim());

    // Zpracování každého bloku (otázky + odpovědi)
    questionBlocks.forEach(block => {
        // Rozdělit blok do řádků (první řádek je otázka, ostatní odpovědi)
        const lines = block.split('\n').map(line => line.trim());

        // Oddělit otázku od její odpovědí
        const question = lines[0]; // První řádek je otázka
        const answers = lines.slice(1).filter(line => /^[a-d]\)/.test(line)); // Zbývající řádky mají prefix od a-d

        // Přidat do pole
        if (question && answers.length > 0) {
            examQuestions.push({ question, answers });
        }
    });

    // Pokud se jedná o první otázku, ukázat
    if (currentQuestionIndex === 0) {
        displayQuestion();
    }
    console.log(examQuestions); // DEBUG!
}


function displayQuestion() {
    const outputElement = document.getElementById("output");
    outputElement.innerHTML = '';  // Clear any previous content

    const { question, answers } = examQuestions[currentQuestionIndex];

    // Create and append the question paragraph
    const questionParagraph = document.createElement("p");
    questionParagraph.textContent = question;
    outputElement.appendChild(questionParagraph);

    // Create and append buttons for each answer
    answers.forEach(answer => {
        const button = document.createElement("button");
        button.textContent = answer;
        button.onclick = () => handleAnswerClick(answer);
        outputElement.appendChild(button);
    });
}

function handleAnswerClick(answer) {
    // When an answer is clicked, show an alert (or log the answer for now)
    alert(`You selected: ${answer}`);

    // Move to the next question
    currentQuestionIndex++;

    // Check if there are more questions to display
    if (currentQuestionIndex < examQuestions.length) {
        displayQuestion();  // Display the next question
    } else {
        // No more questions, show a "completed" message
        document.getElementById("output").innerHTML = 'You have completed the test!';
    }
}
