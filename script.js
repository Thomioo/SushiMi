let addBtn = document.getElementById("add")
let removeBtn = document.getElementById("remove")
let doneBtn = document.getElementById("done")
let colorOptions = ["#fffb00aa", "#19fff4aa", "#003cd5aa", "#a000d5aa", "#ff1fd6aa"];
let colorsList = [];
let users = document.getElementById("names").getElementsByClassName("user");

removeBtn.addEventListener("click", () => {
    users = document.getElementById("names").getElementsByClassName("user");
    if (users.length > 1) {
        users[users.length - 1].remove();
        colorsList.pop(colorsList[colorsList.length - 1]);
    }
});

addBtn.addEventListener("click", () => {
    const names = document.getElementById("names");
    const children = names.getElementsByClassName("user");

    const referenceNode = document.getElementById("controls");
    const userDiv = document.createElement('div');
    userDiv.className = 'user';

    const textInput = document.createElement('input');
    textInput.type = 'text';
    textInput.name = 'text';
    textInput.className = 'input';
    textInput.placeholder = 'Jméno';

    const buttonInput = document.createElement('input');
    buttonInput.type = 'button';
    buttonInput.name = 'button';
    buttonInput.className = 'color';

    // Assign a unique index
    const index = colorsList.length;
    colorsList[index] = index % colorOptions.length;
    buttonInput.dataset.colorIndex = colorsList[index];
    buttonInput.style.backgroundColor = colorOptions[colorsList[index]];

    // Add event listener
    buttonInput.addEventListener('click', () => {
        let i = parseInt(buttonInput.dataset.colorIndex);
        i = (i + 1) % colorOptions.length;
        colorsList[index] = i;
        buttonInput.style.backgroundColor = colorOptions[i];
        buttonInput.dataset.colorIndex = i;
        console.log(colorsList);
    });

    userDiv.appendChild(textInput);
    userDiv.appendChild(buttonInput);
    names.insertBefore(userDiv, referenceNode);
});

doneBtn.addEventListener("click", () => {
    let rawNames = "";
    let namesList = document.getElementById("names").getElementsByTagName("input");
    let rawColors = "";
    Array.from(namesList).forEach(element => {
        let name = element.value;
        rawNames += name + ";";
    });

    colorsList.forEach(value => {
        rawColors += value + ";"
    });

    if (rawNames.endsWith(";")) {
        rawNames = rawNames.slice(0, -1);
    }

    if (rawColors.endsWith(";")) {
        rawColors = rawColors.slice(0, -1);
    }

    const urinames = encodeURIComponent(rawNames);
    const uricolors = encodeURIComponent(rawColors);
    window.location.href = `main.html?names=${urinames}&colors=${uricolors}`;
});

document.querySelectorAll('.color').forEach((button, i) => {
    button.dataset.colorIndex = i % colorOptions.length;
    colorsList[i] = i % colorOptions.length;
    button.style.backgroundColor = colorOptions[i % colorOptions.length];
    console.log(button.style);
    button.addEventListener('click', () => {
        let index = parseInt(button.dataset.colorIndex);
        index = (index + 1) % colorOptions.length;
        colorsList[i] = index;
        button.style.backgroundColor = colorOptions[index];
        button.dataset.colorIndex = index;
        console.log(colorsList);
    });
});