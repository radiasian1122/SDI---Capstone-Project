import {faker} from '@faker-js/faker';

export function generateUnits(){

}


class User{
  constructor() {
    this.id = 1;
  }
  firstname() {
    return faker.person.firstName('male')
  }
  lastName() {
    return faker.person.lastName('male')
  }
  username() {
    return faker.internet.username()
  }
  password() {
    return faker.internet.password({ length: 10, memorable: true })
  }
  userID() {
    id++
    return id
  }
}

class Vic{
  constructor() {
  }
  deadlined() {
    let num = Math.floor(Math.random() * 2)+1;
   return num == 1 ? true : false;
  }
  bumper() {
    const company = ["A", "B", "C", "D"];
    let num1 = Math.floor(Math.random() * 4) + 1;
    let num2 = Math.floor(Math.random() * 4) + 1;
    return `${company[num1]} ${num2}/${num1}`
  }
  variant() {
    const letters = ["M", "L", "C", "D"];

  }

}


export {Vic}
export {User}