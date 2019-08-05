import React, { Component } from 'react';

const _prefix = 'matrix-step'

const _index = ['①', '②', '③', '④', '⑤']

export default class Step extends Component {

    render() {

        const renderIcon = (index) => {
            if (this.props.fail && index >= this.props.current) {
                return (
                    <div className={`${_prefix}-fail-icon`}>
                    </div>
                )
            }
            if (index === this.props.steps.length - 1) {
                return (
                    <div className={`${_prefix}-finish-icon ${index + 1 <= this.props.current ? 'finish' : ''}`}>
                    </div>
                )
            } else {
                return (
                    <div className={`${_prefix}-icon ${index + 1 <= this.props.current ? 'finish' : ''}`}>
                        <span className={`${_prefix}-num`}>
                            {_index[index]}
                        </span>
                    </div>
                )
            }
        }

        const renderStep = (item, index) => {
            return (
                <div key={index} className={`${_prefix}-item`}>
                    {index !== 0 ?
                        <span className={`${_prefix}-line-before ${index + (this.props.done ? 0 : 1) <= this.props.current ? 'finish' : this.props.fail ? 'fail' : ''}`}></span> :
                        null
                    }
                    {index !== this.props.steps.length - 1 ?
                        <span className={`${_prefix}-line-after ${index + (this.props.doing || this.props.done ? 1 : 2) <= this.props.current ? 'finish' : this.props.fail ? 'fail' : ''}`}></span> :
                        null
                    }
                    {renderIcon(index)}
                    <div className={`${_prefix}-content ${_prefix}-content-${this.props.size} ${index + 1 <= this.props.current ? 'finish' : ''}`}>
                        {item.title}
                    </div>
                </div>
            )
        }

        if (this.props.mobile) {
            return (
                <div className={`${_prefix}-h5`}>
                    {
                        this.props.steps.map((item, index) => {
                            const done = index + 1 <= this.props.current
                            return (
                                <section key={index} className={`${done ? _prefix + '-h5-done' : ''}`}>{_index[index]} {item.title}</section>
                            )
                        })
                    }
                </div>
            )
        }

        return (
            <div className={`${_prefix}`}>
                {this.props.steps.map((item, index) => {
                    return renderStep(item, index)
                })}
            </div>
        );
    }
}