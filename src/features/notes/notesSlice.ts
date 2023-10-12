import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState, AppThunk } from '../../app/store'
import { fetchNotes, createNote, updateNote, deleteNote } from '../../data/http/note'
import { NoteModel } from './NoteModel'

export interface NotesState {
    value: NoteModel[]
    status: 'idle' | 'loading' | 'failed'
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
        showLoading: (state) => {
            state.status = 'loading'
        },
        insertNote: (state, action: { payload: NoteModel }) => {
            state.value.push(action.payload)
        },
        editNote: (state, action: { payload: NoteModel }) => {
            state.value = state.value.map(item => {
                if (item.id === action.payload.id) {
                    return action.payload
                } else {
                    return item
                }
            })
        },
        removeNote: (state, action: { payload: string }) => {
            state.value = state.value.filter(item => {
                return item.id !== action.payload
            })
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
                state.status = 'failed'
            })

            .addCase(createNoteAsync.pending, (state) => {
                state.status = 'loading'
            })
            .addCase(createNoteAsync.fulfilled, (state, action) => {
                state.status = 'idle'
                if (action.payload === 200) {
                    notesSlice.caseReducers.insertNote(state, { payload: action.meta.arg })
                }
            })
            .addCase(createNoteAsync.rejected, (state) => {
                state.status = 'failed'
            })

            .addCase(updateNoteAsync.pending, (state) => {
                state.status = 'loading'
            })
            .addCase(updateNoteAsync.fulfilled, (state, action) => {
                state.status = 'idle'
                if (action.payload === 200) {
                    notesSlice.caseReducers.editNote(state, { payload: action.meta.arg })
                }
            })
            .addCase(updateNoteAsync.rejected, (state) => {
                state.status = 'failed'
            })

            .addCase(deleteNoteAsync.pending, (state) => {
                state.status = 'loading'
            })
            .addCase(deleteNoteAsync.fulfilled, (state, action) => {
                state.status = 'idle'
                if (action.payload === 200) {
                    notesSlice.caseReducers.removeNote(state, { payload: action.meta.arg })
                }
            })
            .addCase(deleteNoteAsync.rejected, (state) => {
                state.status = 'failed'
            })
    }
})

export const notesState = (state: RootState) => state.notes

export const onCreateNote = (note: NoteModel): AppThunk => (dispatch, _) => {
    dispatch(notesSlice.actions.showLoading())
    setTimeout(function() {
        dispatch(createNoteAsync(note))
    }, 15000)
}

export const onUpdateNote = (note: NoteModel): AppThunk => (dispatch, _) => {
    dispatch(updateNoteAsync(note))
}

export const onDeleteNote = (noteId: string): AppThunk => (dispatch, _) => {
    dispatch(deleteNoteAsync(noteId))
}

export default notesSlice.reducer
