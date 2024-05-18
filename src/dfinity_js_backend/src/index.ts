import { query, update, text, Record, StableBTreeMap, Variant, Vec, None, Some, Ok, Err, ic, Principal, Opt, nat64, Duration, Result, bool, Canister } from "azle";
import {
    Ledger, binaryAddressFromAddress, binaryAddressFromPrincipal, hexAddressFromPrincipal
} from "azle/canisters/ledger";
import { hashCode } from "hashcode";
import { v4 as uuidv4 } from "uuid";

const Taxonomy = Record({
    id: text,
    admin: Principal,
    kingdom: text,
    phylum: text,
    taxon_class: text,
    order: text,
    family: text,
    genus: text,
    species: text,
    created_at: text,
    updated_at: text,
});

const MarineSpecie = Record({
    id: text,
    admin: Principal,
    taxonomy: Taxonomy,
    name: text,
    description: text,
    created_at: text,
    updated_at: text,
});


const TaxonomyPayload = Record({
    kingdom: text,
    phylum: text,
    taxon_class: text,
    order: text,
    family: text,
    genus: text,
    species: text,
});

const MarineSpeciePayload = Record({
    name: text,
    description: text,
});

const Message = Variant({
    NotFound: text,
    InvalidPayload: text,
    PaymentFailed: text,
    PaymentCompleted: text,
    NotAdmin: text
});


const taxonomyStorage = StableBTreeMap(0, text, Taxonomy);
const marineSpecieStorage = StableBTreeMap(1, text, MarineSpecie);

// const icpCanister = Ledger(Principal.fromText("ryjl3-tyaaa-aaaaa-aaaba-cai"));


