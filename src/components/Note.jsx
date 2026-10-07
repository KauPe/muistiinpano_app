/**
 * Note-komponentti (Esitystason komponentti)
 * Vastaa yksittäisen muistiinpanon renderöinnistä listaan.
 * Ottaa propsina vastaan muistiinpano-olion (note) sekä funktion, 
 * jolla muistiinpanon tärkeyttä voidaan vaihtaa (toggleImportance).
 */
 const Note = ({ note, toggleImportance }) => {
  // Määritellään dynaamisesti napin teksti sen mukaan, onko muistiinpano tällä hetkellä tärkeä vai ei.
  const label = note.important
    ? 'make not important' 
    : 'make important'

  return (
    <li className='note'>
      {/* Näytetään muistiinpanon sisältö */}
      {note.content} 
      
      {/* Nappi, jota klikkaamalla kutsutaan App-komponentista välitettyä toggleImportance-funktiota */}
      <button onClick={toggleImportance}>{label}</button>
    </li>
  )
}

// Viedään komponentti oletuksena ulos, jotta sitä voidaan käyttää muissa tiedostoissa (kuten App.jsx:ssä)
export default Note