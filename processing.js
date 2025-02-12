window.AImodel = "gemini-1.5-flash";

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

let currentQuestionIndex = 0;  // Aktuální index otázky

// Pole, ve kterém budou uloženy otázky vygenerovány Gemini
let examQuestions = [];

function generateExam() {
    examQuestions = [];
    document.getElementById("question_number_text").innerHTML = "Otázka 1";
    
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
            if (/^![a-c]!/.test(line)) {
                // Detekovat správnou odpověď
                correctAnswer = line.match(/^!([a-c])!/)[1] + ')'; // Extrahovat správnou odpověď, např. "b)"
                answers.push(line.replace(/^![a-c]!/, '').trim()); // Odstranit vykřičníky
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

// výchozí stav proměnných
let correctQuestionAmount = 0;
let incorrectQuestionAmount = 0;

function handleAnswerClick(answer) {
    const currentQuestion = examQuestions[currentQuestionIndex];

    // Zjistit, jestli odpověď uživatele odpovídá správné odpovědi
    const isCorrect = answer.startsWith(currentQuestion.correctAnswer);

    if (isCorrect) {
        correctQuestionAmount++;
    } else {
        incorrectQuestionAmount++;
    }

    // Přejít na další otázku
    currentQuestionIndex++;
    document.getElementById("question_number_text").innerHTML = `Otázka ${currentQuestionIndex + 1}`;

    // Zkontrolovat, jestli je další otázka k zobrazení
    if (currentQuestionIndex < examQuestions.length) {
        displayQuestion();  // Pokud ano, zobrazit další
    } else {
        // Pokud ne, zobrazit zprávu
        document.getElementById("question_number_text").innerHTML = "Test dokončen!";
        document.getElementById("output").innerHTML = '<a style="color: #53ac9e">' + correctQuestionAmount + ' / ' + examQuestions.length + ' Správně</a>' + '<br>' + '<a style="color: #cf7644">' + incorrectQuestionAmount + ' / ' + examQuestions.length + ' Špatně';
        document.getElementById("output").innerHTML += "<br>" + "Úspěšnost: " + (10 - incorrectQuestionAmount)*10 + "%";
    }
}

function ListExam() {
    console.log("Attempting to list exam");
    document.getElementById("examListDiv").style.right = "0.5rem";
    // Vybere všechny vhodné prvky z pole ExamQuestions a zobrazí je
    for (let i = 0; i < examQuestions.length; i++) {
        document.getElementById("examListQuestionsList").innerHTML += (i + 1) + ". "+ examQuestions[i].question + "<br>" + examQuestions[i].answers[0] + "<br>" + examQuestions[i].answers[1] + "<br>" + examQuestions[i].answers[2] + "<br> Správně: " + examQuestions[i].correctAnswer + "<br><br>";
    }
}

function closeExamList() {
    document.getElementById("examListDiv").style.right = "-125.5rem";
}

function shareQuestions() {
    //let randomHexColor = Math.floor(Math.random()*16777215).toString(16);
    //let result           = '';
    //let characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    //let charactersLength = characters.length;
    //for ( let i = 0; i < 20; i++ ) {
    //  result += characters.charAt(Math.floor(Math.random() * charactersLength));
    //}
    //console.log("Heslo testu: " + randomHexColor + "-" + result);
    encode();
}

function encode() {
    let jsonString = JSON.stringify(examQuestions);
    console.log(jsonString);
    let base64Encoded = encodeURI(btoa(unescape(encodeURIComponent(jsonString))));
    console.log("ENCODED ARRAY");
    console.log(base64Encoded);
}