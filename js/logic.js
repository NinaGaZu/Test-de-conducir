import { updateProgressResults } from './render.js';

export function evaluateQuiz(questions, form, resultDiv) {
  let score = 0;
  let totalQuestions = questions.length;

  questions.forEach((q, i) => {
    const selectedInput = form.querySelector(`input[name="question${i}"]:checked`);
    const userAnswer = selectedInput ? parseInt(selectedInput.value) : null;

    if (userAnswer === q.answer) {
      score++;
    }
  });

  // Actualizar indicador de progreso con resultados
  updateProgressResults(questions, form);

  // Mostrar solo resumen general
  const percentage = Math.round((score / totalQuestions) * 100);
  let performanceMessage = '';
  let performanceClass = '';
  
  if (percentage >= 80) {
    performanceMessage = '¡Excelente trabajo!';
    performanceClass = 'excellent';
  } else if (percentage >= 60) {
    performanceMessage = '¡Buen trabajo!';
    performanceClass = 'good';
  } else {
    performanceMessage = 'Puedes mejorar';
    performanceClass = 'needs-improvement';
  }

  resultDiv.innerHTML = `
    <div class="quiz-results">
      <div class="score-summary ${performanceClass}">
        <h3 class="score-header">Resultado Final</h3>
        <div class="score-details">
          <div class="score-number">${score}/${totalQuestions}</div>
          <div class="score-percentage">${percentage}%</div>
        </div>
        <div class="performance-message">${performanceMessage}</div>
      </div>
      <div class="results-note">
        <p>📝 Revisa el feedback detallado bajo cada pregunta</p>
      </div>
    </div>`;
}