import nc from 'next-connect';
import bcrypt from 'bcryptjs'
import { firestore } from "../../firebase/init";

const validateEmail = email => {
    const regex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    return regex.test(email);
}

const validatePassword = password => {
    const regex = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
    return regex.test(password);
}

const comparePasswords = (password, hash) => {
    return bcrypt.compareSync(password, hash);
}

const postMiddleWare = (req, res, next) => {

    const values = req.body;

    if (values.hasOwnProperty("email") && values.hasOwnProperty("password")) {
        const { email, password } = req.body;

        if (email.length > 3 && password.length >= 8) {
            if (validateEmail(email) && validatePassword(password)) {
                next()
            } else {
                return res.status(400).json({
                    message: 'unmet requirements'
                })
            }
        } else {
            return res.status(400).json({
                message: 'data invalid'
            })
        }
    } else {
        return res.status(400).json({
            message: 'data incomplete'
        })
    }
}

const onError = (req, res) => {
    return res.redirect('../', 404);
}

const onNoMatch = (req, res) => {
    return res.status(404).end('Cant find what you want');
}

const getMiddleWare = (req, res, next) => {
    next()
}


const handler = nc({ onError, onNoMatch })
    .use((req, res, next) => {
        if (req.method == 'POST') {
            console.log(`method is -------------------- ${req.method}`)
            postMiddleWare(req, res, next)
        }

        if (req.method == 'GET') {
            console.log(`method is -------------------- ${req.method}`)
            getMiddleWare(req, res, next)
        }
    }).get((req, res) => {
        return res.status(200).json({
            message: 'sucessfull get',
            headers: req.headers
        })
    }).post(async (req, res) => {

        const { email, password } = req.body
        let dbPassword = '';
        const usersRef = firestore.collection('managers');
        const snapshot = await usersRef.where('email', '==', email).get();

        snapshot.forEach(doc => {

            const { password } = doc.data()

            dbPassword = password;
        });

        const compare = comparePasswords(password, dbPassword)

        if (snapshot.empty || !compare) {
            return res.status(200).json({
                message: 'username or password is incorrect',
            })
        }

        return res.status(200).json({
            message: 'sucessfull post. passed from middleware',
        })
    })



export default handler;