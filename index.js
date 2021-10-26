(function (doc) {
    'use-scrict';

    var divButton = doc.getElementById('buttonsGame');
    var divCartBet = doc.getElementById('areaCartBet');
    var inputPrice = doc.querySelector('[data-js="inputPrice"]');
    var numbersBet = [];
    var idItemsCart = 0;
    var valuesBet = [];
    var games = [];
    var currentGame = {};

    function init() {
        initEvents();
    }

    function initEvents() {
        consumingData();
        startGame();
        completeGame();
        addNumbersCart();
    }

    function consumingData() {
        var ajax = new XMLHttpRequest();
        ajax.open('GET', './dates/games.json');
        ajax.send();
        ajax.addEventListener('readystatechange', function () {
            if (ajax.status === 200 && ajax.readyState === 4) {
                var gameLogic = JSON.parse(ajax.responseText);
                games = gameLogic.types;
            }
        });
    }

    function startGame() {
        var buttonsChoiceGame = doc.querySelectorAll("[data-js='button']");
        Array.prototype.forEach.call(buttonsChoiceGame, function (button) {
            button.addEventListener('click', function (event) {
                divButton.innerHTML = '';
                numbersBet = [];
                createGame(event.target.innerHTML);
            });
        });
    }

    function createGame(typeButton) {
        if (typeButton === 'Lotofácil') {
            currentGame = games[0];
            return createButtons(currentGame);
        };
        if (typeButton === 'Mega-sena') {
            currentGame = games[1];
            return createButtons(currentGame);
        }
        if (typeButton === 'Quina') {
            currentGame = games[2];
            return createButtons(currentGame);
        }
    }

    function createButtons(game) {
        for (var i = 1; i <= game.range; i++) {
            divButton.insertAdjacentHTML('beforeend', `<button data-js="numbers" class="btnNumbers">${i}</button>`);
        }
        fillGaps(game);
        eventButtonsBet(game);
        eventClear();
    }

    function fillGaps(game) {
        var nameGame = doc.getElementById('nameGame');
        var description = doc.getElementById('type-game');
        nameGame.innerHTML = '';
        description.innerHTML = '';
        nameGame.insertAdjacentHTML('beforeend', `${game.type}`);
        description.insertAdjacentHTML('beforeend', `${game.description}`);
    }


    function completeGame() {
        var buttonCompleteGame = doc.querySelector("[data-js='completeGame']");
        buttonCompleteGame.addEventListener('click', function () {
            choiceNumbers(currentGame);
        });
    }

    function choiceNumbers(game) {
        var buttons = doc.querySelectorAll("[data-js='numbers']");
        if (buttons.length === 0) return alert("Selecione um jogo :)");
        while (numbersBet.length < game['max-number']) {
            var randomNumber = Math.floor(Math.random() * game.range).toString();
            (numbersBet.indexOf(randomNumber) === -1 && randomNumber !== '0') ?
                numbersBet.push(randomNumber) : '';
        }
        selectedButtons(numbersBet);
    }

    function selectedButtons(numbersBet) {
        var buttons = doc.querySelectorAll("[data-js='numbers']");
        Array.prototype.filter.call(buttons, function (button) {
            var isSelected = numbersBet.some((item) => { return item === `${button.innerHTML}`; });
            if (isSelected) button.click();
        });
    }


    function eventButtonsBet(game) {
        var buttons = doc.querySelectorAll("[data-js='numbers']");
        Array.prototype.forEach.call(buttons, function (button) {
            button.style.backgroundColor = '#adc0c4';
            button.addEventListener('click', function () {
                button.style.backgroundColor = game['color'];
                if (numbersBet.indexOf(button.innerHTML) === -1) numbersBet.push(button.innerHTML);
            });
        });
    }

    function cartClean() {
        var idCartClean = doc.getElementById('cartClean');
        if (divCartBet.childElementCount > 0)
            return idCartClean.setAttribute('class', 'clean');
    }

    function saveNumbers(numbersBet) {
        var divBet = doc.createElement('div');
        ascendingOrderArray(numbersBet);
        cartClean();
        idItemsCart++;
        divBet.className = 'Resumogame';
        divBet.setAttribute('data-id', `${idItemsCart}`)
        divBet.insertAdjacentHTML('beforeend', `<button data-js="removeBet" class="btRemove" id=${idItemsCart}><img src='./assets/lixo.png'></button>`);
        divBet.insertAdjacentHTML('beforeend', `<div class="numbersItem" style="border-left: 5px solid ${currentGame.color}">
        <div class="numbers">${numbersBet.join(',')}</div>
        <div class="game" data-js="game" id="${currentGame.type}"><p style="color:${currentGame.color}"">${currentGame.type}</p><p>R$${(currentGame.price).toFixed(2)}</p>
        </div></div>`);
        divCartBet.appendChild(divBet);
        valuesBet.push(currentGame.price);
        changeInput(valuesBet);
        clearButton();
        eventButtonRemove();
    }


    function ascendingOrderArray(numbersBet) {
        numbersBet.sort(function (a, b) {
            return a - b;
        });
    }


    function changeInput(values) {
        var value = values.reduce((act, at) => {
            return ((act) + (at))
        });
        inputPrice.value = 'R$ ' + value.toFixed(2).replace(/\./, ',');
    }

    function eventClear() {
        var button = doc.querySelector('[data-js="clearButtons"]');
        button.addEventListener('click', clearButton);
    }

    function addNumbersCart() {
        var buttonSave = doc.querySelector('[data-js="addButtonGame"]');
        buttonSave.addEventListener('click', function () {
            if (numbersBet.length === 0)
                return alert("Não há números selecionados");
            (numbersBet.length === currentGame['max-number']) ? saveNumbers(numbersBet, currentGame) : alert(`Selecione ${currentGame['max-number']} números para apostar na ${currentGame.type}`);

        })
    }


    function clearButton() {
        var buttons = doc.querySelectorAll('[data-js="numbers"]');
        Array.prototype.forEach.call(buttons, function (button) {
            button.style.backgroundColor = '#adc0c4';
            numbersBet = [];
        });
    }

    function eventButtonRemove() {
        var button = doc.querySelectorAll('[data-js="removeBet"]');
        Array.prototype.forEach.call(button, function (button) {
            button.addEventListener('click', removeBet);
        })
    }

    function removeBet() {
        var resumo;
        resumo = doc.querySelector(`[data-id="${this['id']}"]`);
        var priceBet = resumo.lastElementChild.lastElementChild.children[1].innerHTML;
        idItemsCart--;
        valueBetTotal(priceBet);
        resumo.parentNode.removeChild(resumo);
    }

    function valueBetTotal(stringPrice) {
        var regexNumber = /\d+\.\d+/g;
        valuesBet.splice(valuesBet.indexOf(`${parseFloat(stringPrice.match(regexNumber))}`), 1);
        var newValue = parseFloat(inputPrice.value.replace(/\,/, '.').match(/\d+\.\d+/)) - parseFloat(stringPrice.match(/\d+\.\d+/g));
        inputPrice.value = newValue.toFixed(2).replace(/\./, ',');
    }
    init();
})(document);