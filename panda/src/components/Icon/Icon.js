import React, { Component } from 'react';

export default class Icon extends Component {

    render() {

        const size = this.props.size || '.16rem'

        const style = {
            width: size,
            height: size,
            color: this.props.color,
            fontSize: this.props.fontSize,
            ...this.props.style
        }

        const icons = {
            left: (<path fill={this.props.color} d="M734.2 945c-17.5 17.5-45.8 17.5-63.3 0L300.7 574.8c-35-35-35-91.7 0-126.6l372.9-373c17.3-17.3 45.3-17.5 62.8-0.5 17.9 17.4 18.1 46.1 0.5 63.8L395.7 479.8c-17.5 17.5-17.5 45.8 0 63.3l338.6 338.6c17.4 17.5 17.4 45.8-0.1 63.3z"></path>),
            circleDot: (<path fill={this.props.color} d="M150.1184 150.1184C250.2656 50.0736 370.8928 0 512 0c141.1072 0 261.7344 50.0736 361.8816 150.1184C973.9264 250.2656 1024 370.8928 1024 512c0 141.2096-50.0736 261.8368-150.1184 361.8816C773.7344 973.9264 653.1072 1024 512 1024c-141.1072 0-261.7344-50.0736-361.8816-150.1184C50.0736 773.8368 0 653.2096 0 512 0 370.8928 50.0736 250.2656 150.1184 150.1184zM512 41.8816c-85.2992 0-164.1472 20.8896-236.3392 62.7712C203.4688 146.432 146.432 203.4688 104.6528 275.6608 62.7712 347.9552 41.8816 426.7008 41.8816 512c0 129.6384 45.9776 240.4352 137.8304 332.288C271.5648 936.2432 382.3616 982.1184 512 982.1184c129.6384 0 240.4352-45.8752 332.288-137.8304C936.2432 752.4352 982.1184 641.6384 982.1184 512c0-129.6384-45.9776-240.3328-137.8304-332.288C752.4352 87.7568 641.6384 41.8816 512 41.8816zM512 256c-36.1472 0-70.144 7.0656-102.1952 20.8896C377.856 290.9184 349.4912 309.3504 324.9152 332.288c-22.9376 24.576-41.472 52.9408-55.3984 84.8896S248.6272 483.328 248.6272 519.3728c0 36.1472 6.9632 70.144 20.8896 102.1952s32.4608 60.3136 55.3984 84.8896C349.4912 729.4976 377.856 747.9296 409.8048 761.856 441.856 775.7824 475.8528 782.7456 512 782.7456c36.1472 0 70.144-6.9632 102.1952-20.8896C646.144 747.9296 674.5088 729.4976 699.0848 706.4576c22.9376-24.576 41.472-52.9408 55.3984-84.8896s20.8896-66.048 20.8896-102.1952c0-36.0448-6.9632-70.144-20.8896-102.1952S722.0224 356.9664 699.0848 332.288C674.5088 309.3504 646.144 290.9184 614.1952 276.8896 582.144 263.0656 548.1472 256 512 256z" ></path>),
            circle: (<path fill={this.props.color} d="M513.6 993.6c-259.2 0-470.4-211.2-470.4-470.4S252.8 51.2 513.6 51.2s470.4 211.2 470.4 470.4S772.8 993.6 513.6 993.6zM513.6 99.2C280 99.2 89.6 289.6 89.6 521.6s190.4 422.4 422.4 422.4 422.4-190.4 422.4-422.4S745.6 99.2 513.6 99.2z"></path>),
            search: (<g fill={this.props.color}><path d="M480 128c192 0 352 160 352 352S672 832 480 832 128 672 128 480 288 128 480 128m0-64C249.6 64 64 249.6 64 480S249.6 896 480 896 896 710.4 896 480 710.4 64 480 64z"></path><path d="M928 928m-32 0a32 32 0 1 0 64 0 32 32 0 1 0-64 0Z"></path><path d="M770.56 725.248l180.992 180.992-45.248 45.312-181.056-181.056z"></path></g>),
            down: (<path fill={this.props.color} d="M958.577476 311.180252c0 15.286148-5.878894 29.522384-16.564257 40.166815L551.623951 741.043556c-1.39272 1.425466-2.577708 2.537799-3.846608 3.449565l-2.905166 2.304486c-11.416004 11.362792-24.848944 16.945951-39.068807 16.945951-14.475689 0-28.010961-5.708002-38.110993-16.056698L79.475588 355.310332c-10.467399-10.613732-16.236799-24.786523-16.236799-39.893592 0-14.772448 5.599532-28.726252 15.753799-39.286772 10.18599-10.497075 24.390503-16.539698 38.95215-16.539698 14.382569 0 28.009937 5.723352 38.366819 16.142655l350.169241 353.968777 359.428116-358.485651c10.30981-10.248412 23.781636-15.909341 37.994336-15.909341 14.889105 0 28.859281 6.05081 39.333844 16.999163C953.126324 282.725176 958.577476 296.556183 958.577476 311.180252z"></path>),
        }

        return (
            <svg viewBox="0 0 1024 1024" className={this.props.className} style={style}>
                {icons[this.props.type]}
            </svg>
        );
    }
}