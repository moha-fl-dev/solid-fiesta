// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import next from 'next';
import nc from 'next-connect';

// export default function handler(req, res) {
//   res.status(200).json({ name: 'John Doe' })
// }

const getMiddleWare = (req, res, next) => {
  next()
}

const postMiddleWare = (req, res, next) => {
  next(); // pass the request to the method;
}

const onNoMatch = (req, res) => {
  return res.status(404).end('not found!')
}

const onError = (err, req, res, next) => {
  console.log(`error from on error ${err}`);
  return res.status(404).end(`found error ${err}`);
  // use next() to continue
}


const handler = nc({ onNoMatch, onError })
  .use((req, res, next) => {
    getMiddleWare(req, res, next);
  })
  .get((req, res, next) => {
    res.status(200).json({
      message: 'hello world'
    })
  }).use((req, res, next) => {
    postMiddleWare(req, res, next);
  }).post((req, res, next) => {
    return res.status(200).json({
      message: "from the post reques",
    })
  })




export default handler;