import { Principal } from "@dfinity/principal";
import { transferICP } from "./ledger";

// getTaxonomies
export async function getTaxonomies() {
  return window.canister.marineSpecies.getTaxonomies();
}

// getTaxonomy
export async function getTaxonomy(id) {
  return window.canister.marineSpecies.getTaxonomy(id);
}

// addTaxonomy
export async function createTaxonomy(taxonomy) {
  return window.canister.marineSpecies.addTaxonomy(taxonomy);
}

// updateTaxonomy
export async function updateTaxonomy(id,taxonomy) {
  return window.canister.marineSpecies.updateTaxonomy(id,taxonomy);
}

// deleteTaxonomy
export async function deleteTaxonomy(id) {
  return window.canister.marineSpecies.deleteTaxonomy(id);
}

// getMarineSpecies
export async function getMarineSpecies() {
  return window.canister.marineSpecies.getMarineSpecies();
}

// updateMarineSpecie
export async function updateMarineSpecie(id,marineSpecie) {
  return window.canister.marineSpecies.updateMarineSpecie(id,marineSpecie);
}

// deleteMarineSpecie
export async function deleteMarineSpecie(id) {
  return window.canister.marineSpecies.deleteMarineSpecie(id);
}

// getMarineSpecie
export async function getMarineSpecie(id) {
  return window.canister.marineSpecies.getMarineSpecie(id);
}

// addMarineSpecie
export async function createMarineSpecie(taxonomyId,marineSpecie) {
  return window.canister.marineSpecies.addMarineSpecie(taxonomyId,marineSpecie);
}

// sortMarineSpeciesByTaxonomyKingdom
export async function sortMarineSpeciesByTaxonomyKingdomAsc() {
  return window.canister.marineSpecies.sortMarineSpeciesByTaxonomyKingdom();
}

// sortMarineSpeciesByTaxonomyKingdomDesc
export async function sortMarineSpeciesByTaxonomyKingdomDesc() {
  return window.canister.marineSpecies.sortMarineSpeciesByTaxonomyKingdomDesc();
}

// searchMarineSpeciesByTaxonomyKingdomOrPhylum
export async function searchMarineSpeciesByTaxonomyKingdomOrPhylum(searchString) {
  return window.canister.marineSpecies.searchMarineSpeciesByTaxonomyKingdomOrPhylum(searchString);
}

// sortMarineSpeciesByTimeOfCreation
export async function sortMarineSpeciesByTimeOfCreation() {
  return window.canister.marineSpecies.sortMarineSpeciesByTimeOfCreation();
}
