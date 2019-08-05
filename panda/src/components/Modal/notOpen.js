import React from 'react';
import ReactDOM from 'react-dom';
import NotOpenModal from './NotOpenModal';

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
        <NotOpenModal
            ref={el => component = el}
            afterClose={afterClose}
            {...props}
        ></NotOpenModal>,
        div
    );
    return component;
}

export default (props) => show({
    ...props,
});