export default Canister({
    getTaxonomies: query([], Vec(Taxonomy), () => {
        return taxonomyStorage.values();
    }),

    getTaxonomy: query([text], Result(Taxonomy, Message), (id) => {
        if(!isValidUuid(id)){
            return Err({InvalidPayload: `Id=${id} is not in the valid uuid format.`})
        }
        const taxonomyOpt = taxonomyStorage.get(id);
        if ("None" in taxonomyOpt) {
            return Err({ NotFound: `taxonomy with id=${id} not found` });
        }
        return Ok(taxonomyOpt.Some);
    }),

    addTaxonomy: update([TaxonomyPayload], Result(Taxonomy, Message), (payload) => {
        if (typeof payload !== "object" || Object.keys(payload).length === 0) {
            return Err({ InvalidPayload: "invalid payoad" })
        }
        // @ts-ignore
        const validatePayloadErrors = validateTaxonomyPayload(payload);
        if (validatePayloadErrors.length){
            return Err({InvalidPayload: `Invalid payload. Errors=[${validatePayloadErrors}]`});
        }
        const taxonomy = { id: uuidv4(), admin: ic.caller(), ...payload, created_at: new Date().toISOString(), updated_at: new Date().toISOString() };
        taxonomyStorage.insert(taxonomy.id, taxonomy);
        return Ok(taxonomy);
    }),

    // Update using taxonomy id and TaxonomyPayload of the taxonomy
    updateTaxonomy: update([text, TaxonomyPayload], Result(Taxonomy, Message), (id, payload) => {
        if(!isValidUuid(id)){
            return Err({InvalidPayload: `Id=${id} is not in the valid uuid format.`})
        }
        // @ts-ignore
        const validatePayloadErrors = validateTaxonomyPayload(payload);
        if (validatePayloadErrors.length){
            return Err({InvalidPayload: `Invalid payload. Errors=[${validatePayloadErrors}]`});
        }
        const taxonomyOpt = taxonomyStorage.get(id);
        if ("None" in taxonomyOpt) {
            return Err({ NotFound: `cannot update the taxonomy: taxonomy with id=${id} not found` });
        }
        if(ic.caller().toString() !== taxonomyOpt.Some.admin.toString()){
            return Err({NotAdmin: "Authentication failed. Caller isn't the admin of the taxonomy."})
        }
        taxonomyStorage.insert(taxonomyOpt.Some.id, { ...taxonomyOpt.Some, ...payload, updated_at: new Date().toISOString() });
        return Ok(taxonomyOpt.Some);
    }),

    deleteTaxonomy: update([text], Result(Taxonomy, Message), (id) => {
        if(!isValidUuid(id)){
            return Err({InvalidPayload: `Id=${id} is not in the valid uuid format.`})
        }
        const deletedTaxonomyOpt = taxonomyStorage.get(id);
        if ("None" in deletedTaxonomyOpt) {
            return Err({ NotFound: `cannot delete the taxonomy: taxonomy with id=${id} not found` });
        }
        
        if(ic.caller().toString() !== deletedTaxonomyOpt.Some.admin.toString()){
            return Err({NotAdmin: "Authentication failed. Caller isn't the admin of the taxonomy."})
        }
        taxonomyStorage.remove(id);
        return Ok(deletedTaxonomyOpt.Some);
    }),

    getMarineSpecies: query([], Vec(MarineSpecie), () => {
        return marineSpecieStorage.values();
    }),

    getMarineSpecie: query([text], Result(MarineSpecie, Message), (id) => {
        if(!isValidUuid(id)){
            return Err({InvalidPayload: `Id=${id} is not in the valid uuid format.`})
        }
        const marineSpecieOpt = marineSpecieStorage.get(id);
        if ("None" in marineSpecieOpt) {
            return Err({ NotFound: `marine specie with id=${id} not found` });
        }
        return Ok(marineSpecieOpt.Some);
    }),

    addMarineSpecie: update([text, MarineSpeciePayload], Result(MarineSpecie, Message), (taxonomyId, payload) => {
        if(!isValidUuid(taxonomyId)){
            return Err({InvalidPayload: `taxonomyId=${taxonomyId} is not in the valid uuid format.`})
        }
        if (typeof payload !== "object" || Object.keys(payload).length === 0) {
            return Err({ InvalidPayload: "invalid payoad" })
        }
        // @ts-ignore
        const validatePayloadErrors = validateMarineSpeciePayload(payload);
        if (validatePayloadErrors.length){
            return Err({InvalidPayload: `Invalid payload. Errors=[${validatePayloadErrors}]`});
        }
        const taxonomyOpt = taxonomyStorage.get(taxonomyId);
        if ("None" in taxonomyOpt) {
            return Err({ NotFound: `cannot add marine specie: taxonomy with id=${taxonomyId} not found` });
        }
        const marineSpecie = { id: uuidv4(), admin: ic.caller(),taxonomy: taxonomyOpt.Some, ...payload, created_at: new Date().toISOString(), updated_at: new Date().toISOString() };
        marineSpecieStorage.insert(marineSpecie.id, marineSpecie);
        return Ok(marineSpecie);
    }
    ),
    // Update using specie id and MarineSpeciepayload of the specie
    updateMarineSpecie: update([text, MarineSpeciePayload], Result(MarineSpecie, Message), (id, payload) => {
        if(!isValidUuid(id)){
            return Err({InvalidPayload: `id=${id} is not in the valid uuid format.`})
        }
        // @ts-ignore
        const validatePayloadErrors = validateMarineSpeciePayload(payload);
        if (validatePayloadErrors.length){
            return Err({InvalidPayload: `Invalid payload. Errors=[${validatePayloadErrors}]`});
        }
        const marineSpecieOpt = marineSpecieStorage.get(id);
        if ("None" in marineSpecieOpt) {
            return Err({ NotFound: `cannot update the marine specie: marine specie with id=${id} not found` });
        }
        
        if(ic.caller().toString() !== marineSpecieOpt.Some.admin.toString()){
            return Err({NotAdmin: "Authentication failed. Caller isn't the admin of the marine specie."})
        }
        marineSpecieStorage.insert(marineSpecieOpt.Some.id, { ...marineSpecieOpt.Some, ...payload, updated_at: new Date().toISOString() });
        return Ok(marineSpecieOpt.Some);
    }),
    

    deleteMarineSpecie: update([text], Result(MarineSpecie, Message), (id) => {
        if(!isValidUuid(id)){
            return Err({InvalidPayload: `id=${id} is not in the valid uuid format.`})
        }
        const deletedMarineSpecieOpt = marineSpecieStorage.get(id);
        if ("None" in deletedMarineSpecieOpt) {
            return Err({ NotFound: `cannot delete the marine specie: marine specie with id=${id} not found` });
        }
        if(ic.caller().toString() !== deletedMarineSpecieOpt.Some.admin.toString()){
            return Err({NotAdmin: "Authentication failed. Caller isn't the admin of the marine specie."})
        }
        marineSpecieStorage.remove(id);
        return Ok(deletedMarineSpecieOpt.Some);
    }),

    removeTaxonomyFromMarineSpecie: update([text, text], Result(MarineSpecie, Message), (marineSpecieId, taxonomyId) => {
        if(!isValidUuid(marineSpecieId)){
            return Err({InvalidPayload: `marineSpecieId=${marineSpecieId} is not in the valid uuid format.`})
        }
        if(!isValidUuid(taxonomyId)){
            return Err({InvalidPayload: `taxonomyId=${taxonomyId} is not in the valid uuid format.`})
        }
        const marineSpecieOpt = marineSpecieStorage.get(marineSpecieId);
        if ("None" in marineSpecieOpt) {
            return Err({ NotFound: `cannot remove taxonomy from marine specie: marine specie with id=${marineSpecieId} not found` });
        }
        if(ic.caller().toString() !== marineSpecieOpt.Some.admin.toString()){
            return Err({NotAdmin: "Authentication failed. Caller isn't the admin of the marine specie."})
        }

        const taxonomyOpt = taxonomyStorage.get(taxonomyId);
        if ("None" in taxonomyOpt) {
            return Err({ NotFound: `cannot remove taxonomy from marine specie: taxonomy with id=${taxonomyId} not found` });
        }

        marineSpecieOpt.Some.taxonomy = taxonomyOpt.Some;
        marineSpecieStorage.insert(marineSpecieId, marineSpecieOpt.Some);
        return Ok(marineSpecieOpt.Some);
    } ),

    addTaxonomyToMarineSpecie: update([text, text], Result(MarineSpecie, Message), (marineSpecieId, taxonomyId) => {
        if(!isValidUuid(marineSpecieId)){
            return Err({InvalidPayload: `marineSpecieId=${marineSpecieId} is not in the valid uuid format.`})
        }
        if(!isValidUuid(taxonomyId)){
            return Err({InvalidPayload: `taxonomyId=${taxonomyId} is not in the valid uuid format.`})
        }
        const marineSpecieOpt = marineSpecieStorage.get(marineSpecieId);
        if ("None" in marineSpecieOpt) {
            return Err({ NotFound: `cannot add taxonomy to marine specie: marine specie with id=${marineSpecieId} not found` });
        }
        if(ic.caller().toString() !== marineSpecieOpt.Some.admin.toString()){
            return Err({NotAdmin: "Authentication failed. Caller isn't the admin of the marine specie."})
        }

        const taxonomyOpt = taxonomyStorage.get(taxonomyId);
        if ("None" in taxonomyOpt) {
            return Err({ NotFound: `cannot add taxonomy to marine specie: taxonomy with id=${taxonomyId} not found` });
        }

        marineSpecieOpt.Some.taxonomy = taxonomyOpt.Some;
        marineSpecieStorage.insert(marineSpecieId, marineSpecieOpt.Some);
        return Ok(marineSpecieOpt.Some);
    }),

    // Sort Marine Species by Taxonomy Kingdom Ascending
    sortMarineSpeciesByTaxonomyKingdom: query([], Vec(MarineSpecie), () => {
        const marineSpecies = marineSpecieStorage.values();
        return marineSpecies.sort((a, b) => a.taxonomy.kingdom.localeCompare(b.taxonomy.kingdom));
    }),

    // Sort Marine Species by Taxonomy Kingdom Descending
    sortMarineSpeciesByTaxonomyKingdomDesc: query([], Vec(MarineSpecie), () => {
        const marineSpecies = marineSpecieStorage.values();
        return marineSpecies.sort((a, b) => b.taxonomy.kingdom.localeCompare(a.taxonomy.kingdom));
    }),

    // Search Marine Species by Taxonomy Kingdom or Phylum
    searchMarineSpeciesByTaxonomyKingdomOrPhylum: query([text], Vec(MarineSpecie), (searchText) => {
        const marineSpecies = marineSpecieStorage.values();
        return marineSpecies.filter((marineSpecie) => marineSpecie.taxonomy.kingdom.toLowerCase() === searchText.toLowerCase() || marineSpecie.taxonomy.phylum.toLowerCase() === searchText.toLowerCase());
    }),

    // Arrange Marine Species by Time of Creation Ascending
    sortMarineSpeciesByTimeOfCreation: query([], Vec(MarineSpecie), () => {
        const marineSpecies = marineSpecieStorage.values();
        return marineSpecies.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
    }),



});



