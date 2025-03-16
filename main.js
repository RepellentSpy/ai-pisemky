import { GoogleGenerativeAI, HarmBlockThreshold, HarmCategory } from "@google/generative-ai";
import MarkdownIt from 'markdown-it';
import * as allProcessing from './processing.js';

let API_KEY = 'AIzaSyAi7i8Wh7W_aDUgzPXaDn7E1MjphJtW_fs';

let form = document.querySelector('form');
let promptInput = document.querySelector('input[name="prompt"]');
let output = document.querySelector('.output');

form.onsubmit = async (ev) => {
  ev.preventDefault();
  document.getElementById("question_number_text").textContent = 'Generování...';

  try {
    let config = "Jsi velký jazykový model nadesignovaný k vytváření testů a písemek. Píšeš česky. Píšeš stručné otázky na úrovni: " + window.difficultyText + ". NEPIŠ NADPISY. Vygeneruj 10 otázek. Tvé otázky by měly být těžké k zodpovězení. Neříkej nic jiného než testové otázky, 3 odpovědi a jaká je správná. Každou odpověď napiš na nový řádek. Každá odpověď by před sebou měla mít písmeno a závorku - a). Po třech odpovědích napiš za dvě mezery písmeno správné odpovědi uvnitř vykřičníků. Správná odpověď bude tudíž vypadat například takto: !c! .Správná odpověď by od poslední odpovědi měla být oddělena dvěma mezerami. SPRÁVNÁ ODPOVĚĎ JE SOUČÁSTÍ SEZNAMU ODPOVĚDÍ. Odpověď ve vykřičnících napiš hned za poslední odpověď, žádný nový řádek. Čísla otázek po sobě jdou sekvenčně od 1-10. Prosím vytvoř test na téma: ";
    console.log("Prompt: " +  config);
    let contents = [
      {
        role: 'user',
        parts: [
          { text: config + promptInput.value }
        ]
      }
    ];

    // Předat prompt modelu a získat výstup
    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({
      model: window.AImodel,
      temperature: 0,
      safetySettings: [
        {
          category: HarmCategory.HARM_CATEGORY_HARASSMENT,
          threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
        },
      ],
    });

    const result = await model.generateContentStream({ contents });

    // Přečíst výstup a interpretovat jako markdown
    let buffer = [];
    let md = new MarkdownIt();
    for await (let response of result.stream) {
      buffer.push(response.text());
      window.ExamOutput = md.render(buffer.join(''));
      console.log("generation part finished");
      console.log(window.ExamOutput); // DEBUG!!!!!!!!!!!!!!!
    }
  } catch (e) {
    output.innerHTML += '<hr>' + e;
    window.ExamOutput = "";
  }
  console.log("Generation finished");
  allProcessing.generateExam();
};

