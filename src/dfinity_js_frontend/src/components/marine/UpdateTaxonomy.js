import React, { useEffect, useState } from 'react'
import { Button, Modal, Form, FloatingLabel } from "react-bootstrap";
import { toast } from 'react-toastify';
import { getTaxonomy, updateTaxonomy } from '../../utils/marineSpecies';
import { NotificationError, NotificationSuccess } from '../utils/Notifications';

const UpdateTaxonomy = ({TaxonId}) => {
    const [kingdom, setKingdom] = useState("");
    const [phylum, setPhylum] = useState("");
    const [taxon_class, setTaxon_class] = useState("");
    const [order, setOrder] = useState("");
    const [family, setFamily] = useState("");
    const [genus, setGenus] = useState("");
    const [species, setSpecies] = useState("");

    const isFormValid = kingdom && phylum && taxon_class && order && family && genus && species;

    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    useEffect(() => {
        const fetchTaxon = async () => {
            try {
                const taxon = await getTaxonomy(TaxonId);
                setKingdom(taxon.kingdom);
                setPhylum(taxon.phylum);
                setTaxon_class(taxon.taxon_class);
                setOrder(taxon.order);
                setFamily(taxon.family);
                setGenus(taxon.genus);
                setSpecies(taxon.species);
            }
            catch (error) {
                console.error(error);
            }
        }
        fetchTaxon();
    } , [TaxonId]);

    const Update = async () => {
        try {
            await updateTaxonomy( TaxonId,{kingdom, phylum, taxon_class, order, family, genus, species });
            toast(<NotificationSuccess text="Taxon updated successfully." />);
        } catch (error) {
            console.log({ error });
            toast(<NotificationError text="Failed to update a Taxon." />);
        }
    }
  return (
    <>
    <Button variant="primary"
        className="rounded-pill px-0"
        style={{ width: "38px", marginRight: "2px"}}
        onClick={handleShow}>
        <i className="bi bi-pencil"></i>
    </Button>
    <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
        <Modal.Title>Update Taxon</Modal.Title>
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
                value={kingdom}
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
                value={phylum}
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
                value={taxon_class}
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
                value={order}
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
                value={family}
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
                value={genus}
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
                }}
                value={species}
            />
            </FloatingLabel>
        </Modal.Body>
        <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
            Close
            </Button>
            <Button variant="primary" onClick={() => {
            Update();
            handleClose();
            }} disabled={!isFormValid}>
            Update
            </Button>
        </Modal.Footer>
        </Form>
    </Modal>
    </>
  )
}

export default UpdateTaxonomy