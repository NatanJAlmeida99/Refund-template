// Seleciona os elementos do formulário
const form = document.querySelector("form");
const amount = document.querySelector("#amount");
const expense = document.querySelector("#expense");
const category = document.querySelector("#category");

// Seleciona os elementos da lista
const expenseList = document.querySelector("ul");
const expenseTotal = document.querySelector("aside header h2");
const expenseTot = document.querySelector("aside header p span");

// Captura o evento de input para formatar o valor
amount.oninput = () => {
    // Obtém o valor atual do input e remove os caracteres não numéricos
    let value = amount.value.replace(/\D/g, "");

    // Transformar o valor em centavos
    value = Number(value) / 100;

    // Atualiza o valor do input
    amount.value = formatCurrencyBRL(value);
};

function formatCurrencyBRL(value) {
    // Formata o valor para padrão BRL (Real Brasileiro)
    value = value.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
    });

    // Retorna o valor formatado
    return value
};

// Captura o evento de submit do formulário para obter os valores
form.onsubmit = (event) => {
    // Previne o comportamento padrão de recarregar a página
    event.preventDefault();

    // Cria um objeto com os detalhes na nova despesa
    const newExpense = {
        id: new Date().getTime(),
        expense: expense.value,
        category_id: category.value,
        category_name: category.options[category.selectedIndex].text,
        amount: amount.value,
        created_at: new Date()
    };

    // Chama a função que irá adicionar o item na lista
    expenseAdd(newExpense);
};

// Esse método adiciona um novo item na lista
function expenseAdd(newExpense) {
    try {
        // Cria o elemento para adicionar o item (li) na lista (ul).
        const expenseItem = document.createElement("li");
        expenseItem.classList.add("expense");

        // Cria o ícone da categoria
        const expenseIcon = document.createElement("img");
        expenseIcon.setAttribute("src", `img/${newExpense.category_id}.svg`);
        expenseIcon.setAttribute("alt", newExpense.category_name);

        // Cria a info da despesa
        const expenseInfo = document.createElement("div");
        expenseInfo.classList.add("expense-info");

        // Cria o nome da despesa
        const expenseName = document.createElement("strong");
        expenseName.textContent = newExpense.expense;

        // Cria a categoria da despesa
        const expenseCategory = document.createElement("span");
        expenseCategory.textContent = newExpense.category_name;

        // Cria o valor da despesa
        const expenseAmount = document.createElement("span");
        expenseAmount.classList.add("expense-amount");
        expenseAmount.innerHTML = `<small>R$</small>${newExpense.amount
            .toUpperCase()
            .replace("R$", "")}`;

        // Cria o icone de remover
        const removeIcon = document.createElement("img");
        removeIcon.classList.add("remove-icon");
        removeIcon.setAttribute("src", "img/remove.svg");
        removeIcon.setAttribute("alt", "remover");

        // Adicionar nome e categoria nas div das informações
        expenseInfo.append(expenseName, expenseCategory);

        // Adiciona as informações no item
        expenseItem.append(expenseIcon, expenseInfo, expenseAmount, removeIcon);

        // Adiciona o item na lista
        expenseList.append(expenseItem);

        // Limpar os campos para adicionar um novo item
        formClear();

        // Atualiza os totais
        updateTotatls();

    } catch (error) {
        alert("Não foi possível atualizar a lista de despesas.")
        console.log(error);
    };
};

// Atualiza os totais
function updateTotatls() {
    try {
        // Recupera todos os itens (li) da lista (ul)
        const items = expenseList.children

        // Atuliaza a quantidade de itens da lista
        expenseTot.textContent = `${items.length} ${items.length > 1 ? "despesas": "despesa"}`

        // Variável para incrementar o total
        let total = 0;

        // Percorre cada item (li) da lista (ul)
        for (let item = 0; item < items.length; item++) {
            const itemAmount = items[item].querySelector(".expense-amount");
            
            // Remove caracters não númericos e substitui a vírgula pelo ponto
            let value = itemAmount.textContent.replace(/[^\d,]/g, "").replace(",", ".");

            value = parseFloat(value)

            // Verificar se é um número válido 
            if (isNaN(value)) {
                return alert("Não foi possível calcular o total. O valor não parecer ser um número")
            }

            // Incrementar o valor total
            total += Number(value);
        };

        // Criar a span para adicionar o R$ formatado.
        const symbolBRL = document.createElement("small");
        symbolBRL.textContent = "R$"

        //Formata o valor e remove o R$ que será exibido pelo small com um estilo customizado
        total = formatCurrencyBRL(total).toUpperCase().replace("R$", "")

        // Limpa o conteúdo do elemento
        expenseTotal.innerHTML = ""

        // Adiciona o símblo da moeda e o valor total formatado
        expenseTotal.append(symbolBRL, total)
    
    } catch (error) {
        alert("Não foi possível atualizar os totais")
    }
};

// Evento que captura click nos itens da lista
expenseList.addEventListener("click", function(event) {
    // Verifica se o elemento clicado é o ícone de remover
    if (event.target.classList.contains("remove-icon")) {
        // Obetém a li pai do elemento clicado
        const item = event.target.closest(".expense");
        // Remove o item da lista
        item.remove()
    }
    // Atualiza os totais
    updateTotatls()
});

function formClear() {
    expense.value = "";
    category.value = "";
    amount.value = "";

    expense.focus();
}