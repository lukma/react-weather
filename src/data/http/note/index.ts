import { NoteModel } from "../../../features/notes/NoteModel"

const apiBaseUrl = `${process.env.REACT_APP_API_BASE_URL}`

export async function fetchNotes() {
    const response = await fetch(`${apiBaseUrl}/v1/notes`)
    const json = await response.json()
    return json.data 
}

export async function createNote(note: NoteModel) {
    const data = new FormData()
    data.append("title", note.title)
    data.append("content", note.content)

    const response = await fetch(`${apiBaseUrl}/v1/notes`, {
        method: "POST",
        body: data,
    })

    if (response.status !== 200) {
        const json = await response.json()
        return json.error.message
    }

    return null
}

export async function updateNote(note: NoteModel) {
    const data = new FormData()
    data.append("title", note.title)
    data.append("content", note.content)

    const response = await fetch(`${apiBaseUrl}/v1/notes/${note.id}`, {
        method: "PATCH",
        body: data,
    })

    if (response.status !== 200) {
        const json = await response.json()
        return json.error.message
    }

    return null
}

export async function deleteNote(noteId: string) {
    const response = await fetch(`${apiBaseUrl}/v1/notes/${noteId}`, {
        method: "DELETE",
    })

    if (response.status !== 200) {
        const json = await response.json()
        return json.error.message
    }

    return null
}
