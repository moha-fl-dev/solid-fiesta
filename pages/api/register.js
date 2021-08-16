import { firestore } from "../../firebase/init";
import bcrypt from 'bcryptjs';

import nc from 'next-connect';



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



const hashPassword = async (password) => {
    return await bcrypt.hash(password, 10);
}


const duplicateUser = async (name, email, lastName) => {

    const usersRef = firestore.collection('managers');
    const snapshot = await usersRef.where('email', '==', email).get()

    return snapshot.empty
}

const postMiddleWare = async (req, res, next) => {
    let _continue = false;

    console.log(`middleware log --------------------- method is ${req.method}`)

    const { name, lastName, email, password } = req.body;

    if (name.length >= 2 && lastName.length >= 2 && password.length > 7) {
        if (validateEmail(email) && validatePassword(password)) {
            if (await duplicateUser(name, email, lastName)) {
                next()
            } else {
                _continue = false
                console.log('email already exists')
                return res.status(200).json({
                    message: "existence",
                    continue: _continue
                })
            }
        } else {
            return res.status(200).json({
                message: "Regex",
                continue: _continue
            })
        }

    } else {
        return res.status(200).json({
            message: "length requirement not met",
            continue: _continue
        })
    }
}


const getMiddleWare = (req, res, next) => {
    console.log(`middleware log --------------------- method is ${req.method}`)
    next()
}

const handler = nc({ onNoMatch, onError })
    .use((req, res, next) => {
        if (req.method == 'GET') {

            getMiddleWare(req, res, next)
        } else if (req.method == 'POST') {
            postMiddleWare(req, res, next)
        } else {
            return res.status(401).end('not allowed')
        }
    }).post(async (req, res, next) => {
        const _success = false

        const userCredentials = {
            name: req.body.name,
            lastName: req.body.lastName,
            email: req.body.email,
            password: await hashPassword(req.body.password)
        }

        const businessCredentials = {
            name: req.body.businessName,
            industry: req.body.industry,
            adres: req.body.adres,
            zipCode: req.body.zipCode,
            number: req.body.number,
            city: req.body.city,
        }

        // Add a new document with a generated id.
        const result = await firestore.collection('managers').add(userCredentials);
        console.log(`manager id ${result.id}`)

        await firestore.collection('busninesses').doc(result.id).set(businessCredentials)

        return res.status(200).json({
            message: 'sucess',
            sucess: _success,
        })
    })


export default handler;


// .get(async (req, res, next) => {
//     const cityRef = firestore.collection('categories').doc('types');
//     const doc = await cityRef.get();
//     if (!doc.exists) {
//         return res.status(200).json({
//             message: "not found",
//             success: false
//         })
//     } else {
//         const { names } = doc.data();
//         return res.status(200).json(names);
//     }
// })