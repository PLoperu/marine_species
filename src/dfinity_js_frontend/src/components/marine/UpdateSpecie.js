import React, { useEffect, useState } from 'react'
import { Button, Modal, Form, FloatingLabel } from "react-bootstrap";
import { toast } from 'react-toastify';

import { NotificationError, NotificationSuccess } from '../utils/Notifications';
import { getMarineSpecie, updateMarineSpecie } from '../../utils/marineSpecies';

const UpdateSpecie = ({marineSpecieId}) => {

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");

    const isFormValid = name && description;

    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    useEffect(() => {
        const fetchSpecie = async () => {
            try {
                const specie = await getMarineSpecie(marineSpecieId);
                setName(specie.name);
                setDescription(specie.description);
            }
            catch (error) {
                console.error(error);
            }
        }
        fetchSpecie();
    } , [marineSpecieId]);

    const updateSpecie = async () => {
        try {
            await updateMarineSpecie( marineSpecieId,{name, description});
            toast(<NotificationSuccess text="Specie updated successfully." />);
        } catch (error) {
            console.log({ error });
            toast(<NotificationError text="Failed to update a Specie." />);
        }
    }
    return (
        <>
        <Button variant="primary" onClick={handleShow}>
            Update Specie
        </Button>

        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
            <Modal.Title>Update Specie</Modal.Title>
            </Modal.Header>
            <Modal.Body>
            <Form>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label>Specie Name</Form.Label>
                <Form.Control type="text" placeholder="Enter Specie Name" defaultValue={name} onChange={(e) => setName(e.target.value)} />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicPassword">
                <Form.Label>Specie Description</Form.Label>
                <Form.Control type="text" placeholder="Enter Specie Description" defaultValue={description} onChange={(e) => setDescription(e.target.value)} />
                </Form.Group>
            </Form>
            </Modal.Body>
            <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
                Close
            </Button>
            <Button variant="primary" onClick={()=> 
                {
                    updateSpecie();
                    handleClose();
                
                }
            } disabled={!isFormValid}>
                Update Specie
            </Button>
            </Modal.Footer>
        </Modal>
        </>
    )
}

export default UpdateSpecie