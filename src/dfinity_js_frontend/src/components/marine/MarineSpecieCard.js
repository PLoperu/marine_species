import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Card, Button, Col, Badge, Stack } from "react-bootstrap";
import UpdateSpecie from "./UpdateSpecie";
import DeleteSpecie from "./DeleteSpecie";

const MarineSpecieCard = ({marineSect}) => {
    const {id, name, description, taxonomy,created_at,updated_at} = marineSect;
    const {kingdom,phylum,taxon_class,order,family,genus,species} = taxonomy;
    console.log("first",marineSect.taxonomy)


  return (
    <Col md={4} className="mb-4">
        <Card>
            <Card.Body>
                <Card.Title>{name}</Card.Title>
                <Card.Text>
                    {description}
                </Card.Text>
                <Stack direction="horizontal" gap={3} style={{marginTop:"6px"}}>
                    <Badge bg="secondary">Kingdom: {kingdom}</Badge>
                    <Badge bg="secondary">Phylum: {phylum}</Badge>
                    <Badge bg="secondary">Class: {taxon_class}</Badge>
                </Stack>
                <Stack direction="horizontal" gap={3} style={{marginTop:"6px"}}>
                    <Badge bg="secondary">Order: {order}</Badge>
                    <Badge bg="secondary">Family: {family}</Badge>
                    <Badge bg="secondary">Genus: {genus}</Badge>
                </Stack>
                <Badge bg="secondary">Species: {species}</Badge>
                <Stack direction="vertical" gap={3} style={{marginTop:"6px"}}>
                    {/* <Badge bg="info">Taxonomy: {taxonomy}</Badge> */}
                    <Badge bg="primary">Created At: {created_at}</Badge>
                    <Badge bg="success">Updated At: {updated_at}</Badge>
                </Stack>
            </Card.Body>
            <Card.Footer style={{
                display:"flex",
                justifyContent:"space-between"
            }}>
                <UpdateSpecie marineSpecieId={id} />
                <DeleteSpecie specieId={id} />
            </Card.Footer>
        </Card>
    </Col>
  )
}

export default MarineSpecieCard