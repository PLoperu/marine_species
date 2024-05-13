import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Button, Modal, Form, FloatingLabel } from "react-bootstrap";
import { getTaxonomies as getTaxonomiesList } from "../../utils/marineSpecies";

const AddSpecie = ({save}) => {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [taxonomies, setTaxonomies] = useState([]);
    const [taxonId, setTaxonId] = useState("");

    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const getTaxonomies = async () => {
        try {
            const taxonomies = await getTaxonomiesList();
            setTaxonomies(taxonomies);
        } catch (error) {
            console.log({ error });
        }
    }

    const payload = {
        name,
        description,
    }
    console.log("payload",payload)

    const placeTaxonId = (taxonIdP) => {
        setTaxonId(taxonIdP);
    }

    useEffect(() => {
        getTaxonomies();
    }, []);
  return (
    <>
        <Button variant="primary" onClick={handleShow}>
            Add Specie
        </Button>
    
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
            <Modal.Title>Add Specie</Modal.Title>
            </Modal.Header>
            <Modal.Body>
            <Form>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label>Specie Name</Form.Label>
                <Form.Control type="text" placeholder="Enter Specie Name" value={name} onChange={(e) => setName(e.target.value)} />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicPassword">
                <Form.Label>Specie Description</Form.Label>
                <Form.Control type="text" placeholder="Enter Specie Description" value={description} onChange={(e) => setDescription(e.target.value)} />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicPassword">
                <Form.Label>Specie Taxonomy</Form.Label>
                <Form.Control as="select" defaultValue={taxonId} onChange={(e) => placeTaxonId(e.target.value)}>
                    <option>Select Taxonomy</option>
                    {taxonomies.map((taxon) => (
                    <option key={taxon.id} value={taxon.id}>Family: {taxon.family} :: Kingdom: {taxon.kingdom}</option>
                    ))}
                </Form.Control>
                </Form.Group>
            </Form>
            </Modal.Body>
            <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
                Close
            </Button>
            <Button variant="primary" onClick= {() =>{ 
                save({taxonId,payload})
                handleClose()
                }}> 
                Save Changes
            </Button>
            </Modal.Footer>
        </Modal>    
    </>
  )
}

export default AddSpecie