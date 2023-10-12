import React from 'react'
import { Space, Table } from 'antd'
import { NoteModel } from './NoteModel'

interface INoteTableProps {
    data: NoteModel[]
    onEdit: (note: NoteModel) => void
    onDelete: (note: NoteModel) => void
}

export function NoteTable(props: INoteTableProps) {
    const columns = [
        {
            title: 'Title',
            dataIndex: 'title',
            key: 'title',
        },
        {
            title: 'Content',
            dataIndex: 'content',
            key: 'content',
        },
        {
            title: 'Action',
            key: 'action',
            render: (_: any, record: NoteModel) => (
                <Space size="middle">
                    <a onClick={() => props.onEdit(record)}>
                        Edit
                    </a>
                    <a onClick={() => props.onDelete(record)}>
                        Delete
                    </a>
                </Space>
            )
        },
    ]

    return (
        <Table
            dataSource={props.data.map((note) => {
                return {...note, key: note.id}
            })}
            columns={columns}
        />
    )
}
