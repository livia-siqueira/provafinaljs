(function (doc) {
    'use-scrict';

    const divButton = doc.getElementById('buttonsGame');
    const divButtonsTypeGame = doc.getElementById('buttons');
    let divCartBet = doc.getElementById('areaCartBet');
    let inputPrice = doc.querySelector('[data-js="inputPrice"]');
    let numbersBet = [];
    let idItemsCart = 0;
    let valuesBet = [];
    let games = [];
    let currentGame = {};
    let controlEventButton = false;

    function init() {
        initEvents();
    }

    function initEvents() {
        consumingData();
        completeGame();
        addNumbersCart();
        CartClean();
    }

    function consumingData() {
        let ajax = new XMLHttpRequest();
        ajax.open('GET', './dates/games.json');
        ajax.send();
        ajax.addEventListener('readystatechange', function () {
            if (ajax.status === 200 && ajax.readyState === 4) {
                const gameLogic = JSON.parse(ajax.responseText);
                games = gameLogic.types;
                createButtonsTypeGame(games);
            }
        });
    }

    function createButtonsTypeGame(games) {
        for (let i = 0; i < games.length; i++) {
            divButtonsTypeGame.insertAdjacentHTML('beforeend', `<button type="button" data-js="buttons" id="buttons" style="border: 2px solid ${games[i].color};background: white;color:${games[i].color};">${games[i].type}</button>`)
        }
        startGame();
    }

    function startGame() {
        const buttonGame = doc.querySelectorAll('[data-js="buttons"]');
        Array.prototype.forEach.call(buttonGame, function (button) {
            if (button.innerHTML === 'Lotofácil') {
                button.style.backgroundColor = '#7f3992';
                button.style.color = 'white';
            }
            button.addEventListener('click', typeGame);
        });
        initPage();
    }

    function typeGame() {
        divButton.innerHTML = '';
        numbersBet = [];
        checkedButton(this);
        createGame(this.innerHTML);
    }

    function checkedButton(button) {
        const buttonGame = doc.querySelectorAll('[data-js="buttons"]');
        button.style.backgroundColor = button.style.borderColor;
        button.style.color = 'white';
        Array.prototype.map.call(buttonGame, function (bt) {
            if (bt !== button) {
                bt.style.backgroundColor = 'white';
                bt.style.color = bt.style.borderColor;
            } else {
                button.style.backgroundColor = button.style.borderColor;
                button.style.color = 'white';
            }
        })
    }

    function createGame(typeButton) {
        games.map(game => {
            if (game.type === typeButton) {
                currentGame = game;
                return createButtons(currentGame);
            }
        });
    }

    function createButtons(game) {
        for (let i = 1; i <= game.range; i++) {
            divButton.insertAdjacentHTML('beforeend', `<button data-js="numbers" class="btnNumbers">${i}</button>`);
        }
        fillGaps(game);
        eventButtonsBet(game);
        eventClear();
    }

    function fillGaps(game) {
        const nameGame = doc.getElementById('nameGame');
        const description = doc.getElementById('type-game');
        nameGame.innerHTML = '';
        description.innerHTML = '';
        nameGame.insertAdjacentHTML('beforeend', `${game.type}`);
        description.insertAdjacentHTML('beforeend', `${game.description}`);
    }


    function completeGame() {
        const buttonCompleteGame = doc.querySelector("[data-js='completeGame']");
        buttonCompleteGame.addEventListener('click', function () {
            choiceNumbers(currentGame);
        });
    }

    function choiceNumbers(game) {
        const buttons = doc.querySelectorAll("[data-js='numbers']");
        if (buttons.length === 0) return alert("Selecione um jogo :)");
        while (numbersBet.length < game['max-number']) {
            let randomNumber = Math.floor(Math.random() * game.range).toString();
            (numbersBet.indexOf(randomNumber) === -1 && randomNumber !== '0') ?
                numbersBet.push(randomNumber) : '';
        }
        selectedButtons(numbersBet);
    }

    function selectedButtons(numbersBet) {
        const buttons = doc.querySelectorAll("[data-js='numbers']");
        Array.prototype.forEach.call(buttons, function (button) {
            let isSelected = numbersBet.some((item) => { return item === `${button.innerHTML}`; });
            if (isSelected) {
                controlEventButton = true;
                button.click();
            }
        });
    }

    function eventButtonsBet() {
        const buttons = doc.querySelectorAll("[data-js='numbers']");
        Array.prototype.forEach.call(buttons, function (button) {
            button.addEventListener('click', isClicked);
        });
    }

    function isClicked() {
        if (numbersBet.indexOf(this.innerHTML) === -1) {
            if (controlEventButton !== true && numbersBet.length === currentGame['max-number']) return alert(`No ${currentGame.type} são necessários apenas ${currentGame['max-number']} números!`);
        }
        if (controlEventButton === true || numbersBet.indexOf(this.innerHTML) === -1) {
            if (numbersBet.indexOf(this.innerHTML) === -1) numbersBet.push(this.innerHTML);
            this.style.backgroundColor = currentGame.color;
            controlEventButton = false;
        }
        else {
            this.style.backgroundColor = '#adc0c4';
            numbersBet.splice(numbersBet.indexOf(this.innerHTML), 1);
            controlEventButton = false;
        }
    }

    function CartClean() {
        const cartClean = doc.getElementById('cartClean');
        if (divCartBet.childElementCount === 0) {
            return divCartBet.insertAdjacentHTML('beforeend', '<p class="cartClean" id="cartClean">Carrinho vazio</p>');
        }
        return cartClean.classList.add('clean');
    }

    function saveNumbers(numbersBet) {
        const divBet = doc.createElement('div');
        ascendingOrderArray(numbersBet);
        CartClean();
        idItemsCart++;
        divBet.className = 'Resumogame';
        divBet.setAttribute('data-id', `${idItemsCart}`)
        divBet.insertAdjacentHTML('beforeend', `<button data-js="removeBet" class="btRemove" id=${idItemsCart}><img src='./assets/lixo.png'></button>`);
        divBet.insertAdjacentHTML('beforeend', `<div class="numbersItem" style="border-left: 5px solid ${currentGame.color}">
        <div class="numbers"><span>${numbersBet.join(', ')}</span></div>
        <div class="game" data-js="game" id="${currentGame.type}"><p style="color:${currentGame.color}"">${currentGame.type}</p><p>R$${(currentGame.price).toFixed(2).replace(/\./, ',')}</p>
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
        let value = values.reduce((act, at) => {
            return ((act) + (at))
        });
        inputPrice.value = 'R$ ' + value.toFixed(2).replace(/\./, ',');
    }

    function eventClear() {
        const button = doc.querySelector('[data-js="clearButtons"]');
        button.addEventListener('click', clearButton);
    }

    function addNumbersCart() {
        const buttonSave = doc.querySelector('[data-js="addButtonGame"]');
        buttonSave.addEventListener('click', function () {
            if (numbersBet.length === 0)
                return alert("Não há números selecionados");
            (numbersBet.length === currentGame['max-number']) ? saveNumbers(numbersBet, currentGame) : alert(`Selecione ${currentGame['max-number']} números para apostar na ${currentGame.type}`);
        });

    }

    function clearButton() {
        const buttons = doc.querySelectorAll('[data-js="numbers"]');
        Array.prototype.forEach.call(buttons, function (button) {
            button.style.backgroundColor = '#adc0c4';
            numbersBet = [];
        });
    }

    function eventButtonRemove() {
        const button = doc.querySelectorAll('[data-js="removeBet"]');
        Array.prototype.forEach.call(button, function (button) {
            button.addEventListener('click', removeBet);
        });
    }

    function removeBet() {
        let resumo = doc.querySelector(`[data-id="${this['id']}"]`);
        let priceBet = resumo.lastElementChild.lastElementChild.children[1].innerHTML;
        idItemsCart--;
        valueBetTotal(priceBet);
        resumo.parentNode.removeChild(resumo);
        updateCar();
    }

    function updateCar() {
        const isBet = doc.getElementsByClassName('Resumogame');
        if (isBet.length === 0) {
            const element = doc.getElementById('cartClean');
            element.removeAttribute('class', 'clean');
            element.setAttribute('class', 'cartClean');
        };
    }

    function valueBetTotal(stringPrice) {
        let regexNumber = /\d+\.\d+/g;
        valuesBet.splice(valuesBet.indexOf(`${parseFloat(stringPrice.match(regexNumber))}`), 1);
        let newValue = parseFloat(inputPrice.value.replace(/\,/, '.').match(regexNumber)) - parseFloat(stringPrice.replace(',', '.').match(/\d+\.\d+/g));
        inputPrice.value = newValue.toFixed(2).replace(/\./, ',');
    }

    function initPage() {
        createGame('Lotofácil');
    }

    init();
})(document);