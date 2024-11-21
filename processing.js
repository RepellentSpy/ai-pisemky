// Určování obtížnosti testu
window.difficultyText = "Základní úroveň"; // nastavení výchozí úrovně jako základní, kdyby náhodou uživatel žádnou nevybral
const difficultyDropdown = document.getElementById('difficultyDropdown');
difficultyDropdown.addEventListener('change', function () {
    selectedDifficulty = difficultyDropdown.value;

    if (selectedDifficulty == 1) {
        window.difficultyText = "Základní úroveň";
        console.log("obtížnost: " + window.difficultyText);
    }
    else if (selectedDifficulty == 2) {
        window.difficultyText = "Středoškolská úroveň";
        console.log("obtížnost: " + window.difficultyText);
    }
    else if (selectedDifficulty == 3) {
        window.difficultyText = "Vysokoškolská úroveň";
        console.log("obtížnost: " + window.difficultyText);
    }
    else if (selectedDifficulty == 4) {
        window.difficultyText = "Expertní úroveň";
        console.log("obtížnost: " + window.difficultyText);
    }
});

// Určování jaký model využít
window.AImodel = "gemini-1.5-flash-8b"; // nastavení výchozího modelu jako flash
const qualityDropdown = document.getElementById('qualityDropdown');
qualityDropdown.addEventListener('change', function () {
    selectedQuality = qualityDropdown.value;

    if (selectedQuality == 1) {
        window.AImodel = "gemini-1.5-flash-8b";
        console.log("model: " + window.AImodel);
    }
    if (selectedQuality == 2) {
        window.AImodel = "gemini-1.5-pro-002";
        console.log("model: " + window.AImodel);
    }
});

let currentQuestionIndex = 0;  // Aktuální index otázky

// Pole, ve kterém budou uloženy otázky vygenerovány Gemini
let examQuestions = [];

function generateExam() {
    // parsovat HTML, abychom získali důležité informace z výstupu od Gemini
    const parser = new DOMParser();
    const doc = parser.parseFromString(window.ExamOutput, 'text/html');
    const rawText = doc.body.textContent.trim();

    // Rozdělit text dvěma novými řádky (předpokládá, že otázky jsou odděleny prázdným řádkem)
    const questionBlocks = rawText.split('\n\n').map(block => block.trim());

    // Zpracování každého bloku (otázka + odpovědi)
    questionBlocks.forEach(block => {
        // Rozdělit blok do řádků (první řádek je otázka, ostatní odpovědi)
        const lines = block.split('\n').map(line => line.trim());

        // Oddělit otázku od její odpovědí
        const question = lines[0]; // První řádek je otázka
        const answers = [];
        let correctAnswer = null;

        // Zpracování odpovědí (správná odpověď je oddělena dvěma mezerami a uvnitř dvou vykřičníků - !a!)
        lines.slice(1).forEach(line => {
            if (/^![a-d]!/.test(line)) {
                // Detekovat správnou odpověď
                correctAnswer = line.match(/^!([a-d])!/)[1] + ')'; // Extrahovat správnou odpověď, např. "b)"
                answers.push(line.replace(/^![a-d]!/, '').trim()); // Odstranit vykřičníky
            } else {
                answers.push(line); // Přidat běžnou odpověď
            }
        });

        // Přidat do pole
        if (question && answers.length > 0 && correctAnswer) {
            examQuestions.push({ question, answers, correctAnswer });
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
    outputElement.innerHTML = '';  // Smazat předchozí obsah

    let { question, answers } = examQuestions[currentQuestionIndex];

    // Vytvořit a přidat informace do otázkového odstavce
    const questionParagraph = document.createElement("p");
    questionParagraph.textContent = question;
    outputElement.appendChild(questionParagraph);

    // Vytvořit a přidat tlačítka
    answers.forEach(answer => {
        const answerDiv = document.createElement("div");
        const button = document.createElement("button");
        button.textContent = answer;
        button.onclick = () => handleAnswerClick(answer);
        answerDiv.appendChild(button);
        outputElement.appendChild(answerDiv);
    });
}

function handleAnswerClick(answer) {
    const currentQuestion = examQuestions[currentQuestionIndex];

    // Zjistit, jestli odpověď uživatele odpovídá správné odpovědi
    const isCorrect = answer.startsWith(currentQuestion.correctAnswer);

    if (isCorrect) {
        alert("Správná odpověď!");
    } else {
        alert(`Špatná odpověď! Správná odpověď byla: ${currentQuestion.correctAnswer}`);
    }

    // Přejít na další otázku
    currentQuestionIndex++;
    document.getElementById("question_number_text").innerHTML = `Otázka ${currentQuestionIndex + 1}`;

    // Zkontrolovat, jestli je další otázka k zobrazení
    if (currentQuestionIndex < examQuestions.length) {
        displayQuestion();  // Pokud ano, zobrazit další
    } else {
        // Pokud ne, zobrazit zprávu
        document.getElementById("output").innerHTML = 'Test dokončen!';
        document.getElementById("question_number_text").style.visibility = "hidden";
    }
}
