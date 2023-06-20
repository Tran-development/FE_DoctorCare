import React, { Component } from 'react';
import { connect } from 'react-redux';

class About extends Component {

    render() {
       
        return (
                <div className='section-share section-about'>
                    <div className='section-about-header'>
                        Tầm quan trọng của việc nuôi lớn trẻ
                    </div>
                    <div className='section-about-content'>
                        <div className='content-left'>
                        <iframe
                            width="100%"
                            height="400"
                            src="https://www.youtube.com/embed/5fUFyFP3NZc"
                            title="TẦM QUAN TRỌNG CỦA VIỆC CHĂM SÓC SỨC KHỎE TỪ TRẺ" 
                            frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                            allowFullScreen>                            
                        </iframe>
                        </div>
                        <div className='content-right'>
                            <p>
                            Sự sống còn của trẻ em là trọng tâm của những gì UNICEF làm. 
                            Tại Việt Nam, chúng tôi tập trung vào sự sống còn và phát triển của trẻ nhỏ, tập trung chủ yếu vào các lĩnh vực như tiêm chủng, sức khỏe trẻ em, dinh dưỡng và nước sạch vệ sinh.
                            </p>
                        </div>
                    </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(About);
