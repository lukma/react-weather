import React from 'react'
import { Modal } from 'antd'

interface IDeleteNoteModalProps {
    isShown: boolean
    onOk: () => void
    onCancel: () => void
}

export function DeleteNoteModal(props: IDeleteNoteModalProps) {
    return (
        <Modal
            title="Confirmation"
            open={props.isShown}
            onOk={props.onOk}
            okText="Confirm"
            onCancel={props.onCancel}
        >
            Do you want to delete this data?
        </Modal>
    )
}
