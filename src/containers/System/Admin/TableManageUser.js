import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import './TableManageUser.scss';
import * as actions from '../../../store/actions';
import MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite';
// import style manually
import 'react-markdown-editor-lite/lib/index.css';

// Register plugins if required
// MdEditor.use(YOUR_PLUGINS_HERE);

// Initialize a markdown parser
const mdParser = new MarkdownIt(/* Markdown-it options */);

// Finish!
function handleEditorChange({ html, text }) {
  console.log('handleEditorChange', html, text);
}

class TableManageUser extends Component {

    // khi component duoc render thi no se check ham constructor dau tien
    constructor(props) {
        super(props);
        this.state = {
            usersRedux: [], // luu tru cac gia tri user lay tu redux ve
        }
    }

    componentDidMount() {
        this.props.fetchUserRedux()
    }

    componentDidUpdate(prevProps, prevState) { // chay sau khi ham render xay ra
        if (prevProps.listUsers !== this.props.listUsers) {
            this.setState({
                usersRedux: this.props.listUsers
            })
        }
    }

    handleDeleteUser = (userId) => {
        console.log('delete', userId);
        this.props.deleteUserRedux(userId.id)
    }
    
    handleEditUser = (user) => {
        this.props.handleEditUserFromParent(user)
    }

    /**
     * Lifecycle
     * Run component:
     * 1. Run constructor -> init state
     * 2. Did mount (set state)
     * 3. Render component
     */


    render() {
        let arrUsers = this.state.usersRedux
        return (
           <React.Fragment>
             <table id='table-manage-user'>
                <tbody>
                    <tr>
                        <th>Email</th>
                        <th>Firstname</th>
                        <th>Lastname</th>
                        <th>Address</th>
                        <th>Actions</th>
                    </tr>
                    {arrUsers && arrUsers.length > 0 &&
                        arrUsers.map((item, index) => {
                            return (
                                <tr key={index}>
                                    <td>{item.email}</td>
                                    <td>{item.firstName}</td>
                                    <td>{item.lastName}</td>
                                    <td>{item.address}</td>
                                    <td>
                                        <button
                                        onClick={() => this.handleEditUser(item)}
                                        className='btn-edit'
                                        ><i className='fas fa-pencil-alt'></i></button>
                                        <button
                                        onClick={() => this.handleDeleteUser(item)}
                                        className='btn-delete'
                                        ><i className='fas fa-trash'></i></button>
                                    </td>
                                </tr>
                            )
                        })
                    }                  

                </tbody>
            </table>
            <MdEditor style={{ height: '500px' }} renderHTML={text => mdParser.render(text)} onChange={handleEditorChange} />
           </React.Fragment>
        );
    }

}

const mapStateToProps = state => {
    return {
        // hung kq
        listUsers: state.admin.users
    };
};

const mapDispatchToProps = dispatch => {
    return {
        fetchUserRedux: () => dispatch(actions.fetchAllUsersStart()),
        deleteUserRedux: (id) => dispatch(actions.deleteUser(id))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(TableManageUser);
