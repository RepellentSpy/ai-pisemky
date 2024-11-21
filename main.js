import { GoogleGenerativeAI, HarmBlockThreshold, HarmCategory } from "@google/generative-ai";
import MarkdownIt from 'markdown-it';

let API_KEY = 'AIzaSyAi7i8Wh7W_aDUgzPXaDn7E1MjphJtW_fs';

let form = document.querySelector('form');
let promptInput = document.querySelector('input[name="prompt"]');
let output = document.querySelector('.output');

form.onsubmit = async (ev) => {
  ev.preventDefault();
  output.textContent = 'Generování...';

  try {
    //let config = "You are an LLM designed to create exams and tests. You write in Czech. You write concise questions on a college level. DO NOT WRITE TITLES. Generate 10 questions. Your questions should be hard to answer. You say nothing except the test questions and 3 answers. The numbers go up sequentially from 1-10. Please create a test on the topic of "
    let config = "Jsi velký jazykový model nadesignovaný k vytváření testů a písemek. Píšeš česky. Píšeš stručné otázky na úrovni: " + window.difficultyText + ". NEPIŠ NADPISY. Vygeneruj 10 otázek. Tvé otázky by měly být těžké k zodpovězení. Neříkej nic jiného než testové otázky, 3 odpovědi a jaká je správná. Správná odpověď bude oddělena dvěma mezerami a na každé straně bude jeden vykřičník. Mezi vykřičníky napíšeš pouze písmeno správné odpovědi. Čísla otázek po sobě jdou sekvenčně od 1-10. Prosím vytvoř test na téma: ";
    console.log("Prompt: " +  config);
    // Přidat možnosti úrovně obtížnosti (roletka třída)
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
      console.log(window.ExamOutput);
    }
  } catch (e) {
    output.innerHTML += '<hr>' + e;
  }
};