var errorMessage = new URLSearchParams(location.search).get('error');

const error = document.createElement("p");
error.setAttribute("style", "color: #e42320");
error.innerHTML = errorMessage;

document.querySelector("body").insertBefore(error, document.querySelector("form"));
