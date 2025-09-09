import {faker} from '@faker-js/faker';

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
        for (let j = 0; j < 10; j++) {

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
            userArray.push({
                dodId: faker.number.int({min: 1000000000, max: 9999999999}),
                uic: uicArray[i],
                firstName: fakeFirstName,
                lastName: fakeLastName,
            })
        }
    }
    return userArray;
}

export function generateUsersRoles() {
    const UsersRolesArray = [];


}

export function generateVehicles(){
    const vehicleTypes = ['JLTV', '1.1', 'STRYKER', 'MRZR', 'ISV', 'LMTV', 'TLC', 'RFSS', 'QUAD']
    let vehicles = []
    for (let i = 0; i < vehicleTypes.length; i++){
        for (let j = 0; j < 10; j++){
            vehicles.push({

            })
        }
    }
    return vehicles;
}

console.log(generateUsers(), generateUsers().length);