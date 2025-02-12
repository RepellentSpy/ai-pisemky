function submitDecode() {
    try {
        let decodeInput = document.getElementById("prompt_input").value;
        let jsonStringDecoded = decodeURIComponent(escape(atob(decodeInput)));
        decodedArray = JSON.parse(jsonStringDecoded);
        console.log("DECODED ARRAY") //debug
        console.log(decodedArray);
    }
    catch(e) {
        console.log("Chyba! Nepovedlo se načíst test");
    }
    displayQuestion();
}
let currentQuestionIndex = 0;  // Aktuální index otázky

function displayQuestion() {
    const outputElement = document.getElementById("output");
    outputElement.innerHTML = '';  // Smazat předchozí obsah

    let { question, answers } = decodedArray[currentQuestionIndex];

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
    const currentQuestion = decodedArray[currentQuestionIndex];

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
    if (currentQuestionIndex < decodedArray.length) {
        displayQuestion();  // Pokud ano, zobrazit další
    } else {
        // Pokud ne, zobrazit zprávu
        document.getElementById("question_number_text").innerHTML = "Test dokončen!";
        document.getElementById("output").innerHTML = '<a style="color: #53ac9e">' + correctQuestionAmount + ' / ' + decodedArray.length + ' Správně</a>' + '<br>' + '<a style="color: #cf7644">' + incorrectQuestionAmount + ' / ' + decodedArray.length + ' Špatně';
        document.getElementById("output").innerHTML += "<br>" + "Úspěšnost: " + (10 - incorrectQuestionAmount)*10 + "%";
    }
}