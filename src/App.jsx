import { useState, useEffect } from 'react'
import Note from './components/Note'
import noteService from './services/notes'
import Notification from './components/Notification'

const App = () => {
  // ---------------------------------------------------------------------------
  // TILAT (STATE) MÄÄRITTELYT
  // ---------------------------------------------------------------------------
  
  // 'notes': Taulukko, joka pitää sisällään kaikki sovelluksen muistiinpanot.
  const [notes, setNotes] = useState([])
  
  // 'newNote': Merkkijono, johon tallennetaan käyttäjän syötekenttään kirjoittama teksti.
  const [newNote, setNewNote] = useState('')
  
  // 'showAll': Totuusarvo (boolean). Jos true, näytetään kaikki muistiinpanot. Jos false, vain tärkeät.
  const [showAll, setShowAll] = useState(true)

  const [errorMessage, setErrorMessage] = useState('some error happened...')


  // ---------------------------------------------------------------------------
  // TIETOJEN HAKU PALVELIMELTA (EFFECT HOOK)
  // ---------------------------------------------------------------------------
  
  /**
   * useEffect suoritetaan automaattisesti komponentin ensimmäisen renderöinnin (mount) jälkeen.
   * Tyhjän taulukon `[]` ansiosta tämä suoritetaan vain kerran sovelluksen käynnistyessä.
   */
  useEffect(() => {
    // Haetaan muistiinpanot palvelimelta noteService-moduulin avulla
    noteService.getAll().then((initialNotes) => {
      // Asetetaan haetut muistiinpanot suoraan notes-tilaan
      setNotes(initialNotes)
    })
  }, [])


  // ---------------------------------------------------------------------------
  // TAPAHTUMANKÄSITTELIJÄT (EVENT HANDLERS)
  // ---------------------------------------------------------------------------

  /**
   * addNote: Käsittelee uuden muistiinpanon luomisen lomakkeen lähetyksestä.
   */
  const addNote = (event) => {
    // Estetään lomakkeen oletustoiminto eli sivun uudelleenlatautuminen
    event.preventDefault()
    
    // Luodaan uusi muistiinpano-olio
    const noteObject = {
      content: newNote,
      important: Math.random() > 0.5, // Arvotaan satunnaisesti onko muistiinpano tärkeä
    }

    // Lähetetään uusi muistiinpano palvelimelle ja päivitetään tila vastauksen saapuessa
    noteService.create(noteObject).then((returnedNote) => {
      // Lisätään palvelimen palauttama uusi muistiinpano olemassa olevaan listaan
      setNotes(notes.concat(returnedNote))
      // Tyhjennetään syötekenttä
      setNewNote('')
    })
  }

  /**
   * toggleImportanceOf: Vaihtaa yksittäisen muistiinpanon tärveysastetta (true <-> false).
   */
  const toggleImportanceOf = (id) => {
    // Etsitään muistipano taulukosta id:n perusteella
    const note = notes.find((n) => n.id === id)
    // Luodaan kopio muistiinpanosta, jossa important-arvo on käänteinen
    const changedNote = { ...note, important: !note.important }

    // Lähetetään muutos palvelimelle PUT-pyynnöllä
    noteService
      .update(id, changedNote)
      .then((returnedNote) => {
        // Päivitetään tila korvaamalla muuttunut muistiinpano palvelimen palauttamalla versiolla
        setNotes(notes.map((note) => (note.id !== id ? note : returnedNote)))
      })
      .catch((error) => {
        setErrorMessage(
          `Note '${note.content}' was already removed from server`
        )
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
        setNotes(notes.filter((n) => n.id !== id))
      })
  }

  /**
   * handleNoteChange: Päivittää newNote-tilaa aina, kun käyttäjä kirjoittaa jotain tekstikenttään.
   */
  const handleNoteChange = (event) => {
    setNewNote(event.target.value)
  }


  // ---------------------------------------------------------------------------
  // SUODATUSLOGIIKKA (FILTERING)
  // ---------------------------------------------------------------------------
  
  // Määritetään näytettävät muistiinpanot sen mukaan, onko showAll true vai false
  const notesToShow = showAll ? notes : notes.filter((note) => note.important)


  // ---------------------------------------------------------------------------
  // KÄYTTÖLIITTYMÄN RENDERÖINTI (JSX)
  // ---------------------------------------------------------------------------
  return (
    <div>
      <h1>Notes</h1>
      <Notification message={errorMessage} />
      {/* Painike, jolla vaihdetaan näytetäänkö kaikki vai vain tärkeät muistiinpanot */}
      <div>
        <button onClick={() => setShowAll(!showAll)}>
          show {showAll ? 'important' : 'all'}
        </button>
      </div>

      {/* Muistiinpanolista: käydään läpi suodatetut muistiinpanot ja luodaan Note-komponentit */}
      <ul>
        {notesToShow.map((note) => (
          <Note
            key={note.id}
            note={note}
            toggleImportance={() => toggleImportanceOf(note.id)}
          />
        ))}
      </ul>

      {/* Lomake uuden muistiinpanon syöttämiseen */}
      <form onSubmit={addNote}>
        <input value={newNote} onChange={handleNoteChange} />
        <button type="submit">save</button>
      </form>
    </div>
  )
}

export default App