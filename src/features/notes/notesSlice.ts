import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState, AppThunk } from '../../app/store'
import { fetchNotes, createNote, updateNote, deleteNote } from '../../data/http/note'
import { NoteModel } from './NoteModel'

export interface NotesState {
    value: NoteModel[]
    status: 'idle' | 'loading' | 'failed'
    error?: string
}

const initialState: NotesState = {
    value: [],
    status: 'idle',
}

export const fetchNotesAsync = createAsyncThunk('notes/fetchNotes', fetchNotes)
export const createNoteAsync = createAsyncThunk('notes/createNote', (note: NoteModel) => createNote(note))
export const updateNoteAsync = createAsyncThunk('notes/updateNote', (note: NoteModel) => updateNote(note))
export const deleteNoteAsync = createAsyncThunk('notes/deleteNote', (noteId: string) => deleteNote(noteId))

export const notesSlice = createSlice({
    name: 'notes',
    initialState,
    reducers: {
        showError: (state, action: { payload: string }) => {
            state.status = 'failed'
            state.error = action.payload
        },
        insertNote: (state, action: { payload: NoteModel }) => {
            state.value.push(action.payload)
            state.error = undefined
        },
        editNote: (state, action: { payload: NoteModel }) => {
            state.value = state.value.map(item => {
                if (item.id === action.payload.id) {
                    return action.payload
                } else {
                    return item
                }
            })
            state.error = undefined
        },
        removeNote: (state, action: { payload: string }) => {
            state.value = state.value.filter(item => {
                return item.id !== action.payload
            })
            state.error = undefined
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchNotesAsync.pending, (state) => {
                state.status = 'loading'
            })
            .addCase(fetchNotesAsync.fulfilled, (state, action) => {
                state.status = 'idle'
                state.value = action.payload
            })
            .addCase(fetchNotesAsync.rejected, (state) => {
                notesSlice.caseReducers.showError(state, { payload: 'Something wrong!!!' })
            })

            .addCase(createNoteAsync.pending, (state) => {
                state.status = 'loading'
            })
            .addCase(createNoteAsync.fulfilled, (state, action) => {
                state.status = 'idle'
                if (action.payload === null) {
                    notesSlice.caseReducers.insertNote(state, { payload: action.meta.arg })
                } else {
                    notesSlice.caseReducers.showError(state, { payload: action.payload })
                }
            })
            .addCase(createNoteAsync.rejected, (state) => {
                notesSlice.caseReducers.showError(state, { payload: 'Something wrong!!!' })
            })

            .addCase(updateNoteAsync.pending, (state) => {
                state.status = 'loading'
            })
            .addCase(updateNoteAsync.fulfilled, (state, action) => {
                state.status = 'idle'
                if (action.payload === null) {
                    notesSlice.caseReducers.editNote(state, { payload: action.meta.arg })
                } else {
                    notesSlice.caseReducers.showError(state, { payload: action.payload })
                }
            })
            .addCase(updateNoteAsync.rejected, (state) => {
                notesSlice.caseReducers.showError(state, { payload: 'Something wrong!!!' })
            })

            .addCase(deleteNoteAsync.pending, (state) => {
                state.status = 'loading'
            })
            .addCase(deleteNoteAsync.fulfilled, (state, action) => {
                state.status = 'idle'
                if (action.payload === null) {
                    notesSlice.caseReducers.removeNote(state, { payload: action.meta.arg })
                } else {
                    notesSlice.caseReducers.showError(state, { payload: action.payload })
                }
            })
            .addCase(deleteNoteAsync.rejected, (state) => {
                notesSlice.caseReducers.showError(state, { payload: 'Something wrong!!!' })
            })
    }
})

export const notesState = (state: RootState) => state.notes

export const onCreateNote = (note: NoteModel): AppThunk => (dispatch, _) => {
    dispatch(createNoteAsync(note))
}

export const onUpdateNote = (note: NoteModel): AppThunk => (dispatch, _) => {
    dispatch(updateNoteAsync(note))
}

export const onDeleteNote = (noteId: string): AppThunk => (dispatch, _) => {
    dispatch(deleteNoteAsync(noteId))
}

export default notesSlice.reducer
