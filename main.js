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
    let config = "Jsi velký jazykový model nadesignovaný k vytváření testů a písemek. Píšeš česky. Píšeš stručné otázky na úrovni: " + window.difficultyText + ". NEPIŠ NADPISY. Vygeneruj 10 otázek. Tvé otázky by měly být těžké k zodpovězení. Neříkej nic jiného než testové otázky a 3 odpovědi. Čísla otázek po sobě jdou sekvenčně od 1-10. Prosím vytvoř test na téma: ";
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
      model: "gemini-1.5-flash-8b", // nebo gemini-1.5-pro nebo gemini-1.5-pro-002 nebo gemini-1.5-flash nebo gemini-1.5-flash-8b
      // ToDo: Přidat možnost výměny flash za pro
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
    }
  } catch (e) {
    output.innerHTML += '<hr>' + e;
  }
};