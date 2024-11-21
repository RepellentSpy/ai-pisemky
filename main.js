import { GoogleGenerativeAI, HarmBlockThreshold, HarmCategory } from "@google/generative-ai";
import MarkdownIt from 'markdown-it';
import './style.css';

let API_KEY = 'AIzaSyAi7i8Wh7W_aDUgzPXaDn7E1MjphJtW_fs';

let form = document.querySelector('form');
let promptInput = document.querySelector('input[name="prompt"]');
let output = document.querySelector('.output');

form.onsubmit = async (ev) => {
  ev.preventDefault();
  output.textContent = 'Generating...';

  try {
    let config = "You are an LLM designed to create exams and tests. You write concise questions on a college level. DO NOT WRITE TITLES. Generate 10 questions. Your questions should be hard to answer. You say nothing except the test questions and 3 answers. The numbers go up sequentially from 1-10. Please create a test on the topic of "
    let contents = [
      {
        role: 'user',
        parts: [
          { text: config + promptInput.value }
        ]
      }
    ];

    // Call the multimodal model, and get a stream of results
    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-pro-002", // or gemini-1.5-pro
      safetySettings: [
        {
          category: HarmCategory.HARM_CATEGORY_HARASSMENT,
          threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
        },
      ],
    });

    const result = await model.generateContentStream({ contents });

    // Read from the stream and interpret the output as markdown
    let buffer = [];
    let md = new MarkdownIt();
    for await (let response of result.stream) {
      buffer.push(response.text());
      window.ExamOutput = md.render(buffer.join(''));
      console.log("generation finished");
    }
  } catch (e) {
    output.innerHTML += '<hr>' + e;
  }
};