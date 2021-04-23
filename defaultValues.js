class myClass {
  constructor(_firstName = "No First Name", _surname = "No Surname") {
    this.firstName = _firstName;
    this.surname = _surname;
  }
}

let temp = new myClass("Aisling", "Kelly-Brophy");

class secondClass {
  constructor({_firstName = "No First Name", _surname = "No Surname", _age = 22}) {
    this.firstName = _firstName;
    this.surname = _surname;
    this.age = _age;
  }
}
