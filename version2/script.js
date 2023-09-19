const LOCAL_STORAGE_MONTH_KEY = "2023_income";
let monthes = JSON.parse(localStorage.getItem(LOCAL_STORAGE_MONTH_KEY))||[];
const LOCAL_STORAGE_INCOME_ID_KEY = "2023_income_ID";
let currentID = localStorage.getItem(LOCAL_STORAGE_INCOME_ID_KEY);


const addNewMonthBtn = document.querySelector("[data-add-new-month-btn]");
const allMonthesContainer = document.querySelector("[data-all-monthes-container]")


addNewMonthBtn.addEventListener("click", ()=>{
    const newMonth = createNewMonth();
    monthes.push(newMonth);
    saveAndRender()
})



function createNewMonth(){
    return {
        id: Date.now().toString(),
        monthName: "",
        dates: [],
    }
}

function saveAndRender(){
    saveLS();
    renderMonthes()
}
function saveLS(){
    localStorage.setItem(LOCAL_STORAGE_MONTH_KEY, JSON.stringify(monthes));
    localStorage.setItem(LOCAL_STORAGE_INCOME_ID_KEY, currentID);
}
function renderMonthes(){
    clearContainer(allMonthesContainer);
    displayMonth();
}

function displayMonth(){
    monthes.forEach(month=>{
        const monthEl = document.createElement("section");
        monthEl.classList.add("month-container");
        monthEl.innerHTML = `
        <header class="month-top">
            <button class="del-month-btn" data-del-month-btn>X</button>
            <form action="submit" class="name-form" data-month-name-form>
                <label for="name" class="name-label">${month.monthName}</label>
                <input type="text" id="name" class="name-input" data-month-name-input>
            </form>
        </header>

        <div class="date-container" data-date-container>
            <ul class="date-list" data-date-list>
                
            </ul>
            <form action="submit" class="date-form" data-date-form>
                <input type="text" class="date-input" data-date-input>
                <button class="add-date-btn" data-add-date-btn></button>
            </form>
            <button class="del-date-btn" data-del-date-btn></button>
        </div>

        <div class="income-container" data-income-container >
            <header>
                
                <form action="submit" class="income-form" data-income-detail-form>
                    <div class="time">
                        <label for="time" class="time">Time: </label>
                        <input id="time" type="text" data-income-time-input>
                    </div>
                    <div class="st-name">
                        <label for="st-name" class="st-name">Name:</label>
                        <input id="st-name" type="text" data-income-stname-input>
                    </div>
                    <div class="income">
                        <label for="income" class="income">Income:</span> </label>
                        <input id="income"  type="text" data-income-value-input>
                    </div>
                    <button type="submit" class="add-new-income-btn" data-add-new-income-form-btn></button>
                </form>
            </header>
            <ul class="income-forms-container" data-income-forms-container>
                <li class="income-detail-output">
                    <p></p>
                    <p></p>
                    <p></p>
                    <button class="del-income-btn" data-del-income-form-btn>x</button>
                </li>
            </ul>

            <div class="total-container" data-total-value-container>
                <button class="total-btn" data-get-total-value-btn></button>
                <p class="total-value">Total: <span data-total-value-output></span></p>
            </div>
        </div>
    
    `


    const delMonthBtn = monthEl.querySelector("[data-del-month-btn]");
    delMonthBtn.addEventListener("click", ()=>{
        monthes = monthes.filter(item=> item.id !== month.id);
        saveAndRender()
    })


    //month name
    const nameForm = monthEl.querySelector("[data-month-name-form]");
    const nameInput = monthEl.querySelector("[data-month-name-input]")
    nameForm.addEventListener("submit", (e)=>{
        e.preventDefault();
        const newMonthName = nameInput.value;
        if(newMonthName == null || newMonthName === "")return;
        month.monthName = newMonthName;
        saveAndRender()

    })


    //dates
    const dateForm = monthEl.querySelector("[data-date-form]");
    const dateInput = monthEl.querySelector("[data-date-input]");
    const dateContainer = monthEl.querySelector("[data-date-list]");
    const delDateBtn = monthEl.querySelector("[data-del-date-btn]");

    const incomeFormsContainer = monthEl.querySelector("[data-income-forms-container]");
    const addNewIncomeBtn = monthEl.querySelector("[data-add-new-income-form-btn]");
    const timeInput = monthEl.querySelector("[data-income-time-input]");
    const stNameInput = monthEl.querySelector("[data-income-stname-input]");
    const incomeInput = monthEl.querySelector("[data-income-value-input]");
    
    //total value
    const totalOutput = monthEl.querySelector("[data-total-value-output]");
    
    
    delDateBtn.addEventListener("click", ()=>{
        month.dates = month.dates.filter(date=> date.id !== currentID);
        currentID = null;
        saveLS();
        renderDates()
    })

    dateContainer.addEventListener("click", (e)=>{
        if(e.target.tagName.toLowerCase()==="li"){
            currentID = e.target.id;
            saveLS();
            renderDates()
        }
    })


    dateForm.addEventListener("submit", (e)=>{
        e.preventDefault();
        const newDateName = dateInput.value;
        if(newDateName == null || newDateName === "")return;
        const newDate = createNewDate(newDateName);
        month.dates.push(newDate);
        saveAndRender()
    })


    function createNewDate(name){
        return{
            id: Date.now().toString(),
            dateName: name,
            dailyIncomes: [],
            totalValue: ""
        }
    }


    addNewIncomeBtn.addEventListener("click", (e)=>{
        const currentDate = month.dates.find((date)=> date.id === currentID);
        const newClassTime = timeInput.value;
        const newStName = stNameInput.value;
        const newIncomeValue = incomeInput.value;
        const newIncomeDetail  = createNewIncome(newClassTime, newStName, newIncomeValue);
        currentDate.dailyIncomes.push(newIncomeDetail);
        saveAndRender()

    })
   
    function createNewIncome(time, name, num){
        return{
            id: Date.now().toString(),
            classTime: time,
            stName: name,
            incomeValue:num,
        }
    }
    function renderDates(){
        clearContainer(dateContainer);
        displayDates();
        if(currentID == null){
            incomeFormsContainer.style.display = "none"
        }else{
            incomeFormsContainer.style.display = "";
            const currentDate = month.dates.find((date)=> date.id === currentID);
            clearContainer(incomeFormsContainer);
            displayIncomes(currentDate);
            totalOutput.innerText = currentDate.totalValue;
        }
    }

    function displayIncomes(theDate){
        theDate.dailyIncomes.forEach(income=>{
                const newIncomeItem = document.createElement("li");
                newIncomeItem.classList.add("income-detail-output");
                newIncomeItem.innerHTML = `
                    <p>Time:<br> ${income.classTime}</p>
                    <p>Name: <br>${income.stName}</p>
                    <p>Income:<br> ${income.incomeValue}</p>
                    <button class="del-income-btn" data-del-income-form-btn>x</button>
                
                `
                const delIncomeBtn = newIncomeItem.querySelector("[data-del-income-form-btn]");
                delIncomeBtn.addEventListener("click", ()=>{
                    theDate.dailyIncomes = theDate.dailyIncomes.filter((item)=> item!==income);
                    saveLS();
                    renderDates();
                })
                incomeFormsContainer.append(newIncomeItem);
            })
        }
    
    function displayDates(){
        month.dates.forEach(date =>{
            const dateItem = document.createElement("li");
            dateItem.classList.add("date-item");
            dateItem.innerText = date.dateName;
            dateItem.id = date.id;
            if(date.id === currentID){
                dateItem.classList.add("active")
            }
            dateContainer.append(dateItem);
        })
    }
    
    renderDates()


    //daily total value
    const totalValueBtn = monthEl.querySelector("[data-get-total-value-btn]");
    totalValueBtn.addEventListener("click", ()=>{
        const currentDate = month.dates.find((date)=> date.id === currentID);
        const valueArray = currentDate.dailyIncomes.map((item)=> parseInt(item.incomeValue));
        const total = valueArray.reduce((a, b) => a+b, 0);
        currentDate.totalValue = total;
        saveAndRender()
    })

    allMonthesContainer.append(monthEl);
    })
}
renderMonthes()

function clearContainer(item){
    while(item.firstChild){
        item.removeChild(item.firstChild)
    }
}