import { NoteModel } from "../../../features/notes/NoteModel"

export async function fetchNotes() {
    const response = await fetch("http://127.0.0.1:8080/v1/notes")
    const json = await response.json()
    return json.data 
}

export async function createNote(note: NoteModel) {
    const data = new FormData()
    data.append("title", note.title)
    data.append("content", note.content)

    const response = await fetch("http://127.0.0.1:8080/v1/notes", {
        method: "POST",
        body: data,
    })
    return response.status
}

export async function updateNote(note: NoteModel) {
    const data = new FormData()
    data.append("title", note.title)
    data.append("content", note.content)

    const response = await fetch(`http://127.0.0.1:8080/v1/notes/${note.id}`, {
        method: "PATCH",
        body: data,
    })
    return response.status
}

export async function deleteNote(noteId: string) {
    const response = await fetch(`http://127.0.0.1:8080/v1/notes/${noteId}`, {
        method: "DELETE",
    })
    return response.status
}
