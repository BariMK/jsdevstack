import React from 'react'
import {PureRenderComponent} from './base'
import accepts from 'attr-accept';

const supportMultiple = (typeof document !== 'undefined' && document && document.createElement) ?
'multiple' in document.createElement('input') :
    true;

export default class DropPanel extends PureRenderComponent {

    static propTypes = {
        onDrop: React.PropTypes.func,
        onDragEnter: React.PropTypes.func,
        onDragLeave: React.PropTypes.func,

        children: React.PropTypes.node,

        className: React.PropTypes.string,
        activeClassName: React.PropTypes.string,
        rejectClassName: React.PropTypes.string,

        buttonProps: React.PropTypes.object,
        buttonClassName: React.PropTypes.string,
        buttonLabel: React.PropTypes.string,

        disablePreview: React.PropTypes.bool,
        inputProps: React.PropTypes.object,
        multiple: React.PropTypes.bool,
        accept: React.PropTypes.string
    };

    static defaultProps = {
        disablePreview: false,
        disableClick: false,
        multiple: true
    };

    constructor(props, context) {
        super(props, context);
        this.onClick = this.onClick.bind(this);
        this.onDragEnter = this.onDragEnter.bind(this);
        this.onDragLeave = this.onDragLeave.bind(this);
        this.onDragOver = this.onDragOver.bind(this);
        this.onDrop = this.onDrop.bind(this);

        this.state = {
            isDragActive: false
        };
    }

    onDragEnter(e) {
        e.preventDefault();

        ++this.enterCounter;

        // During drag dragTransfer.files is null but Chrome has drag store with actual drag files
        const dataTransferItems = e.dataTransfer && e.dataTransfer.items ? e.dataTransfer.items : [];

        // conversion to Array
        const allFilesAccepted = this.allFilesAccepted(Array.prototype.slice.call(dataTransferItems));

        this.setState({
            isDragActive: allFilesAccepted,
            isDragReject: !allFilesAccepted
        });

        if (this.props.onDragEnter) {
            this.props.onDragEnter.call(this, e);
        }
    }

    onDragOver(e) {
        e.preventDefault();
        e.stopPropagation();
        return false;
    }

    onDragLeave(e) {
        e.preventDefault();

        if (--this.enterCounter > 0) {
            return;
        }

        this.setState({
            isDragActive: false,
            isDragReject: false
        });

        if (this.props.onDragLeave) {
            this.props.onDragLeave.call(this, e);
        }
    }

    onDrop(e) {
        e.preventDefault();

        this.enterCounter = 0;

        this.setState({
            isDragActive: false,
            isDragReject: false
        });

        const droppedFiles = e.dataTransfer ? e.dataTransfer.files : e.target.files;
        const max = this.props.multiple ? droppedFiles.length : 1;
        const files = [];

        for (let i = 0; i < max; i++) {
            const file = droppedFiles[i];

            if (this.isFileAccept(file)) {
                //todo disable preview for big files !!! - specify limit
                if (!this.props.disablePreview) {
                    file.preview = window.URL.createObjectURL(file);
                }

                files.push(file);
            }
        }

        if (this.props.onDrop && files.length > 0) {
            this.props.onDrop.call(this, files, e);
        }
    }

    onClick() {
        this.fileInput.value = null;
        this.fileInput.click();
    }

    isFileAccept(file) {
        return accepts(file, this.props.accept);
    }
    allFilesAccepted(files) {
        return files.every(file => accepts(file, this.props.accept));
    }

    render() {
        const {accept, activeClassName, inputProps, multiple, rejectClassName, buttonProps, buttonLabel, ...rest} = this.props;

        let {className,
            buttonClassName,
            ...props // eslint-disable-line prefer-const
            } = rest;

        const { isDragActive, isDragReject } = this.state;

        className = className || '';

        if (isDragActive && activeClassName) {
            className += ' ' + activeClassName;
        }
        if (isDragReject && rejectClassName) {
            className += ' ' + rejectClassName;
        }

        buttonClassName = buttonClassName || '';

        const inputAttributes = {
            accept,
            type: 'file',
            style: { display: 'none' },
            multiple: supportMultiple && multiple,
            ref: el => this.fileInput = el,
            onChange: this.onDrop
        };

        return (
            <div className={className} {...props}
                onDragEnter={this.onDragEnter}
                onDragOver={this.onDragOver}
                onDragLeave={this.onDragLeave}
                onDrop={this.onDrop}>

                {this.props.children}

                <input {...inputProps} {...inputAttributes} />
                <button type="button"
                        className={buttonClassName} {...buttonProps}
                        onClick={this.onClick}>{buttonLabel}</button>
            </div>
        );
    }

}