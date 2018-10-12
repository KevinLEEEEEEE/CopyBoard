import '../css/main.css';

function greeter(person) {
  return "Hellooo, " + person;
}

let user = "Jane User";

document.body.innerHTML += greeter(user);