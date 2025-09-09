import {faker} from '@faker-js/faker';

export function generateUnits(){

}


class User{
  constructor() {
      this.dodId = faker.number.int({min: 1000000000, max:9999999999});
      this.firstName = faker.person.firstName('male');
      this.lastName = faker.person.lastName('male');
      this.username = `${this.firstName}-${this.lastName}`;
      this.password = 'password';
  }
}

// class Vic{
//   constructor() {
//   }
//   deadlined() {
//     let num = Math.floor(Math.random() * 2)+1;
//    return num == 1 ? true : false;
//   }
//   bumper() {
//     const company = ["A", "B", "C", "D"];
//     let num1 = Math.floor(Math.random() * 4) + 1;
//     let num2 = Math.floor(Math.random() * 4) + 1;
//     return `${company[num1]} ${num2}/${num1}`
//   }
//   variant() {
//     const letters = ["M", "L", "C", "D"];
//
//   }
//
// }


// export {Vic}
export {User}

export function generateUsers() {
    const uicArray = ['NF5HA0', 'NF5HB0', 'NF5HC0']
    const userArray = []

    //Users meant to be requestors
    for (let i = 0; i < uicArray.length; i++){
        for (let j = 0; j < 10; j++){
            let currentUser = new User();
            currentUser.uic = uicArray[i];
            userArray.push(currentUser)
        }

        //Users meant to be drivers
        for (let k = 0; k < 20; k++){

        }
    }
    return userArray;
}

export function generateUsersRoles() {
    const UsersRolesArray = [];
}

console.log(generateUsers(), generateUsers().length);