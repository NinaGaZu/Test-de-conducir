// render.js - Versión actualizada con indicador de progreso
export function renderQuiz(questions, form) {
  if (!questions || !Array.isArray(questions) || !form) {
    console.error('Parámetros inválidos para renderQuiz');
    return;
  }

  form.innerHTML = '';

  // Crear layout de dos columnas
  const quizLayout = document.createElement('div');
  quizLayout.classList.add('quiz-layout');
  
  // Crear columna de progreso
  const progressColumn = document.createElement('div');
  progressColumn.classList.add('progress-column');
  
  const progressContainer = document.createElement('div');
  progressContainer.classList.add('progress-container');
  
  const progressTitle = document.createElement('h3');
  progressTitle.textContent = 'Progreso del Quiz';
  progressTitle.classList.add('progress-title');
  
  const progressGrid = document.createElement('div');
  progressGrid.classList.add('progress-grid');
  progressGrid.id = 'progress-grid';
  
  // Crear cuadrito para cada pregunta
  questions.forEach((_, i) => {
    const progressSquare = document.createElement('div');
    progressSquare.classList.add('progress-square');
    progressSquare.setAttribute('data-question', i);
    progressSquare.textContent = i + 1;
    progressGrid.appendChild(progressSquare);
  });
  
  progressContainer.appendChild(progressTitle);
  progressContainer.appendChild(progressGrid);
  
  // Crear botón de reinicio (inicialmente oculto)
  const restartButton = document.createElement('button');
  restartButton.textContent = 'Reiniciar Quiz';
  restartButton.classList.add('restart-btn');
  restartButton.id = 'restart-btn';
  restartButton.style.display = 'none';
  restartButton.addEventListener('click', () => restartQuiz());
  
  progressContainer.appendChild(restartButton);
  progressColumn.appendChild(progressContainer);
  
  // Crear columna de preguntas
  const questionsColumn = document.createElement('div');
  questionsColumn.classList.add('questions-column');

  // Renderizar preguntas
  questions.forEach((q, i) => {
    const questionDiv = document.createElement("div");
    questionDiv.classList.add("question");
    questionDiv.setAttribute('data-question-index', i);

    const questionText = document.createElement("h3");
    questionText.textContent = `${i + 1}. ${q.question}`;
    questionText.classList.add("question-title");
    questionDiv.appendChild(questionText);

    const optionsContainer = document.createElement("div");
    optionsContainer.classList.add("options-container");

    q.options.forEach((opt, idx) => {
      const optionWrapper = document.createElement("div");
      optionWrapper.classList.add("option-wrapper");

      const label = document.createElement("label");
      label.classList.add("option-label");
      label.setAttribute('for', `question${i}_option${idx}`);

      const input = document.createElement("input");
      input.type = "radio";
      input.name = `question${i}`;
      input.value = idx;
      input.id = `question${i}_option${idx}`;
      input.classList.add("option-input");
      
      // Agregar evento para actualizar progreso
      input.addEventListener('change', () => updateProgress(i));

      const optionText = document.createElement("span");
      optionText.textContent = opt;
      optionText.classList.add("option-text");

      label.appendChild(input);
      label.appendChild(optionText);
      optionWrapper.appendChild(label);
      optionsContainer.appendChild(optionWrapper);
    });

    questionDiv.appendChild(optionsContainer);
    
    // Crear contenedor para el feedback (inicialmente oculto)
    const feedbackContainer = document.createElement('div');
    feedbackContainer.classList.add('question-feedback-inline');
    feedbackContainer.id = `feedback-${i}`;
    feedbackContainer.style.display = 'none';
    
    questionDiv.appendChild(feedbackContainer);
    questionsColumn.appendChild(questionDiv);
  });
  
  // Ensamblar el layout
  quizLayout.appendChild(progressColumn);
  quizLayout.appendChild(questionsColumn);
  form.appendChild(quizLayout);
}

// Función para actualizar el progreso cuando se responde una pregunta
function updateProgress(questionIndex) {
  const progressSquare = document.querySelector(`[data-question="${questionIndex}"]`);
  if (progressSquare) {
    progressSquare.classList.add('answered');
  }
}

// Función para mostrar resultados en el indicador
export function updateProgressResults(questions, form) {
  questions.forEach((q, i) => {
    const selectedInput = form.querySelector(`input[name="question${i}"]:checked`);
    const userAnswer = selectedInput ? parseInt(selectedInput.value) : null;
    const progressSquare = document.querySelector(`[data-question="${i}"]`);
    const feedbackContainer = document.getElementById(`feedback-${i}`);
    
    if (progressSquare) {
      progressSquare.classList.remove('answered');
      
      if (userAnswer === null) {
        progressSquare.classList.add('unanswered');
      } else if (userAnswer === q.answer) {
        progressSquare.classList.add('correct');
      } else {
        progressSquare.classList.add('incorrect');
      }
    }
    
    // Mostrar feedback inline para cada pregunta
    if (feedbackContainer) {
      const isCorrect = userAnswer === q.answer;
      const statusClass = isCorrect ? 'correct' : 'incorrect';
      const statusText = isCorrect ? 'Correcta' : 'Incorrecta';
      
      feedbackContainer.innerHTML = `
        <div class="inline-feedback ${statusClass}">
          <div class="feedback-status">
            <span class="status-icon">${isCorrect ? '✓' : '✗'}</span>
            <span class="status-text">${statusText}</span>
          </div>
          ${!isCorrect ? `
            <div class="feedback-details">
              <div class="user-answer-inline">
                <strong>Tu respuesta:</strong> ${selectedInput ? q.options[userAnswer] : "Sin responder"}
              </div>
              <div class="correct-answer-inline">
                <strong>Respuesta correcta:</strong> ${q.options[q.answer]}
              </div>
            </div>
          ` : ''}
        </div>
      `;
      feedbackContainer.style.display = 'block';
    }
  });
  
  // Mostrar botón de reinicio
  const restartButton = document.getElementById('restart-btn');
  if (restartButton) {
    restartButton.style.display = 'block';
  }
}

// Función para reiniciar el quiz
function restartQuiz() {
  // Limpiar todas las selecciones
  const allInputs = document.querySelectorAll('input[type="radio"]');
  allInputs.forEach(input => {
    input.checked = false;
  });
  
  // Ocultar todos los feedbacks inline
  const allFeedbacks = document.querySelectorAll('.question-feedback-inline');
  allFeedbacks.forEach(feedback => {
    feedback.style.display = 'none';
  });
  
  // Resetear progreso
  const allProgressSquares = document.querySelectorAll('.progress-square');
  allProgressSquares.forEach(square => {
    square.classList.remove('answered', 'correct', 'incorrect', 'unanswered');
  });
  
  // Ocultar botón de reinicio
  const restartButton = document.getElementById('restart-btn');
  if (restartButton) {
    restartButton.style.display = 'none';
  }
  
  // Limpiar resultados principales
  const resultDiv = document.getElementById('result');
  if (resultDiv) {
    resultDiv.innerHTML = '';
  }
  
  // Scroll hacia arriba
  window.scrollTo({ top: 0, behavior: 'smooth' });
}