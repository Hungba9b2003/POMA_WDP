import React from 'react'
import { Button, Col, Container, Modal, Row } from 'react-bootstrap'
import { FaCheck, FaPlus, FaStar } from 'react-icons/fa'
import { FaRegTrashCan } from 'react-icons/fa6'
import { Link } from 'react-router-dom';

function BuyMembership() {
    return (
        <Container fluid className='vh-83 py-5 bg-light'>
            <Row className='d-flex justify-content-center align-items-center h-100'>
                <Col md={4} className='mx-4'>
                    <div className='card shadow-sm h-100'>
                        <div className='card-header bg-white border-0 pt-4'>
                            <h3 className='text-center mb-1'>Basic</h3>
                            <h4 className='text-center text-muted mb-0'>Free</h4>
                        </div>
                        <div className='card-body d-flex flex-column'>
                            <div className='py-4'>
                                <p className='mb-3 d-flex align-items-center'>
                                    <FaCheck className='text-secondary me-2' />
                                    <span>Limit 5 columns</span>
                                </p>
                                <p className='mb-3 d-flex align-items-center'>
                                    <FaCheck className='text-secondary me-2' />
                                    <span>Limit 5 members</span>
                                </p>
                                <p className='mb-3 d-flex align-items-center'>
                                    <FaCheck className='text-secondary me-2' />
                                    <span>Limit special functions</span>
                                </p>
                            </div>
                            <hr className='border-black  my-4' />
                            <Button variant="secondary" className='mt-auto py-3 fw-bold' disabled>
                                Current Plan
                            </Button>
                        </div>
                    </div>
                </Col>

                <Col md={4} className='mx-4'>
                    <div className='card shadow h-100 border-primary' style={{ backgroundColor: '#2C3140' }}>
                        <div className='card-header border-0 pt-4 position-relative' style={{ backgroundColor: '#2C3140' }}>
                            <span className='position-absolute top-0 end-0 m-2'>
                                <FaStar className='text-warning' />
                            </span>
                            <h3 className='text-center mb-1 text-white'>Premium</h3>
                            <h4 className='text-center text-white mb-0'>$199</h4>
                        </div>
                        <div className='card-body d-flex flex-column'>
                            <div className='py-4'>
                                <p className='mb-3 d-flex align-items-center text-white'>
                                    <FaCheck className='text-white me-2' />
                                    <span>Unlimited columns</span>
                                </p>
                                <p className='mb-3 d-flex align-items-center text-white'>
                                    <FaCheck className='text-white me-2' />
                                    <span>Unlimited members</span>
                                </p>
                                <p className='mb-3 d-flex align-items-center text-white'>
                                    <FaCheck className='text-white me-2' />
                                    <span>All special functions</span>
                                </p>
                            </div>
                            <hr className='border-white my-4' />
                            <Link
                                to="checkOut"
                                className="btn btn-light mt-auto py-3 fw-bold text-decoration-none text-primary"
                            >
                                Upgrade Now
                            </Link>
                        </div>
                    </div>
                </Col>
            </Row>
        </Container>
    )
}

export default BuyMembership
