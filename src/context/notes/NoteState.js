/* eslint-disable react/jsx-pascal-case */
import { useState } from "react";
import NoteContext from "./noteContext";

const NoteState = (props) => {
  const host = "http://localhost:5000"
  const notesInitial = []
  const [notes, setNotes] = useState(notesInitial);

  const getNotes = async() => {
    //api
    const response = await fetch(`${host}/api/notes//fetchallnotes`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        "auth-token": localStorage.getItem('token')
      }
    });
    const json = await response.json()
    console.log(json);
    setNotes(json);
  }



  //Add a note

  const addNote = async (title, description, tag) => {
    //api
    const response = await fetch(`${host}/api/notes/addnote`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        "auth-token": localStorage.getItem('token')
      },
      body: JSON.stringify({ title, description, tag })
    });

    const note = await response.json();
    //logic
    setNotes(notes.concat(note));

  }

  //Delete a note

  const deleteNote = async(id) => {
    //api

    const response = await fetch(`${host}/api/notes/deletenote/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        "auth-token": localStorage.getItem('token')
      }
    });

    //const json = response.json();
    const newNotes = notes.filter((note) => { return note._id !== id });
    setNotes(newNotes);

  }

  //Edit a note

  const editNote = async (id, title, description, tag) => {

    //api call
    const response = await fetch(`${host}/api/notes/updatenote/${id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        "auth-token": localStorage.getItem('token')
      },
      body: JSON.stringify({ title, description, tag })
    });
    //const json = await response.json();

    let newNodes = JSON.parse(JSON.stringify(notes));

    //logic to edit
    for (let index = 0; index < newNodes.length; index++) {
      const element = newNodes[index];
      if (element._id === id) {
        newNodes[index].title = title;
        newNodes[index].description = description;
        newNodes[index].tag = tag;
        break;
      }
      
    }
    
    setNotes(newNodes);

  }

  return (
    <NoteContext.Provider value={{ notes, addNote, deleteNote, editNote, getNotes }}>
      {props.children}
    </NoteContext.Provider>
  )

}

export default NoteState;