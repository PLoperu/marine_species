import React from 'react'
import { createMarineSpecie,createTaxonomy,
      getMarineSpecies as getMarineSpeciesList, getTaxonomies as getTaxonomyList, 
      searchMarineSpeciesByTaxonomyKingdomOrPhylum,
      sortMarineSpeciesByTaxonomyKingdomAsc,
      sortMarineSpeciesByTaxonomyKingdomDesc,
      sortMarineSpeciesByTimeOfCreation} from '../utils/marineSpecies';
import { NotificationError, NotificationSuccess } from '../components/utils/Notifications';
import { toast } from 'react-toastify';
import { Row, Button, InputGroup, Form } from 'react-bootstrap';
import Loader from '../components/utils/Loader';
import AddTaxonomy from '../components/marine/AddTaxonomy';
import AddSpecie from '../components/marine/AddSpecie';
import MarineSpecieCard from '../components/marine/MarineSpecieCard';

const Home = () => {

    const [taxonomies, setTaxonomies] = React.useState([]);
    const [marineSpecies, setMarineSpecies] = React.useState([]);
    const [searchTerm, setSearchTerm] = React.useState("");


    console.log("marineSpecies",marineSpecies)
    console.log("taxonomies",taxonomies)

    const [loading, setLoading] = React.useState(false);

   
    const getTaxonomies = async () => {
        try {
            setLoading(true);
            const taxonomies = await getTaxonomyList();
            console.log("taxonomies",taxonomies)
            setTaxonomies(taxonomies);
        } catch (error) {
            toast(<NotificationError text="Failed to fetch Taxonomies." />);
        } finally {
            setLoading(false);
        }
    }

    const search = async (searchTerm) => {
      try {
        setLoading(true);
        let res = await searchMarineSpeciesByTaxonomyKingdomOrPhylum(searchTerm);
        console.log("search",res)
        setMarineSpecies(res);
      } catch (error) {
        console.log({ error });
      } finally {
        setLoading(false);
      }
    };

    const getMarineSpecies = async () => {
        try {
            setLoading(true);
            const marineSpecies = await getMarineSpeciesList();
            console.log("marineSpecies",marineSpecies)
            setMarineSpecies(marineSpecies);
        } catch (error) {
            toast(<NotificationError text="Failed to fetch Marine Species." />);
        } finally {
            setLoading(false);
        }
    }



    const addTaxonomy = async (data) => {
        try {
          setLoading(true);
          createTaxonomy(data).then(()=>{
            getTaxonomies();
        })
          toast(<NotificationSuccess text="Taxonomy added successfully." />);
        } catch (error) {
          console.log({error});
          toast(<NotificationError text="Failed to create a Taxonomy." />);
        } finally {
          setLoading(false)
        }
    }

    const addMarineSpecie = async (data) => {
        try {
          setLoading(true);
          createMarineSpecie(data.taxonId, data.payload).then(()=>{
            getMarineSpecies();
          })
          toast(<NotificationSuccess text="Marine Specie added successfully." />);
        } catch (error) {
          console.log({error});
          toast(<NotificationError text="Failed to create a Marine Specie." />);
        } finally {
          setLoading(false)
        }
    }

    const sortAscending = async () => {
      try {
        setLoading(true);
        let res = await sortMarineSpeciesByTaxonomyKingdomAsc();
        setMarineSpecies(res);
      } catch (error) {
        console.log({ error });
      } finally {
        setLoading(false);
      }
    }

    const sortDescending = async () => {
      try {
        setLoading(true);
        let res = await sortMarineSpeciesByTaxonomyKingdomDesc();
        setMarineSpecies(res);
      } catch (error) {
        console.log({ error });
      } finally {
        setLoading(false);
      }
    }

    const sortByCreationDate = async () => {
      try {
        setLoading(true);
        let res = await sortMarineSpeciesByTimeOfCreation();
        setMarineSpecies(res);
      } catch (error) {
        console.log({ error });
      } finally {
        setLoading(false);
      }
    }



    React.useEffect(() => {
        getTaxonomies();
        getMarineSpecies();
      }, []);
  
    return (
        <>
      {!loading ? (

        <>

            <div className="d-flex justify-content-between align-items-center mb-4">
                <h1 className="fs-4 fw-bold mb-0">Marine Species Records</h1>
                <div className="d-flex align-items-center  gap-3">
                    <AddTaxonomy save={addTaxonomy} />
                    <AddSpecie save={addMarineSpecie} />
                </div>
            </div>
            <div className="d-flex justify-content-end align-items-center mb-4">
            <InputGroup className="mb-3 mx-2 mx-2">
              <Form.Control
                placeholder="Search by Kingdom or Phylum" 
                aria-label="Search"
                aria-describedby="basic-addon2"
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Button variant="dark" id="button-addon2"
                onClick={() => search(searchTerm)}
              >
                Search
              </Button>
            </InputGroup>
          </div>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h1 className="fs-4 fw-bold mb-0">Sort Asc || Dsc</h1>
            <div className="d-flex align-items-center  gap-3">
              <Button variant="dark" onClick={sortAscending} 
               className="rounded-pill px-0"  style={{ width: "38px" }}
              >
                <i className="bi bi-sort-alpha-down-alt"></i>
              </Button>
              <Button variant="dark" onClick={sortDescending} 
               className="rounded-pill px-0"  style={{ width: "38px" }}
              >
                <i className="bi bi-sort-alpha-down"></i>
              </Button>
              <Button variant="dark" onClick={sortByCreationDate} 
               className="rounded-pill px-0"  style={{ width: "38px" }}
              >
                <i className="bi bi-sort-numeric-down"></i>
              </Button>
          </div>
          </div>
            <Row xs={1} sm={2} lg={3} className="g-3  mb-5 g-xl-4 g-xxl-5 mt-4">
                {marineSpecies && marineSpecies.map((marineSect) => (
                    <MarineSpecieCard key={marineSect.id} marineSect={{...marineSect}}  />
                ))}
            </Row>
        </>
        ) : (
            <Loader /> 
         )} 
        </>
    )
}

export default Home