import {faker} from '@faker-js/faker';
import { db } from './db.js'

export function generateUnits() {

}


// class User{
//   constructor() {
//       this.dodId = faker.number.int({min: 1000000000, max:9999999999});
//       this.firstName = faker.person.firstName('male');
//       this.lastName = faker.person.lastName('male');
//       this.username = `${this.firstName}-${this.lastName}`;
//       this.password = 'password';
//   }
// }

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
// export {User}

export function generateUsers() {
    const uicArray = ['NF5HA0', 'NF5HB0', 'NF5HC0']
    const userArray = []

    //Users meant to be requestors
    for (let i = 0; i < uicArray.length; i++) {
        for (let j = 0; j < 15; j++) {

            const fakeFirstName = faker.person.firstName('male');
            const fakeLastName = faker.person.lastName('male');

            userArray.push({
                dodId: faker.number.int({min: 1000000000, max: 9999999999}),
                username: `${fakeFirstName} - ${fakeLastName}`,
                password: 'password',
                uic: uicArray[i],
                firstName: fakeFirstName,
                lastName: fakeLastName,
            })
        }

        //Users meant to be drivers
        for (let k = 0; k < 20; k++) {

            const fakeFirstName = faker.person.firstName('male');
            const fakeLastName = faker.person.lastName('male');

            userArray.push({
                dodId: faker.number.int({min: 1000000000, max: 9999999999}),
                uic: uicArray[i],
                firstName: fakeFirstName,
                lastName: fakeLastName,
            })
        }
    }
    return userArray;//User array length is 90
}

export function generateUsersRoles() {
    const usersRolesArray = [];
    const users = generateUsers()
    for (let i = 0; i < users.length; i++) {
        if (i < 30) {
            usersRolesArray.push({
                userID: users[i].dodId,
                roleId: 1//requestor
            })
        } else if (i > 30 && i < 45) {
            usersRolesArray.push({
                userID: users[i].dodId,
                roleId: 3//approver
            })
        } else if (i > 30 && i < 90) {
            usersRolesArray.push({
                userID: users[i].dodId,
                roleId: 4//driver
            })
        }
    }
    return usersRolesArray;
}

export function generateVehicles() {
    //Bumper no. format "JLTV-1, JLTV-2. etc."
    const uicArray = ['NF5HA0', 'NF5HB0', 'NF5HC0']
    const vehicleTypes = ['JLTV', '1.1', 'STRYKER', 'MRZR', 'ISV', 'LMTV', 'TLC', 'RFSS', 'QUAD']
    let vehicles = []

    for (let i = 0; i < uicArray.length; i++){
        for (let j = 0; j < vehicleTypes.length; j++){
            for (let k = 0; k < 3; k++){
                vehicles.push({
                    uic: uicArray[i],
                    platform_variant: j + 1,
                    bumper_no: `${vehicleTypes[j]}-${k + 1}`,
                    deadlined: false
                })
            }
        }
    }


    return vehicles;
}

// console.log(generateUsersRoles());
console.log(generateVehicles());