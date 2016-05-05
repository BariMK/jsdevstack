import React, {PropTypes} from 'react'
import {PureRenderComponent} from './base'
import { Link } from 'react-router'
import EditableBox from './editor/editable'
import editable from '../types/editable'
import {makeApiUrl} from '../createAction'

export default class PopupHeader extends PureRenderComponent {

    static propTypes = {
        data: PropTypes.object.isRequired,
        changed: PropTypes.bool,
        onImgChanged: PropTypes.func,
        onSubmit: PropTypes.func,
        linkTo: PropTypes.string,
        caption: PropTypes.string,
        img: PropTypes.string
    };

    render() {

        return (
            <EditableBox
                data={this.props.data}
                viewPanel={<ViewHeader {...this.props}/>}
                editPanel={<EditableHeader {...this.props}/>}/>
        )
    }
}

class EditableHeader extends PureRenderComponent {

    static propTypes = {
        changed: PropTypes.bool,
        onImgChanged: PropTypes.func,
        onSubmit: PropTypes.func,
        linkTo: PropTypes.string,
        caption: PropTypes.string,
        img: PropTypes.string
    };

    onClick() {
        this.fileInput.value = null;
        this.fileInput.click();
    }

    onFilePick(e) {
        e.preventDefault();

        const droppedFiles = e.dataTransfer ? e.dataTransfer.files : e.target.files;
        const file = droppedFiles[0];

        file.preview = window.URL.createObjectURL(file);

        this.props.onImgChanged(file);
    }

    render() {
        const {linkTo, changed, img, caption} = this.props;

        const inputAttributes = {
            accept: 'image/*',
            type: 'file',
            style: { display: 'none' },
            multiple: false,
            ref: el => this.fileInput = el,
            onChange: this.onFilePick.bind(this)
        };

        const buttonClass = changed ? 'active' : 'disabled';

        return (
            <div className="width100 height100">

                {img ? <img src={makeApiUrl(img)} alt={caption} /> : null}

                <button type="button" className={"pull-right btn btn-primary saveButton " + buttonClass} onClick={this.props.onSubmit}>Save</button>
                <span className="pull-left uploadIcon glyphicon glyphicon-camera" aria-hidden="true" onClick={this.onClick.bind(this)}/>
                <input {...inputAttributes} />

                {caption && linkTo ?
                    <Link className="caption" to={linkTo}>
                        <h2>{caption}<span className="glyphicon glyphicon-pencil" aria-hidden="true"/></h2>
                    </Link> :
                    <h2 className="caption">{caption}</h2>}
            </div>
        )
    }
}

class ViewHeader extends PureRenderComponent {

    static propTypes = {
        data: PropTypes.object.isRequired,
        caption: PropTypes.string,
        img: PropTypes.string
    };

    render() {
        const {caption, img} = this.props;

        return (
            <div className="width100 height100">
                {img ? <img src={makeApiUrl(img)} alt={caption} /> : null}
                <h2 className="caption">{caption}</h2>
            </div>
        )
    }
}
