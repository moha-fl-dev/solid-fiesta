import style from "../styles/register.module.css"
import axios from 'axios'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'
import { useForm } from 'react-hook-form';
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react';
import Alert from 'react-bootstrap/Alert'
import Toast from 'react-bootstrap/Toast'

let countReders = 0;


export default function Register({ categories }) {
    const [dataExists, setDataExists] = useState(false)

    const { names } = categories;
    const router = useRouter();

    if (!names.length) {

        return (
            <div><Alert variant='danger'>
                erro occured. please try again later
                {'          '}
                <Link href={{
                    pathname: '/login'
                }}>
                    <a > <Button variant="outline-primary">click here to login</Button></a>
                </Link>

            </Alert>
            </div>
        )
    }

    const { register, watch, handleSubmit, formState: { errors }, } = useForm();

    // how many times does the page render
    console.warn(`Re-render cont: ${countReders++}`);

    const continue_registration = false; // if true, register user

    useEffect(() => {
        console.log('use effect ran');
    }, []);

    const onSubmit = data => {
        axios.post('http://localhost:3000/api/register', {
            name: data.name,
            lastName: data.lastName,
            email: data.email,
            password: data.password,
            businessName: data.businessName,
            industry: data.industry,
            adres: data.adres,
            zipCode: data.zipCode,
            number: data.number,
            city: data.city,
            accept: data.accep,

        }).then(function (response) {
            const res = response.data;

            if (res.created) {
                router.push('/login');
            }

            if (!res._continue) {
                setDataExists(true)

                setTimeout(() => {
                    setDataExists(false)
                }, 5000)
            }
        }).catch(function (error) {
            console.log(`found error in catch callback ${error}`);
        });
    } // ready for submit 

    const onErrors = errors => { } // error encountered

    return (
        <>
            <div className={style.container}>

                <div className={style.form}>
                    <h1>Vensyan</h1>
                    {
                        setDataExists ? <Toast show={dataExists}>
                            <Toast.Header>
                                <strong className="me-auto">Error</strong>
                            </Toast.Header>
                            <Toast.Body>Kies een andere email adres</Toast.Body>
                        </Toast> : null
                    }

                    <br />
                    <div className={style.formControl}>
                        <Form onSubmit={handleSubmit(onSubmit, onErrors)}>
                            <Container>
                                <Row className='g-2'>
                                    <Col md>
                                        <Form.Group className="mb-3" controlId="name">
                                            <Form.Label>Name</Form.Label>
                                            <Form.Control type="text" placeholder="Enter name" {...register('name', {
                                                required: true, pattern: {
                                                    value: /^\S+$/
                                                }
                                            })} />
                                            {errors.name?.type === 'required' && <small className='text-danger'>Naam is verplicht</small>}
                                            {errors.name?.type === 'pattern' && <small className='text-danger'>spaties niet toegestaan</small>}
                                        </Form.Group>

                                    </Col>
                                    <Col md>
                                        <Form.Group className="mb-3" controlId="lastName">
                                            <Form.Label>Last name</Form.Label>
                                            <Form.Control type="text" placeholder="Enter last name" {...register('lastName', {
                                                required: true
                                            })} />
                                            {errors.lastName?.type === 'required' && <small className='text-danger'>achter naam is verplicht</small>}
                                        </Form.Group>
                                    </Col>
                                </Row>
                            </Container>

                            <Container>
                                <Row className='g-2'>
                                    <Col md>
                                        <Form.Group className="mb-3" controlId="email">
                                            <Form.Label>Email address</Form.Label>
                                            <Form.Control type="email" placeholder="Enter email" {...register('email', {
                                                required: true, pattern: {
                                                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                                    message: "invalid email address"
                                                }
                                            })} />
                                            {errors.email?.type === 'required' && <small className='text-danger'>E-mail is verplicht</small>}
                                            {errors.email?.type === 'pattern' && <small className='text-danger'> invalid email address</small>}
                                        </Form.Group>
                                    </Col>
                                    <Col md>
                                        <Form.Group className="mb-3" controlId="password">
                                            <Form.Label>Password</Form.Label>
                                            <Form.Control type="password" placeholder="Password" {...register('password', {
                                                required: true, minLength: 8, pattern: {
                                                    value: /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/,
                                                }
                                            })} />
                                            {errors.password?.type === 'required' && <small className='text-danger'>Wachtwoord is verplicht</small>}
                                            {errors.password?.type === 'minLength' && <small className='text-danger'>Wachtwoord moet minstens acht tekens zijn</small>}
                                            {errors.password?.type === 'pattern' && <small className='text-danger'>8 tekens. 1 hoofd-en 1 klein letter. 1 getal en 1 speciale teken</small>}
                                        </Form.Group>
                                    </Col>
                                </Row>
                            </Container>
                            <Form.Group className="mb-3" controlId="businessName">
                                <Form.Label>Business name</Form.Label>
                                <Form.Control type="text" placeholder="Enter business name" {...register('businessName', { required: true })} />
                                {errors.businessName?.type === 'required' && <small className='text-danger'>bedrijfsnaam is verplich</small>}
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>industry</Form.Label>

                                <Form.Select {...register('industry', { required: true })}>

                                    <option></option>
                                    {
                                        names.map((e) => {
                                            return <option key={e}>{e}</option>
                                        })
                                    }
                                </Form.Select>
                                {errors.industry?.type === 'required' && <small className='text-danger'>Kies industrie</small>}
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="adres">
                                <Container>
                                    <Row className='g-2'>
                                        <Col md>
                                            <Form.Label>Adres</Form.Label>
                                            <Form.Control type="text" placeholder="Enter Street" {...register('adres', {
                                                required: true, pattern: {
                                                    value: /^([^0-9]*)$/
                                                }
                                            })} />
                                            {errors.adres?.type === 'required' && <small className='text-danger'>Straatnaam is verplicht</small>}
                                            {errors.adres?.type === 'pattern' && <small className='text-danger'>Straatnaam is mag geen cijfer bevatten</small>}
                                        </Col>
                                        <Col>
                                            <Form.Label>zip code</Form.Label>
                                            <Form.Control type="text" placeholder="Enter Zip-code" {...register('zipCode', { required: true, minLength: 5 })} />
                                            {errors.zipCode?.type === 'required' && <small className='text-danger'>Postcode is verplict</small>}
                                        </Col>
                                    </Row>
                                </Container>

                                <br />
                                <Container>
                                    <Row className='g-2'>
                                        <Col md>
                                            <Form.Label>House number</Form.Label>
                                            <Form.Control type="number" placeholder="Enter unit number" {...register('number', { required: true, minLength: 1 })} />
                                            {errors.number?.type === 'required' && <small className='text-danger'>Huisnummer is verplicht</small>}
                                            {errors.number?.type === 'minLength' && <small className='text-danger'>Minimaal 1 teken</small>}

                                        </Col>
                                        <Col>
                                            <Form.Label>City</Form.Label>
                                            <Form.Control type="text" placeholder="Enter city" {...register('city', { required: true })} />
                                            {errors.city?.type === 'required' && <small className='text-danger'>stad is verplicht</small>}
                                        </Col>
                                    </Row>
                                </Container>
                            </Form.Group>

                            <br />
                            <Form.Group className="mb-3" controlId="acceptServices">
                                <Form.Check type="checkbox" label="I accept terms and services"{...register('acceptServices', { required: true })} />
                                {errors.acceptServices?.type === 'required' && <small className='text-danger'>Je moet akkoord gaan met de voorwaarden</small>}
                            </Form.Group>
                            <Button variant="primary" type="submit"> Register </Button>
                        </Form>

                    </div>
                    <br />
                    <Link href={{
                        pathname: '/login'
                    }}>
                        <a > <Button variant="outline-primary">Have an account? Login here</Button></a>
                    </Link>
                </div>
            </div>
        </>
    )
}

