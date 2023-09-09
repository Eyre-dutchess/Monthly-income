const LOCAL_STORAGE_NEW_MONTH_KEY = "income_monthly";
let monthes = JSON.parse(localStorage.getItem(LOCAL_STORAGE_NEW_MONTH_KEY))||[];
const LOCAL_STORAGE_SELECTED_DATE_KEY = "income_ID";
let currentID = localStorage.getItem(LOCAL_STORAGE_SELECTED_DATE_KEY);



const newMonthBtn = document.querySelector("[data-add-new-month-btn]")
const monthesContainer = document.querySelector("[data-monthes-container]")



newMonthBtn.addEventListener("click", ()=>{
    const newMonth = createNewMonth();
    monthes.push(newMonth);
    saveANDRender()
})

function createNewMonth(){
    return {
        id: Date.now().toString(),
        monthName:"",
        dates: [],
    }
}
function saveANDRender(){
    saveLS();
    renderMonthes();
}
function saveLS(){
    localStorage.setItem(LOCAL_STORAGE_NEW_MONTH_KEY, JSON.stringify(monthes))
    localStorage.setItem(LOCAL_STORAGE_SELECTED_DATE_KEY, currentID);
}
function renderMonthes(){
    clearContainer(monthesContainer);
    monthes.forEach(month=>{
        const monthEl = document.createElement("div");
        monthEl.classList.add("month-container");
        monthEl.innerHTML = `
                <button class="del-month-btn" data-del-month-btn>X</button>
                <form  action = "submit" class="name-form" data-name-form>
                        <input type="text" id="name"  class="name-input" data-name-input>
                        <label for="name" class="name-label">${month.monthName}</label>
                </form>

                <div class="date-container">
                    <ul class="date-list" data-date-list-container>
                        <li class="date-item"></li>
                    </ul>
                    <form action="submit" class="date-form" data-date-form>
                        <input type="text" class="date-input" data-date-input>
                        <button class="add-new date-btn"></button>
                    </form>
                    <button class="del-date-btn" data-del-date-btn></button>
                </div>

                <div class="income-container">
                    <button class="add-new detail-btn" data-add-new-detail-btn></button>
                    <div class="detail-form-container" data-income-container>
                        <div action="" class="detail-container" data-income-detail-container>
                            <form class="time" data-time>
                                <label >Time: <span></span> </label>
                                <input type="text" class="data-time-input">
                            </form>
                            <form class="st-name" data-stname>
                                <label >Name: <span></span></label>
                                <input type="text" class="data-st-name-input">
                            </form>
                            <form class="income" data-income>
                                <label >Income:<span></span> </label>
                                <input type="text" class="data-income-input">
                            </form>
                            <button class="del-detail-form-btn">X</button>
                        </div>
                        
                    </div>

                    <div class="total-container" data-daily-total-container>
                        <button class="check-btn"></button>
                        <div class="total-output">
                            <p>Total: </p>
                            <p class="total-result"></p>
                        </div>
                    </div>
                </div>
        `

        const delMonthBtn = monthEl.querySelector("[data-del-month-btn]");
        delMonthBtn.addEventListener("click", ()=>{
            monthes = monthes.filter(item=> item !== month);
            saveANDRender()
        });

        //name
        const nameForm = monthEl.querySelector("[data-name-form]");
        const nameInput = monthEl.querySelector("[data-name-input]");
        nameForm.addEventListener("submit", (e)=>{
            e.preventDefault();
            const newMonthName = nameInput.value;
            if(newMonthName == null || newMonthName === "") return;
            month.monthName = newMonthName;
           
            saveANDRender();
        })


        //dates
        const dateForm = monthEl.querySelector("[data-date-form]");
        const dateInput = monthEl.querySelector("[data-date-input]");
        const delDateBtn = monthEl.querySelector("[data-del-date-btn]");
        const dateListContainer = monthEl.querySelector("[data-date-list-container]");


        // income detail
        const incomeContainer = monthEl.querySelector("[data-income-container]")
        const addNewIncomeBtn = monthEl.querySelector("[data-add-new-detail-btn]");
        
        //daily total check
        const checkBtn = monthEl.querySelector(".check-btn");
        const totalResult = monthEl.querySelector(".total-result");

        dateListContainer.addEventListener("click", (e)=>{
            if(e.target.tagName.toLowerCase() === "li"){
                const currentDateItem = e.target;
                currentID = currentDateItem.id;
                saveANDRender();
            }
        })
        dateForm.addEventListener("submit", (e)=>{
            e.preventDefault();
            const newDateName = dateInput.value;
            if(newDateName == null || newDateName === "") return;
            const newDate = createNewDate(newDateName);
            month.dates.push(newDate);
            saveANDRender();
        })


        addNewIncomeBtn.addEventListener("click", ()=>{
            const currentDate = month.dates.find(item=> item.id === currentID);
            const newIncomeItem = createNewIncome();
            currentDate.incomes.push(newIncomeItem);
            saveANDRender();
        })
        function createNewIncome(){
            return{
                id: Date.now().toString(),
                classTime: "",
                stName: "",
                detailIncome: "",
            }
        }

        function createNewDate(name){
            return{
                id: Date.now().toString(),
                dateName: name,
                incomes: [],
                value: "",
            }
        }
        function renderDates(){
            clearContainer(dateListContainer);
            displayDates();
            if(currentID == null){
                incomeContainer.style.display = "none";
            }else{
                incomeContainer.style.display = "";
                const currentDate = month.dates.find(item=> item.id === currentID);
                clearContainer(incomeContainer);
                displayIncomes(currentDate);
                totalResult.innerText = currentDate.value ;
                checkBtn.addEventListener("click", ()=>{
                    const detailIncomeArray = currentDate.incomes.map(item=> parseInt(item.detailIncome));
                    const totalDailyIncome = detailIncomeArray.reduce((a, b)=> a+b, 0);
                    currentDate.value = totalDailyIncome;
                    
                    saveANDRender();
                })
            }
        }
        function displayDates(){
            month.dates.forEach(date=>{
                const dateItem = document.createElement("li");
                dateItem.classList.add("date-item");
                dateItem.id = date.id;
                if(date.id === currentID){
                    dateItem.classList.add("active")
                }
                dateItem.innerText = date.dateName;
                dateListContainer.append(dateItem)
            })
        }
        function displayIncomes(date){
            date.incomes.forEach(income=>{
                const incomeItem = document.createElement("div");
                incomeItem.classList.add("detail-container");
                incomeItem.innerHTML = `
                <form class="time" data-time>
                    <label >Time: <span>${income.classTime}</span> </label>
                    <input type="text" data-time-input>
                </form>
                <form class="st-name" data-stname>
                    <label >Name: <span>${income.stName}</span></label>
                    <input type="text" data-st-name-input>
                </form>
                <form class="income" data-income>
                    <label >Income:<span>${income.detailIncome}</span> </label>
                    <input type="text" data-income-input>
                </form>
                <button class="del-detail-form-btn">X</button>
                `
                const classTimeInput = incomeItem.querySelector("[data-time-input]");
                const classTimeForm = incomeItem.querySelector("[data-time]");
                classTimeForm.addEventListener("submit", (e)=>{
                    e.preventDefault();
                    const newClassTime = classTimeInput.value;
                    if(newClassTime==null || newClassTime === "") return;
                    income.classTime = newClassTime;
                    saveANDRender() 
                })

                const stNameInput = incomeItem.querySelector("[data-st-name-input]");
                const stNameForm = incomeItem.querySelector("[data-stname]");
                stNameForm.addEventListener("submit", (e)=>{
                    e.preventDefault();
                    const newStName = stNameInput.value;
                    if(newStName==null || newStName === "") return;
                    income.stName = newStName;
                    saveANDRender() 
                })

                const detailIncomeInput = incomeItem.querySelector("[data-income-input]");
                const detailIncomeForm = incomeItem.querySelector("[data-income]");
                detailIncomeForm.addEventListener("submit", (e)=>{
                    e.preventDefault();
                    const newdetailIncome = detailIncomeInput.value;
                    if(newdetailIncome==null || newdetailIncome === "") return;
                    income.detailIncome = newdetailIncome;
                    saveANDRender() 
                })

                const delDetailIncomeBtn = incomeItem.querySelector(".del-detail-form-btn");
                delDetailIncomeBtn.addEventListener("click", ()=>{
                    date.incomes = date.incomes.filter(item=> item !== income);
                    saveANDRender();
                })

                incomeContainer.append(incomeItem)
            })
            
        }
        

        delDateBtn.addEventListener("click", ()=>{
            if(currentID == null){
                delDateBtn.classList.add("invalid");
            }else{
                delDateBtn.classList.remove("invalid");
                month.dates = month.dates.filter(item => item.id !== currentID);
                currentID = null;
                saveANDRender();
            }
            
        })




        renderDates()
        monthesContainer.append(monthEl); 
    })
}
renderMonthes()

function clearContainer(item){
    while(item.firstChild){
        item.removeChild(item.firstChild)
    }
}