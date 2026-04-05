export function getFeedback(guess, answer) {
  const feedback = Array(guess.length).fill("grey");
  const ansArr = answer.split("");
  const used = Array(answer.length).fill(false);

  // Pass 1: Greens (exact matches)
  for (let i = 0; i < guess.length; i++) {
    if (guess[i] === ansArr[i]) {
      feedback[i] = "green";
      used[i] = true;
    }
  }

  // Pass 2: Yellows (right letter, wrong position)
  for (let i = 0; i < guess.length; i++) {
    if (feedback[i] === "green") continue;
    for (let j = 0; j < ansArr.length; j++) {
      if (!used[j] && guess[i] === ansArr[j]) {
        feedback[i] = "yellow";
        used[j] = true;
        break;
      }
    }
  }
  return feedback;
}
