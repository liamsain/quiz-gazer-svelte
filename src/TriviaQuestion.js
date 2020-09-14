export default class TriviaQuestion {
  constructor(config) {
    this.correctAnswer = config.correct_answer;
    this.choices = Math.round(Math.random()) === 0 ? [this.correctAnswer, config.incorrect_answers[0]] : [config.incorrect_answers[0], this.correctAnswer];
    var txt = document.createElement("textarea");
    txt.innerHTML = config.question;
    this.question = txt.value;
    this.category = config.category;
  }
}