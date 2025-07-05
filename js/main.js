import { questions } from './data.js';
import { renderQuiz } from './render.js';
import { evaluateQuiz } from './logic.js';

const form = document.getElementById("quiz-form");
const resultDiv = document.getElementById("result");
const submitBTN = document.getElementById("submit-btn");

// Verificar que los elementos existan
if (!form || !resultDiv || !submitBTN) {
  console.error('No se encontraron todos los elementos del DOM necesarios');
}

renderQuiz(questions, form);

submitBTN.addEventListener("click", (event) => {
  event.preventDefault();
  evaluateQuiz(questions, form, resultDiv);
});