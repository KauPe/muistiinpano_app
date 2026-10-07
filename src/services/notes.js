import axios from 'axios'

const baseUrl = '/api/notes'



/**
 * getAll: Hakee kaikki muistiinpanot palvelimelta.
 * @returns {Promise} Palauttaa promisen, joka ratketessaan antaa pelkän datan (eikä koko axios-vastausoliota).
 */
const getAll = () => {
  const request = axios.get(baseUrl)
  // Otetaan axios-vastausoliosta (.response) pelkkä data-kenttä (.data), 
  // jotta komponentti saa suoraan käyttöönsä taulukon.
  return request.then(response => response.data)
}

/**
 * create: Tallentaa uuden muistiinpanon palvelimelle.
 * @param {Object} newObject - Lisättävä muistiinpano-olio (esim. { content: '...', important: true })
 * @returns {Promise} Palauttaa promisen, joka antaa palvelimen luoman ja palautustiedot sisältävän olion.
 */
const create = newObject => {
  const request = axios.post(baseUrl, newObject)
  // Palautetaan vastauksesta pelkkä data (sisältää nyt myös palvelimen luoman id:n)
  return request.then(response => response.data)
}

/**
 * update: Päivittää olemassa olevaa muistiinpanoa palvelimella (esim. tärkeysasteen muutos).
 * @param {String|Number} id - Päivitettävän muistiinpanon tunniste
 * @param {Object} newObject - Muistiinpano-olio päivitetyillä tiedoilla
 * @returns {Promise} Palauttaa promisen, joka antaa palvelimen päivittämän tiedon.
 */
const update = (id, newObject) => {
  const request = axios.put(`${baseUrl}/${id}`, newObject)
  // Palautetaan vastauksesta pelkkä data
  return request.then(response => response.data)
}

// Viedään palvelufunktiot oletuksena objektina, jotta niitä voidaan käyttää muissa tiedostoissa (kuten App.jsx:ssä)
export default { getAll, create, update }