<script>
  import TriviaQuestion from "./TriviaQuestion.js";
  import { tweened } from "svelte/motion";
  import { cubicOut } from "svelte/easing";

  const States = {
    AskingQuestion: "asking",
    RevealingResult: "result",
  };

  export let eyeX;
  export let eyeY;
  let currentState = States.AskingQuestion;
  let points = 0;
  let triviaQuestions = [];
  let answer1El;
  let answer2El;
  let currentQuestion;
  let chosenAnswer;
  let answer1ProgressNumber = 0;
  let answer2ProgressNumber = 0;
  const progress1 = tweened(0, {
    duration: 400,
    easing: cubicOut,
  });
  const progress2 = tweened(0, {
    duration: 400,
    easing: cubicOut,
  });

  fetch("https://opentdb.com/api.php?amount=10&category=9&difficulty=medium")
    .then((response) => response.json())
    .then((data) => {
      triviaQuestions = data.results.map((x) => new TriviaQuestion(x));
      console.log(triviaQuestions);
      currentQuestion = triviaQuestions[0];
      startTimer();
    })
    .catch((error) => {
      alert(`Failed to fetch trivia questions. Message: ${error} `);
    });

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

  function startTimer() {
    let timeout;
    if (eyesInsideEl(answer1El)) {
      if (answer1ProgressNumber < 1) {
        answer1ProgressNumber += 0.01;
        progress1.set(answer1ProgressNumber);
      } else {
        chosenAnswer = currentQuestion.choices[0];
        currentState = States.RevealingResult;
        clearTimeout(timeout);
        return;
      }
    }
    if (eyesInsideEl(answer2El)) {
      if (answer2ProgressNumber < 1) {
        answer2ProgressNumber += 0.01;
        progress2.set(answer2ProgressNumber);
      } else {
        chosenAnswer = currentQuestion.choices[1];
        currentState = States.RevealingResult;
        clearTimeout(timeout);
        return;
      }
    }

    timeout = setTimeout(startTimer, 30);
  }

  function onNextQuestion() {
    triviaQuestions = triviaQuestions.slice(1, triviaQuestions.length);
    currentQuestion = triviaQuestions[0];
    currentState = States.AskingQuestion;
    answer1ProgressNumber = 0;
    progress1.set(0);
    answer2ProgressNumber = 0;
    progress2.set(0);
    startTimer();
  }
</script>

<style>
  .answer-box {
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

    /* background: rgba(255, 121, 63, 1);
    box-shadow: 0 0 0 0 rgba(255, 121, 63, 1); */
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
  {#if currentState === States.AskingQuestion}
    <div style="display: flex;justify-content: center;margin-top: 100px;">
      <div bind:this={answer1El} class="answer-box">
        {currentQuestion.choices[0]}
        <progress value={$progress1} />
      </div>
      <div bind:this={answer2El} class="answer-box">
        {currentQuestion.choices[1]}
        <progress value={$progress2} />
      </div>
    </div>
  {/if}
  {#if currentState === States.RevealingResult}
    <div style="text-align: center">
      <div >You answered {chosenAnswer}</div>
      <div >
        That was {chosenAnswer === currentQuestion.correctAnswer ? 'correct!' : 'incorrect'}
      </div>
      <button on:click={onNextQuestion}>NextQuestion</button>
    </div>
  {/if}
{/if}
