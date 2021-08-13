import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import style from '../styles/register.module.css'
import { useForm } from "react-hook-form";
import Link from 'next/link'
import axios from 'axios'
import { useRouter } from 'next/router'

function Login({ user }) {
    const router = useRouter()
    const { register, handleSubmit, watch, formState: { errors } } = useForm();

    const onSubmit = data => {

        const user = {
            email: data.email,
            password: data.password
        }

        const headers = {
            'Content-Type': 'application/json',
            'Authorization': '',
            'custom': 'custom key'
        }
        axios({
            method: 'POST',
            url: 'http://localhost:3000/api/login',
            data: user,
            headers: headers
        }).then((res)=>console.log(res));
    }

    const onErrors = errors => {
        console.warn('input errors: ', errors)
    }

    return (
        <>
            <div className={style.container}>
                <div className={style.form}>
                    <h1>Vensyan</h1>
                    <div className={style.formControl}>
                        <Form onSubmit={handleSubmit(onSubmit, onErrors)} >
                            <Form.Group className="mb-3" controlId="formBasicEmail">
                                <Form.Label>Email address</Form.Label>
                                <Form.Control type="email" placeholder="Enter email" {...register('email', {
                                    required: true, minLength: 3, pattern: {
                                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                        message: "invalid email address"
                                    }
                                })} />
                                {errors.email?.type === 'required' && <small className='text-danger'>E-mail is verplicht</small>}
                                {errors.email?.type === 'pattern' && <small className='text-danger'> invalid email address</small>}
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="formBasicPassword">
                                <Form.Label>Password</Form.Label>
                                <Form.Control type="password" placeholder="Password" {...register('password', {
                                    required: true, minLength: 3, pattern: {
                                        value: /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/,
                                    }
                                })} />
                                {errors.password?.type === 'required' && <small className='text-danger'>Wachtwoord is verplicht</small>}
                                {errors.password?.type === 'minLength' && <small className='text-danger'>Wachtwoord moet minstens acht tekens zijn</small>}
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="formBasicCheckbox">
                                <Form.Check type="checkbox" label="Remember me" {...register('remember')} />
                            </Form.Group>
                            <Button variant="primary" type="submit">
                                Submit
                            </Button>
                        </Form>
                    </div>
                    <br />
                    <hr />
                    <Link href={{
                        pathname: '/'
                    }}>
                        <a > <Button variant="outline-primary">no account yet? make one here</Button></a>
                    </Link>
                </div>
            </div>
        </>
    )
}

Login.getInitialProps = async (context) => {

    // const response = await fetch('http://localhost:3000/api/login');
    // const user = await response.json();

    return {}
}

export default Login;