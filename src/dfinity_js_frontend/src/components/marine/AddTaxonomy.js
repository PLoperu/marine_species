import React, { useState } from "react";
import PropTypes from "prop-types";
import { Button, Modal, Form, FloatingLabel } from "react-bootstrap";

const AddTaxonomy = ({save}) => {

    const [kingdom, setKingdom] = useState("");
    const [phylum, setPhylum] = useState("");
    const [taxon_class, setTaxon_class] = useState("");
    const [order, setOrder] = useState("");
    const [family, setFamily] = useState("");
    const [genus, setGenus] = useState("");
    const [species, setSpecies] = useState("");



    const [show, setShow] = useState(false);
    
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
  return (
    <>
        <Button
            onClick={handleShow}
            variant="dark"
        >
            Add Taxonomy
        </Button>
        <Modal show={show} onHide={handleClose} centered>
            <Modal.Header closeButton>
            <Modal.Title>New Taxonomy</Modal.Title>
            </Modal.Header>
            <Form>
            <Modal.Body>
                <FloatingLabel
                controlId="inputKingdom"
                label="Kingdom"
                className="mb-3"
                >
                <Form.Control
                    type="text"
                    onChange={(e) => {
                    setKingdom(e.target.value);
                    }}
                    placeholder="Enter kingdom"
                />
                </FloatingLabel>
                <FloatingLabel
                controlId="inputPhylum"
                label="Phylum"
                className="mb-3"
                >
                <Form.Control
                    type="text"
                    placeholder="Enter phylum"
                    onChange={(e) => {
                    setPhylum(e.target.value);
                    }}
                />
                </FloatingLabel>
                <FloatingLabel
                controlId="inputClass"
                label="Class"
                className="mb-3"
                >
                <Form.Control
                    type="text"
                    placeholder="Enter class"
                    onChange={(e) => {
                    setTaxon_class(e.target.value);
                    }}
                />
                </FloatingLabel>
                <FloatingLabel
                controlId="inputOrder"
                label="Order"
                className="mb-3"
                >
                <Form.Control
                    type="text"
                    placeholder="Enter order"
                    onChange={(e) => {
                    setOrder(e.target.value);
                    }}
                />
                </FloatingLabel>
                <FloatingLabel
                controlId="inputFamily"
                label="Family"
                className="mb-3"
                >
                <Form.Control
                    type="text"
                    placeholder="Enter family"
                    onChange={(e) => {
                    setFamily(e.target.value);
                    }}
                />
                </FloatingLabel>
                <FloatingLabel
                controlId="inputGenus"
                label="Genus"
                className="mb-3"
                >
                <Form.Control
                    type="text"
                    placeholder="Enter genus"
                    onChange={(e) => {
                    setGenus(e.target.value);
                    }}
                />
                </FloatingLabel>
                <FloatingLabel
                controlId="inputSpecies"
                label="Species"
                className="mb-3"
                >
                <Form.Control
                    type="text"
                    placeholder="Enter species"
                    onChange={(e) => {
                    setSpecies(e.target.value);
                    }
                    }
                />  
                </FloatingLabel>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                Close
                </Button>
                <Button
                variant="dark"
                onClick={() => {
                    save({
                        kingdom: kingdom,
                        phylum: phylum,
                        taxon_class: taxon_class,
                        order: order,
                        family: family,
                        genus: genus,
                        species: species,
                    });
                    handleClose();
                    
                }}
                disabled={!kingdom || !phylum || !taxon_class || !order || !family || !genus || !species}
                >
                Save
                </Button>
            </Modal.Footer>
            </Form>
        </Modal>
    </>
  )
}

export default AddTaxonomy