import style from '../styles/sidemenu.module.css'
import Nav from 'react-bootstrap/Nav'
import { AiFillHome } from 'react-icons/ai';


export default function SideMenu() {

    const items = [

    ]

    return (
        <>

            <div className={style.container}>
                <h1>Vensyan</h1>
                <div>
                    <Nav defaultActiveKey="/home" className="flex-column">
                        <div>
                            <AiFillHome />
                            <Nav.Link href="/home" className={style.bg}>Active</Nav.Link>
                        </div>

                        <Nav.Link eventKey="link-1">Link</Nav.Link>
                        <Nav.Link eventKey="link-2">Link</Nav.Link>
                    </Nav>
                </div>
            </div>
        </>
    )
}