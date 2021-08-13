import { firestore } from "../../firebase/init";
import bcrypt from 'bcryptjs';

import nc from 'next-connect';


const middelWare = (req, res, next) => {
    next()
}

const onNoMatch = (req, res) => {
    return res.status(404).end('not found!')
}

const onError = (err, req, res, next) => {
    console.log(`error from on error ${err}`);
    return res.status(404).end('found error');

    // use next() to continue
}

const validateEmail = email => {
    const regex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    return regex.test(email);
}

const validatePassword = password => {
    const regex = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
    return regex.test(password);
}

const duplicateUser = async (name, email, number, businessName) => {

    const usersRef = firestore.collection('users');
    const snapShot = await usersRef.where('name', '==', name)
        .where('email', '==', email)
        .where('number', '==', number)
        .where('businessName', '==', businessName).get();

    return snapShot.empty;
}

const hashPassword = async (password) => {
    return await bcrypt.hash(password, 10);
}



const handler = nc({ onNoMatch, onError })
    .use((req, res, next) => {
        middelWare(req, res, next);
    })
    .get(async (req, res, next) => {
        const cityRef = firestore.collection('categories').doc('types');
        const doc = await cityRef.get();
        if (!doc.exists) {
            console.log('No such document!');
        } else {
            const { names } = doc.data();
            return res.status(200).json(names);
        }
    }).post(async (req, res, next) => {
        let id = '';
        let created = false;
        let message = '';
        let _continue = false; // register user or not;
        const user = req.body;

        if (user.name.lenght < 3 || user.lastName.lenght < 3) {
            _continue = false;
            message = 'name and last name too short';
        }

        if (validateEmail(user.email) && validatePassword(user.password) &&
            ! await duplicateUser(user.name, user.email, user.number, user.businessName)) {
            _continue = true;

        } else {
            message = 'email, password and user'
            _continue = false;
        }

        user.password = await hashPassword(user.password);

        if (_continue) {
            /* const result =*/

            await firestore.collection('users').add(user).then((docRef) => {
                id = docRef.id;
                created = true;
            }).catch((error) => {
                _continue = false;
                console.log(`Error from firestore ${error}`);
            })
        }

        if (_continue) {
            message = 'all is well'
            return res.status(200).json({ sucess: _continue, created: created, id: id });
        }

        if (!_continue) {
            return res.status(501).json({ message: message, success: _continue });
        }

    })


export default handler;



// export default async function handler(req, res) {

//     if (req.method == 'GET') {
//         const cityRef = firestore.collection('categories').doc('types');
//         const doc = await cityRef.get();
//         if (!doc.exists) {
//             console.log('No such document!');
//         } else {
//             const { names } = doc.data();
//             return res.status(200).json(names);
//         }
//     }

//     if (req.method == 'POST') {
//         let id = '';
//         let created = false;
//         let message = '';
//         let _continue = false; // register user or not;
//         const user = req.body;

//         if (user.name.lenght < 3 || user.lastName.lenght < 3) {
//             _continue = false;
//             message = 'name and last name too short';
//         }

//         if (validateEmail(user.email) && validatePassword(user.password) &&
//             ! await duplicateUser(user.name, user.email, user.number, user.businessName)) {
//             _continue = true;

//         } else {
//             message = 'email, password and user'
//             _continue = false;
//         }

//         user.password = await hashPassword(user.password);

//         if (_continue) {
//             /* const result =*/

//             await firestore.collection('users').add(user).then((docRef) => {
//                 id = docRef.id;
//                 created = true;
//             }).catch((error) => {
//                 _continue = false;
//                 console.log(`Error from firestore ${error}`);
//             })
//         }

//         if (_continue) {
//             message = 'all is well'
//             return res.status(200).json({ sucess: _continue, created: created, id: id });
//         }

//         if (!_continue) {
//             return res.status(501).json({ message: message, success: _continue });
//         }
//     }

//     res.status(501).json({ messsage: 'Not allowed' });
// }


// const validateEmail = email => {
//     const regex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
//     return regex.test(email);
// }

// const validatePassword = password => {
//     const regex = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
//     return regex.test(password);
// }

// const duplicateUser = async (name, email, number, businessName) => {

//     const usersRef = firestore.collection('users');
//     const snapShot = await usersRef.where('name', '==', name)
//         .where('email', '==', email)
//         .where('number', '==', number)
//         .where('businessName', '==', businessName).get();

//     // if (snapShot.empty) {
//     //     return false
//     // } else {
//     //     return true;
//     // }

//     return snapShot.empty;
// }

// const hashPassword = async (password) => {
//     return await bcrypt.hash(password, 10);
// }
