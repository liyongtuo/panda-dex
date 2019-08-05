import Modal from './Modal';
import login from './login';
import confirm from './confirm';
import notOpen from './notOpen';
import Input from './Input';
import Select from './Select';
import DatePicker from './DatePicker';

Modal.confirm = function(props) {
    return confirm(props)
}

Modal.login = function(props) {
    return login(props)
}

Modal.notOpen = function(props) {
    return notOpen(props)
}

export default Modal;

Modal.Input = Input
Modal.Select = Select
Modal.DatePicker = DatePicker