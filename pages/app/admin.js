import style from '../../styles/admin.module.css'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Image from 'next/image'
import SideMenu from '../../components/navbar'


export default function Admin() {

    return (
        <>
            <div className={style.container}>
               <SideMenu/>
            </div>
        </>
    )
}