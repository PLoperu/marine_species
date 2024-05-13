import React from 'react'
import {toast} from 'react-toastify'
import {Button} from 'react-bootstrap'
import { NotificationError, NotificationSuccess } from '../utils/Notifications';
import { deleteTaxonomy } from '../../utils/marineSpecies';


const DeleteTaxonomy = ({TaxonId}) => {
    const discardTaxonomy = async () => {
        try {
            deleteTaxonomy(TaxonId).then(() => {
                toast(<NotificationSuccess text="Taxonomy deleted successfully." />);
                window.location.reload();
            }).catch((error) => {
                toast(<NotificationError text="Failed to delete a Taxonomy." />);
            })
        } catch (error) {
            console.log({error});
            toast.error("Failed to delete Taxonomy");
        }

    }
  return (
    <Button variant="danger"
    className="rounded-pill px-0"
    style={{ width: "38px", marginRight: "2px"}}
    onClick={() => {
        discardTaxonomy();
    }}> <i  className="bi bi-trash"></i>
    </Button>
  )
}

export default DeleteTaxonomy