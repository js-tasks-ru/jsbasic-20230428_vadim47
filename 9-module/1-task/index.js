export default function promiseClick(button) {
  return new Promise((resolve, rej) =>
    button.addEventListener("click", (event) => resolve(event))
  );
}