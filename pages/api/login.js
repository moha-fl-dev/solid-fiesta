import nc from 'next-connect';

const middelWare = (req, res, next) => {
    next();
}

const onError = (req, res) => {
    return res.redirect('../', 404);
}

const onNoMatch = (req, res) => {
    return res.status(404).end('Cant find what you want');
    // return res.redirect('../', 404);
}


const handler = nc({ onError, onNoMatch })
    .use((req, res, next) => {
        middelWare(req, res, next);
    })
    .post(async (req, res, next) => {
        return res.status(200).json({headers: req.headers.Authorization});
    })


export default handler;