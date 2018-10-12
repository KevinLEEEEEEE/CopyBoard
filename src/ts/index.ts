import "../css/main.css";

function greeter(person) {
  return "Hellooo, " + person;
}

const user = "Jane User";

document.body.innerHTML += greeter(user);
