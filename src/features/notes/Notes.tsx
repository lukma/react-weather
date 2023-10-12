import React, { useState, useEffect } from 'react'
import { Button, Card, Spin } from 'antd'
import { useAppSelector, useAppDispatch } from '../../app/hooks'
import { fetchNotesAsync, notesState, onCreateNote, onUpdateNote, onDeleteNote } from './notesSlice'
import { CreateNoteModal } from './CreateNoteModal'
import { NoteModel } from './NoteModel'
import { EditNoteModal } from './EditNoteModal'
import { DeleteNoteModal } from './DeleteNoteModal'
import { NoteTable } from './NoteTable'

export function Notes() {
    const notes = useAppSelector(notesState)
    const dispatch = useAppDispatch()

    const [isCreateNoteModalShown, setCreateNoteModalShown] = useState(false)
    const [isEditNoteModalShown, setEditNoteModalShown] = useState(false)
    const [isDeleteNoteModalShown, setDeleteNoteModalShown] = useState(false)
    const [selectedNote, setSelectedNote] = useState<NoteModel>()

    useEffect(() => {
        dispatch(fetchNotesAsync())
    }, [])

    useEffect(() => {
        if (notes.status === 'idle') {
            setCreateNoteModalShown(false)
            setEditNoteModalShown(false)
            setDeleteNoteModalShown(false)
        }
    }, [notes.status])

    return (
        <Spin spinning={notes.status === 'loading'}>
            <Card>
                <Button type="primary" onClick={() => setCreateNoteModalShown(true)}>
                    Create
                </Button>
                <NoteTable
                    data={notes.value}
                    onEdit={(note) => {
                        setSelectedNote(note)
                        setEditNoteModalShown(true)
                    }}
                    onDelete={(note) => {
                        setSelectedNote(note)
                        setDeleteNoteModalShown(true)
                    }}
                />
            </Card>
            <CreateNoteModal
                isShown={isCreateNoteModalShown}
                isLoading={notes.status === 'loading'}
                onOk={(values) => dispatch(onCreateNote({
                    title: values.title,
                    content: values.content,
                }))}
                onCancel={() => setCreateNoteModalShown(false)}
            />
            <EditNoteModal
                isShown={isEditNoteModalShown}
                isLoading={notes.status === 'loading'}
                note={selectedNote}
                onOk={(values) => dispatch(onUpdateNote({
                    id: selectedNote?.id,
                    title: values.title,
                    content: values.content,
                }))}
                onCancel={() => setEditNoteModalShown(false)}
            />
            <DeleteNoteModal
                isShown={isDeleteNoteModalShown}
                onOk={() => {
                    const id = selectedNote?.id
                    if (id !== null) {
                        dispatch(onDeleteNote(id!))
                    }
                }}
                onCancel={() => setDeleteNoteModalShown(false)}
            />    
        </Spin>
    )
}
