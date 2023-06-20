import React, { Component } from 'react';
import { connect } from "react-redux";
import { FormattedMessage } from 'react-intl';
import './ProfileDoctor.scss'
import { getProfileDoctorById } from '../../../services/userService'
import { LANGUAGES } from '../../../utils';
import NumberFormat from 'react-number-format';
import _ from 'lodash';
import moment from 'moment';
import { Link } from 'react-router-dom'

class ProfileDoctor extends Component {

    constructor(props) {
        super(props)
        this.state = {
            dataProfile: {}
        }
    }

    async componentDidMount() {
        let data = await this.getInforDoctor(this.props.doctorId)
        this.setState({
            dataProfile: data
        })
    }

    // xu ly bat dong bo
    getInforDoctor = async (id) => {
        let result = {}
        if (id) {
            let res = await getProfileDoctorById(id)
            if (res && res.errCode === 0) {
                result = res.data
            }
        }

        return result
    }

    async componentDidUpdate(prevProps, prevState, snapshot) { // chay sau khi ham render xay ra
        if (this.props.doctorId !== prevProps.doctorId) {
            // this.getInforDoctor(this.props.doctorId)

        }
    }

    capitalizeFirstLetter(dataTime) {
        return dataTime.charAt(0).toUpperCase() + dataTime.slice(1)
    }

    renderTimeBooking = (dataTime) => {
        let { language } = this.props
        if (dataTime && !_.isEmpty(dataTime)) {
            let time = language === LANGUAGES.VI ? dataTime.timeTypeData.valueVi : dataTime.timeTypeData.valueEn

            // convert 1 chuoi str sang kieu Date cua js
            let date = language === LANGUAGES.VI ?
            this.capitalizeFirstLetter(moment.unix(+dataTime.date / 1000).format('dddd - DD/MM/YYYY'))
            : 
            moment.unix(+dataTime.date / 1000).locale('en').format('ddd - MM/DD/YYYY')
            return (
                <>
                    <div>{time} - {date}</div>
                    <div><FormattedMessage id="patient.booking-modal.freeBooking"/></div>
                </>
            )
        }
        return <></>
    }

    render() {
        let { dataProfile } = this.state
        let { language, isShowDescriptionDoctor, dataTime, isShowLinkDetail, isShowPrice, doctorId } = this.props
        
        let nameVi = ''
        let nameEn = ''
        if (dataProfile && dataProfile.positionData) {
            nameVi = `${dataProfile.positionData.valueVi}, ${dataProfile.lastName} ${dataProfile.firstName}`
            nameEn = `${dataProfile.positionData.valueEn}, ${dataProfile.firstName} ${dataProfile.lastName}`
        }
        return (
            <div className='profile-doctor-container'>
                <div className='intro-doctor'>
                    <div
                        className='content-left'
                        style={{ backgroundImage: `url(${dataProfile && dataProfile.image ? dataProfile.image : ''})` }}
                    >

                    </div>
                    <div className='content-right'>
                        <div className='up-content'>
                            {language === LANGUAGES.VI ? nameVi : nameEn}
                        </div>
                        <div className='down-content'>
                        {isShowDescriptionDoctor === true ?
                        <>
                            {dataProfile && dataProfile.Markdown
                                    && dataProfile.Markdown.description
                                    && <span>
                                        {dataProfile.Markdown.description}
                                    </span>
                                }
                        </>
                        :
                        <>
                            {this.renderTimeBooking(dataTime)}
                        </>
                        }  
                        </div>
                    </div>                    
                </div>

                {isShowLinkDetail === true && 
                    <div className='view-detail-doctor'>
                        <Link to={`/detail-doctor/${doctorId}`}>Xem thêm</Link>
                    </div>
                }

                {isShowPrice === true && 
                <div className='price'>
                <FormattedMessage id="patient.booking-modal.priceBooking"/> 
                    { dataProfile && dataProfile.Doctor_Infor && language === LANGUAGES.VI &&                       
                        <NumberFormat
                                    className='currCy'
                                    value={dataProfile.Doctor_Infor.priceTypeData.valueVi }
                                    displayType={'text'}
                                    thousandSeparator={true}
                                    suffix={'VND'}
                                />                     
                    }
                    { dataProfile && dataProfile.Doctor_Infor && language === LANGUAGES.EN &&                         
                        <NumberFormat
                                    className='currCy'
                                    value={dataProfile.Doctor_Infor.priceTypeData.valueEn}
                                    displayType={'text'}
                                    thousandSeparator={true}
                                    suffix={'$'}
                                />                    
                    }
                    </div>
                }
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

export default connect(mapStateToProps, mapDispatchToProps)(ProfileDoctor);
