let currentQuestionIndex = 0;  // Aktuální index otázky
export let decodedArray;

export function submitDecode() {
    try {
        const decodeInput = document.getElementById("prompt_input").value;
        let jsonStringDecoded = decodeURIComponent(escape(atob(decodeInput)));
        decodedArray = JSON.parse(jsonStringDecoded)
        console.log("Úspěšně načteno")

        displayQuestion();
        document.getElementById("prompt_input").style.display = "none";

        document.getElementById("submit_button").style.display = "none";
        document.getElementById("website_title").innerHTML = "Otázka 1<br>[] [] [] [] [] [] [] [] [] []"
        document.getElementById("question_number_text").innerHTML = "";
    } catch(e) {
        console.error(e);
        window.alert("Chyba v načtení testu! Zkuste to prosím znovu. Po odkliknutí zprávy bude stránka obnovena");
        window.location.reload();
    }
}

export function displayQuestion() { // export added to displayQuestion
    const outputElement = document.getElementById("output");
    outputElement.innerHTML = '';  // Smazat předchozí obsah

    const { question, answers } = decodedArray[currentQuestionIndex];
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

export function handleAnswerClick(answer) { // export added to handleAnswerClick
    if (currentQuestionIndex < decodedArray.length) {
        const currentQuestion = decodedArray[currentQuestionIndex];

        // Zjistit, jestli odpověď uživatele odpovídá správné odpovědi
        const isCorrect = answer.startsWith(currentQuestion.correctAnswer);

        if (isCorrect) {
            correctQuestionAmount++;
        } else {
            incorrectQuestionAmount++;
        }
        currentQuestionIndex++;

        // Zkontrolovat přítomnost dalších otázek
        if (currentQuestionIndex < decodedArray.length) {
            // Přejít na další otázku

            // Kostičky
            const filledSquares = currentQuestionIndex + 1;

            // Pole s kostkami
            const squares = [];
            for (let i = 1; i < 10; i++) {
                if (i < filledSquares) {
                    squares.push("[░]"); // Vyplněná kostka :)
                } else {
                    squares.push("[]"); // Prázdná kostka :(
                }
            }

            // Spojit kostky do jednoho stringu
            const squaresString = squares.join(" ");
            document.getElementById("website_title").innerHTML = "Otázka " + (currentQuestionIndex + 1) + "<br>" + squaresString;

            // zobrazit další otázku
            displayQuestion();
        } else {
            // Konec
            console.log("Zazvonil zvonec a pohádky byl konec");
            document.getElementById("website_title").innerHTML = "Test dokončen!<br>[░] [░] [░] [░] [░] [░] [░] [░] [░] [░]";
            document.getElementById("output").innerHTML = '<a style="color: #53ac9e">' + correctQuestionAmount + ' / ' + decodedArray.length + ' Správně</a>' + '<br>' + '<a style="color: #cf7644">' + incorrectQuestionAmount + ' / ' + decodedArray.length + ' Špatně';
            document.getElementById("output").innerHTML += "<br>" + "Úspěšnost: " + (10 - incorrectQuestionAmount)*10 + "%";
        }
    }
}