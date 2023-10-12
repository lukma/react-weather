import React, { useState, useCallback } from 'react'
import { Form, Input, Modal, Spin } from 'antd'
import { NoteModel } from './NoteModel'

interface IEditNoteModalProps {
    isShown: boolean
    isLoading: boolean
    note?: NoteModel
    onOk: (values: any) => void
    onCancel: () => void
}

export function EditNoteModal(props: IEditNoteModalProps) {
    const [form] = Form.useForm()
    const [isFormValid, setFormValid] = useState(true);

    const checkFormvalidation = useCallback(() => {
        const title = form.getFieldValue('title')
        const content = form.getFieldValue('content')

        if (title === undefined || title === "" || form.getFieldError('title').length > 0) {
            setFormValid(false)
            return
        }

        if (content === undefined || content === "" || form.getFieldError('content').length > 0) {
            setFormValid(false)
            return
        }

        setFormValid(true)
    }, []);

    return (
        <Modal
            title="Edit Note"
            open={props.isShown}
            onOk={() => props.onOk(form.getFieldsValue())}
            okButtonProps={{
                disabled: props.isLoading || !isFormValid,
            }}
            onCancel={props.onCancel}
            cancelButtonProps={{
                disabled: props.isLoading,
            }}
            closable={!props.isLoading}
        >
            <Spin spinning={props.isLoading}>
                <Form
                    form={form}
                    layout="vertical"
                    initialValues={{
                        title: props.note?.title,
                        content: props.note?.content,
                    }}
                    onFieldsChange={checkFormvalidation}
                >
                    <Form.Item<FieldType>
                        label="Title"
                        name="title"
                        rules={[{ required: true, message: 'Please input title!' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item<FieldType>
                        label="Content"
                        name="content"
                        rules={[{ required: true, message: 'Please input content!' }]}
                    >
                        <Input.TextArea rows={4} />
                    </Form.Item>
                </Form>
            </Spin>
        </Modal>
    )
}

type FieldType = {
    title?: string;
    content?: string;
}
