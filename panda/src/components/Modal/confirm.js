import React from 'react';
import ReactDOM from 'react-dom';
import ConfirmModal from './ConfirmModal';

const show = (props) => {

    let component = null;
    const div = document.createElement('div');
    document.body.appendChild(div);

    const afterClose = () => {
        ReactDOM.unmountComponentAtNode(div);
        document.body.removeChild(div);

        if (typeof props.afterClose === 'function') {
            props.afterClose();
        }
    }

    ReactDOM.render(
        <ConfirmModal
            ref={el => component = el}
            afterClose={afterClose}
            {...props}
        ></ConfirmModal>,
        div
    );
    return component;
}

export default (props) => show({
    ...props,
});
