import React from 'react'
import {toast} from 'react-toastify'
import {Button} from 'react-bootstrap'
import { NotificationError, NotificationSuccess } from '../utils/Notifications';
import { deleteMarineSpecie } from '../../utils/marineSpecies';

const DeleteSpecie = ({specieId}) => {

    const discardSpecie = async () => {
        try {
            deleteMarineSpecie(specieId).then(() => {
                toast(<NotificationSuccess text="Specie deleted successfully." />);
                window.location.reload();
            }).catch((error) => {
                toast(<NotificationError text="Failed to delete a Specie." />);
            })
        } catch (error) {
            console.log({error});
            toast.error("Failed to delete Specie");
        }

    }
  return (
    <Button variant="danger"
    className="rounded-pill px-0"
    style={{ width: "38px" }}
    onClick={() => {
        discardSpecie();
    }}> <i  className="bi bi-trash"></i>
    </Button>
  )
}

export default DeleteSpecie