import React from 'react'
import { Button, Col, Container, Modal, Row } from 'react-bootstrap'
import { FaCheck, FaPlus, FaStar } from 'react-icons/fa'
import { FaRegTrashCan } from 'react-icons/fa6'
import { Link } from 'react-router-dom';

function BuyMembership() {
    return (
        <Container fluid className=' vh-83'>

            <Row className='d-flex justify-content-around mt-5 ms-2'>
                <Col md={5} className='mx-2 p-0 background-color-secondary'>
                    <Container fluid className='mt-2'>
                        <Row className='border-bottom border-black pb-3'>
                            <h3 className='m-0 text-center'>Basic</h3>
                            <h4 className='m-0 text-center'>(Free)</h4>
                        </Row>

                        <Row className='m-3 py-5'>

                            <p className='py-2'> <FaCheck /> Limit 3 columns </p>
                            <p className='py-2'> <FaCheck /> Limit 5 members </p>
                            <p className='py-2'> <FaCheck /> Limit special functions</p>

                        </Row>

                        <Row>
                            <Button className='rounded-0 bg-secondary disabled py-3 fw-bolder'>Free</Button>
                        </Row>
                    </Container>

                </Col>
                <Col md={5} className='mx-2 p-0 background-color-secondary'>
                    <Container fluid className='mt-2'>
                        <Row className='border-bottom border-black pb-3'>
                            <h3 className='m-0 text-center'>Premium</h3>
                            <h4 className='m-0 text-center'>(2000$)</h4>
                        </Row>

                        <Row className='m-3 py-5'>

                            <p className='py-2 text-success'> <FaCheck /> Unlimit columns </p>
                            <p className='py-2 text-success'> <FaCheck /> Unlimit members </p>
                            <p className='py-2 text-success'> <FaCheck /> Unrestrict special functions</p>

                        </Row>

                        <Row>
                            <Button className='rounded-0 btn-membership border-0 py-3 fw-bolder'>
                                <Link to="checkOut" className="text-decoration-none">Upgrade</Link>
                            </Button>
                        </Row>
                    </Container>

                </Col>


            </Row>
        </Container>
    )
}

export default BuyMembership
