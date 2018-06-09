import React, { Component } from 'react';
import { Modal } from 'antd';

const withFormModal = (WrappedComponent) => { // eslint-disable-line
    return class extends Component {
        render() {
            const {
                injectForm,
                getRef,
                ...restProp
            } = this.props;
            return (
                <Modal {...restProp}>
                    <WrappedComponent wrappedComponentRef={getRef} injectForm={injectForm} />
                </Modal>
            );
        }
    };
};

export default withFormModal;