/*
    a hash function that is used to generate correlation ids for orders.
    also, we use that in the verifyPayment function where we check if the used has actually paid the order
*/
function hash(input: any): nat64 {
    return BigInt(Math.abs(hashCode().value(input)));
};

// a workaround to make uuid package work with Azle
globalThis.crypto = {
    // @ts-ignore
    getRandomValues: () => {
        let array = new Uint8Array(32);

        for (let i = 0; i < array.length; i++) {
            array[i] = Math.floor(Math.random() * 256);
        }

        return array;
    }
};



// Helper function that trims the input string and then checks the length
// The string is empty if true is returned, otherwise, string is a valid value
function isInvalidString(str: text): boolean {
    return str.trim().length == 0
  }

  // Helper function to ensure the input id meets the format used for ids generated by uuid
  function isValidUuid(id: string): boolean {
    const regexExp = /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/gi;
    return regexExp.test(id);
}


  /**
  * Helper function to validate the TaxonomyPayload
  */
  function validateTaxonomyPayload(payload: typeof TaxonomyPayload): Vec<string>{
    const errors: Vec<text> = [];
    // @ts-ignore
    if (isInvalidString(payload.kingdom)){
        errors.push(`kingdom='${payload.kingdom}' cannot be empty.`)
    }
    // @ts-ignore
    if (isInvalidString(payload.family)){
        errors.push(`family='${payload.family}' cannot be empty.`)
    }
    // @ts-ignore
    if (isInvalidString(payload.genus)){
        errors.push(`genus='${payload.genus}' cannot be empty.`)
    }
    // @ts-ignore
    if (isInvalidString(payload.order)){
        errors.push(`order='${payload.order}' cannot be empty.`)
    }
    // @ts-ignore
    if (isInvalidString(payload.phylum)){
        errors.push(`phylum='${payload.phylum}' cannot be empty.`)
    }
    // @ts-ignore
    if (isInvalidString(payload.species)){
        errors.push(`species='${payload.species}' cannot be empty.`)
    }
    // @ts-ignore
    if (isInvalidString(payload.taxon_class)){
        errors.push(`taxon_class='${payload.taxon_class}' cannot be empty.`)
    }
    return errors;
  }
  /**
  * Helper function to validate the MarineSpeciePayload
  */
  function validateMarineSpeciePayload(payload: typeof MarineSpeciePayload): Vec<string>{
    const errors: Vec<text> = [];
    // @ts-ignore
    if (isInvalidString(payload.name)){
        errors.push(`name='${payload.name}' cannot be empty.`)
    }
    // @ts-ignore
    if (isInvalidString(payload.description)){
        errors.push(`description='${payload.description}' cannot be empty.`)
    }
    return errors;
  }