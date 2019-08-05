import check from './check';
import common from './common';

export default function () {
    return { ...check, ...common }
}