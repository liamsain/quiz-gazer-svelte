<script>
  export let eyeX;
  export let eyeY;

  import TriviaQuestion from "./TriviaQuestion.js";
  import { tweened } from "svelte/motion";
  import { cubicOut } from "svelte/easing";

  const States = {
    AskingQuestion: "asking",
    RevealingResult: "result",
  };

  let currentState = States.AskingQuestion;
  let triviaQuestions = [];
  let loadingTriviaQuestions = false;
  let answer1El;
  let answer2El;
  let currentQuestion;
  let chosenAnswer;
  let answer1ProgressNumber = 0;
  let answer2ProgressNumber = 0;
  let questionsAnsweredCount = 0;
  let questionsAnsweredCorrectlyCount = 0;
  let nextQuestionEl;
  let nextQuestionProgressNumber = 0;
  const nextQuestionProgress = tweened(0, {
    duration: 400,
    easing: cubicOut,
  });

  const progress1 = tweened(0, {
    duration: 40,
    easing: cubicOut,
  });
  const progress2 = tweened(0, {
    duration: 40,
    easing: cubicOut,
  });

  function loadTriviaQuestions() {
    loadingTriviaQuestions = true;
    fetch("https://opentdb.com/api.php?amount=20&category=9&difficulty=medium")
      .then((response) => response.json())
      .then((data) => {
        loadingTriviaQuestions = false;
        triviaQuestions = data.results.map((x) => new TriviaQuestion(x));
        console.log(triviaQuestions);
        currentQuestion = triviaQuestions[0];
        currentState = States.AskingQuestion;
        startQuestionTimer();
      })
      .catch((error) => {
        alert(`Failed to fetch trivia questions. Message: ${error} `);
        loadingTriviaQuestions = false;
      });
  }
  loadTriviaQuestions();

  function eyesInsideEl(el) {
    if (!el) {
      return false;
    }
    const clientRect = el.getBoundingClientRect();
    return (
      eyeX >= clientRect.x &&
      eyeX <= clientRect.x + clientRect.width &&
      eyeY >= clientRect.y &&
      eyeY <= clientRect.y + clientRect.height
    );
  }

  function startQuestionTimer() {
    let timeout;
    if (eyesInsideEl(answer1El)) {
      if (answer1ProgressNumber < 1) {
        answer1ProgressNumber += 0.01;
        progress1.set(answer1ProgressNumber);
      } else {
        chosenAnswer = currentQuestion.choices[0];
        currentState = States.RevealingResult;
        questionsAnsweredCount += 1;
        if (chosenAnswer === currentQuestion.correctAnswer) {
          questionsAnsweredCorrectlyCount += 1;
        }

        clearTimeout(timeout);
        startEndOfRoundTimer();
        return;
      }
    }
    if (eyesInsideEl(answer2El)) {
      if (answer2ProgressNumber < 1) {
        answer2ProgressNumber += 0.01;
        progress2.set(answer2ProgressNumber);
      } else {
        chosenAnswer = currentQuestion.choices[1];
        questionsAnsweredCount += 1;
        currentState = States.RevealingResult;
        if (chosenAnswer === currentQuestion.correctAnswer) {
          questionsAnsweredCorrectlyCount += 1;
        }
        clearTimeout(timeout);
        startEndOfRoundTimer();
        return;
      }
    }

    timeout = setTimeout(startQuestionTimer, 30);
  }

  function startEndOfRoundTimer() {
    let timeout;
    if (eyesInsideEl(nextQuestionEl)) {
      if (nextQuestionProgressNumber < 1) {
        nextQuestionProgressNumber += 0.01;
        nextQuestionProgress.set(nextQuestionProgressNumber);
      } else {
        nextQuestionProgressNumber = 0;
        nextQuestionProgress.set(0);
        onNextQuestion();
        clearTimeout(timeout);
        return;
      }
    }
    timeout = setTimeout(startEndOfRoundTimer, 30);
  }

  function onNextQuestion() {
    answer1ProgressNumber = 0;
    progress1.set(0);
    answer2ProgressNumber = 0;
    progress2.set(0);
    if (triviaQuestions.length - 1 === 0) {
      loadTriviaQuestions();
      return;
    }
    triviaQuestions = triviaQuestions.slice(1, triviaQuestions.length);
    currentQuestion = triviaQuestions[0];
    currentState = States.AskingQuestion;
    startQuestionTimer();
  }
</script>

<style>
  .eye-focus-box {
    font-size: 44px;
    border-radius: 6px;
    margin-top: 200px;
    margin: 60px;
    padding: 200px;
    color: white;
    font-weight: bold;
    background: #ffd582;
    -webkit-box-shadow: 2px 8px 17px -9px rgba(0, 0, 0, 0.75);
    -moz-box-shadow: 2px 8px 17px -9px rgba(0, 0, 0, 0.75);
    box-shadow: 2px 8px 17px -9px rgba(0, 0, 0, 0.75);
  }
  progress {
    display: block;
    width: 100%;
  }
  .question-text {
    margin: 0 auto;
    max-width: 760px;
    text-align: center;
    font-size: 36px;
  }
</style>

{#if currentQuestion}
  <div>
    <h1 class="question-text">{currentQuestion.question}</h1>
  </div>
    <h3 style="text-align:center;">
      {questionsAnsweredCorrectlyCount} / {questionsAnsweredCount}
    </h3>
  {#if currentState === States.AskingQuestion}
    {#if loadingTriviaQuestions}
      <h2 style="text-align:center;">Loading questions..</h2>
    {/if}

    <div style="display: flex;justify-content: center;margin-top: 100px;">
      <div bind:this={answer1El} class="eye-focus-box">
        {currentQuestion.choices[0]}
        <progress value={$progress1} />
      </div>
      <div bind:this={answer2El} class="eye-focus-box">
        {currentQuestion.choices[1]}
        <progress value={$progress2} />
      </div>
    </div>
  {/if}
  {#if currentState === States.RevealingResult}
    <div style="text-align: center">
      <h2>You answered {chosenAnswer}</h2>
      <h2>
        That was {chosenAnswer === currentQuestion.correctAnswer ? 'correct!' : 'incorrect'}
      </h2>
      <div class="eye-focus-box" bind:this={nextQuestionEl}>
        Next question <progress value={$nextQuestionProgress} />
      </div>
    </div>
  {/if}
{/if}
