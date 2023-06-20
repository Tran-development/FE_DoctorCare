import React, { Component } from 'react';
import { connect } from "react-redux";
import { FormattedMessage } from 'react-intl';
import './ManageSpecialty.scss'
import MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite';
import { CommonUtils } from '../../../utils';
import { createNewSpecialty } from '../../../services/userService';
import { toast } from "react-toastify"

const mdParser = new MarkdownIt(/* Markdown-it options */);

class ManageSpecialty extends Component {

    constructor(props) {
        super(props)
        this.state = {
            name: '',
            imageBase64: '',
            desHTML: '',
            desMarkdown: ''
        }
    }

    async componentDidMount() {

    }

    async componentDidUpdate(prevProps, prevState, snapshot) { // chay sau khi ham render xay ra
        
    }

    handleOnChangeInput = (e, id) => {
        let stateCopy = {...this.state}
        stateCopy[id] = e.target.value
        this.setState({
           ...stateCopy
        })
    }

    // ham cua thu vien
    handleEditorChange = ({ html, text }) => {
        this.setState({
            desHTML: html,
            desMarkdown: text
        })
    }

    handleOnChangeImg = async (e) => {
        let data = e.target.files
        let file = data[0]
        if (file) {
            let base64 = await CommonUtils.getBase64(file)
            this.setState({
                imageBase64: base64,
            })
        }
    }

    handleSaveNewSpecialty = async() => {
        let res = await createNewSpecialty(this.state)
        if (res && res.errCode === 0) {
            toast.success('Add new specialty successfully')
            this.setState({
                name: '',
                imageBase64: '',
                desHTML: '',
                desMarkdown: ''
            })
        } else {
            toast.error('Failed !')
            console.log('check res from specialty', res);
        }
    }

    render() {
        return (
            <div className='manage-specialty-container'>
            <div className='ms-title'>Quản lý chuyên khoa</div>
                
                <div className='add-new-specialty row'>
                <div className='col-6 form-group'>
                    <label>Ten chuyen khoa</label>
                    <input className='form-control' type='text' value={this.state.name}
                        onChange={(e) => this.handleOnChangeInput(e, 'name')}
                    />
                </div>
                <div className='col-6 form-group'>
                    <label>Anh chuyen khoa</label>
                    <input className='form-control-file' type='file'
                        onChange={(e) => this.handleOnChangeImg(e)}
                    />
                </div>
                <div className='col-12'>
                    <MdEditor
                            style={{ height: '300px' }}
                            renderHTML={text => mdParser.render(text)}
                            onChange={this.handleEditorChange}
                            value={this.state.desMarkdown}
                    />
                </div>
                <div className='col-12'>
                    <button className='btn-save-specialty'
                        onClick={() => this.handleSaveNewSpecialty()}
                    >
                    Save
                    </button>
                </div>
                </div>

            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        language: state.app.language,
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ManageSpecialty);
