import React, { Component } from 'react';
import { connect } from 'react-redux';

class HomeFooter extends Component {

    render() {
       
        return (
                <div className='home-footer'>
                    <p>&copy; 2021 Tran Quoc Tinh <a target='_blank' href='https://github.com/Tran-development'>More</a></p>
                    
                </div>
        );
    }

}

const mapStateToProps = state => {
    return {
        isLoggedIn: state.user.isLoggedIn,
        language: state.app.language,
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(HomeFooter);
