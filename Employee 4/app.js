$(function () {
  let Name = $("#name");
  let Job = $("#job");
  let Salary = $("#salary");
  let id = null;
  let flag = true;

  let arr2 = [];

  function getshow() {
    apiCalls("get");
  }

  function clear(){
    Name.val("");
    Job.val("");
    Salary.val("");
  }

  function employee(name, job, salary) {
    this.name = name;
    this.job = job;
    this.salary = Number(salary);
  }

  function show(arr) {
    $("#table").html(`
    <thead>
          <tr>
            <th>
            Name
            <div class="dropdown">
              <button class="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                Sort
              </button>
              <ul class="dropdown-menu " id="name">
                <li><button class="dropdown-item acc" value="name" id="acc" type="button">ACC</button></li>
                <li><button class="dropdown-item dcc" value="name" id="dcc" type="button">DEC</button></li>
                
              </ul>
            </div>
            </th>
            <th>Job
              <div class="dropdown">
                <button class="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                  Sort
                </button>
                <ul class="dropdown-menu" id="job">
                  <li><button class="dropdown-item acc" value="job" type="button" id="acc">ACC</button></li>
                  <li><button class="dropdown-item dcc" value="job" type="button" id="dcc">DEC</button></li>
                  
                </ul>
              </div>
            </th>
            <th>Salary
              <div class="dropdown">
                <button class="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                  Sort
                </button>
                <ul class="dropdown-menu" id="salary">
                  <li><button class="dropdown-item acc" value="salary" type="button" id="acc">ACC</button></li>
                  <li><button class="dropdown-item dcc" value="salary" type="button" id="dcc">DEC</button></li>
                  
                </ul>
              </div>
            </th>
            <th>Action
              
               
            </th>
          </tr>
          </thead>`);
    arr.forEach((e) => {
      let tabb = `
      <tbody>
      <tr id="rw-${e.id}"> 
        <td>${e.name}</td>
        <td>${e.job}</td>
        <td>${e.salary}</td>
        <td>
        <button  class="delete btn btn-danger" id ="${e.id}" >delete</button>
        <button  class = "edit btn btn-secondary" id ="${e.id}" class="edit">edit</button>
      </td>
      </tbody>
    </tr>`;

      $("#table").append(tabb);
    });
  }

  function apiCalls(method, data) {
    if (method == "get") {
      let request = $.ajax({
        url: "http://localhost:3000/Employees",
        method: "GET",
      });

      request.done(function (data) {
        arr2 = data;
        console.log(arr2);
        show(arr2);
      });

      request.fail(function (jqXHR, textStatus) {
        alert("Request failed: " + textStatus);
      });
    } else if (method == "post") {
      let request = $.ajax({
        url: "http://localhost:3000/Employees",
        method: "POST",
        data: data,
      });

      request.done(function (data) {
        console.log(data);
        let tabb = `<tr id="rw-${data.id}"> 
          <td>${data.name}</td>
            <td>${data.job}</td>
            <td>${data.salary}</td>
            <td>
            <button  class="delete btn btn-danger" id ="${data.id}" >delete</button>
            <button  class = "edit btn btn-secondary" id ="${data.id}" class="edit">edit</button>
          </td>
       </tr>`;
        arr2.push(data);

        $("#table").html($("#table").html()+tabb)
      });

      request.fail(function (jqXHR, textStatus) {
        alert("Request failed: " + textStatus);
      });
    } else if (method == "put") {
      let request = $.ajax({
        url: `http://localhost:3000/Employees/${id}`,
        method: "PUT",
        data: data,
      });

      request.done(function (data) {
        console.log(data);
        getshow();
      });

      request.fail(function (jqXHR, textStatus) {
        alert("Request failed: " + textStatus);
      });
    } else if (method == "dele") {
      let request = $.ajax({
        url: `http://localhost:3000/Employees/${id}`,
        method: "DELETE",
      });

      request.done(function (data) {
        $(`#rw-${id}`).remove();
      });

      request.fail(function (jqXHR, textStatus) {
        alert("Request failed: " + textStatus);
      });
    }
  }

  function Sort(arr,val,sort){

    if(val=="name"){
      if(sort=="acc"){
        arr.sort((a, b) => a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1);
        console.log(arr);
      }
      else{
        arr.sort((a, b) => a.name.toLowerCase() > b.name.toLowerCase() ? -1 : 1);
        console.log(arr);
      }
    }
    else if(val=="job"){
      if(sort=="acc"){
        arr.sort((a, b) => a.job.toLowerCase() > b.job.toLowerCase() ? 1 : -1);
        console.log(arr);
      }
      else{
        arr.sort((a, b) => a.job.toLowerCase() > b.job.toLowerCase() ? -1 : 1);
        console.log(arr);
      }
    }
    else{
      if(sort=="acc"){
        arr.sort((a, b) => Number(a.salary) > Number(b.salary) ? 1 : -1);
        console.log(arr);
      }
      else{
        arr.sort((a, b) => Number(a.salary) > Number(b.salary) ? -1 : 1);
        console.log(arr);
      }

    }
    

    show(arr);
    
  }

 async function SortWith(field,order){

   let json = await fetch(`http://localhost:3000/Employees/?_sort=${field}&_order=${order}`);
   let data = await json.json();
   show(data);

  }

 function searchData(){
  let obj = new employee(Name.val(), Job.val(), Number(Salary.val()))
  let arr =arr2.filter(e=>{if(e.name===obj.name && e.job===obj.job && Number(e.salary)===Number(obj.salary)){return e}});
  if(arr.length==0){
    alert("Not found");
    location.reload();
  }
  show(arr);
 }
 
  getshow();


  if (arr2.length > 0) {
    show(arr2);
  }




  $("#btn").click(async (e) => {
    if (flag == true) {

      if(Name.val()==""||Job.val()==""||Salary.val()==""){
        alert("Enter valid inputs");
        return;
      }

      let obj = new employee(Name.val(), Job.val(), Number(Salary.val()));

      apiCalls("post", obj);

      clear();
    } else {

      if(Name.val()==""||Job.val()==""||Salary.val()==""){
        alert("Enter valid inputs");
        return;
      }

      let obj = new employee(Name.val(), Job.val(), Salary.val());

      apiCalls("put", obj);

      $("#btn").html("Add");

      clear();

      flag = true;
    }
  });

$("#search").click(searchData);


  $("#table").on("click", ".delete", async function () {
    console.log(this, this.id);
    id = this.id;
    console.log(id);
    apiCalls("dele");
  });





  $("#table").on("click", ".edit", async function () {
    $("#btn").html("Edit");
    flag = false;
    id = this.id;
    let request = $.ajax({
      url: `http://localhost:3000/Employees/${id}`,
      method: "GET",
    });

    request.done(function (data) {
      Name.val(data.name);
      Job.val(data.job);
      Salary.val(data.salary);
    });

    request.fail(function (jqXHR, textStatus) {
      alert("Request failed: " + textStatus);
    });
  });

  $("#table").on("click", ".acc", async function () {
    // sortByname(arr2,"acc");
    // console.log("acc");
    Sort(arr2,this.value,"acc");
    // SortWith(this.value,"asc")

    console.log(this.value)
  })
  $("#table").on("click", ".dcc", async function () {
    // sortByname(arr2,"dcc");
    // console.log("dcc");
    Sort(arr2,this.value,"dcc");
    // SortWith(this.value,"desc");
  })


});
