import React, { Component } from 'react';
import { connect } from "react-redux";
import { FormattedMessage } from 'react-intl';
import './BookingModal.scss';
import { Modal } from 'reactstrap';
import ProfileDoctor from '../ProfileDoctor';
import _ from 'lodash';
import DatePicker from '../../../../components/Input/DatePicker'
import * as actions from '../../../../store/actions'
import { LANGUAGES } from '../../../../utils';
import Select from 'react-select';
import { postPatientBookApointment } from '../../../../services/userService'
import { toast } from "react-toastify"
import moment from 'moment';



class BookingModal extends Component {

    constructor(props) {
        super(props)
        this.state = {
            fullName: '',
            phoneNumber: '',
            email: '',
            address: '',
            reason: '',
            birthday: '',
            selectedGender: '',
            doctorId: '',
            genders: '',
            timeType: '',
        }
    }

    async componentDidMount() {
        this.props.getGenders()
    }

    buildDataGender = (data) => {
        let result = []
        let language =  this.props.language

        if (data && data.length > 0) {
            data.map(item => {
                let object = {}
                object.label = language === LANGUAGES.VI ? item.valueVi : item.valueEn
                object.value =  item.keyMap
                result.push(object)
            })
        }
        return result
    }

    async componentDidUpdate(prevProps, prevState, snapshot) { 
        // when change language
        if (this.props.language !== prevProps.language) {
            this.setState({
                genders: this.buildDataGender(this.props.genders)
            })
        }
        if (this.props.genders !== prevProps.genders) {            
            this.setState({
                genders: this.buildDataGender(this.props.genders)
            })
        }
        if (this.props.dataTime !== prevProps.dataTime) {
            if (this.props.dataTime && !_.isEmpty(this.props.dataTime)) {
                console.log('check dateTimeee ', this.props.dataTime);
                let doctorId = this.props.dataTime.doctorId
                let timeType = this.props.dataTime.timeType
                this.setState({
                    doctorId: doctorId,
                    timeType: timeType
                })
            }
        }
    }

    handleOnChangeInput = (e, id) => {
        let valueInput = e.target.value
        let stateCopy = {...this.state}
        stateCopy[id] = valueInput // modify state
        this.setState({
            ...stateCopy,
        })
    }

    handleOnChangeDatePicker = (date) => {
        this.setState({
            birthday: date[0]
        })
    }

    handleChangeSelect = (selectedOption) => {
        this.setState({ selectedGender: selectedOption})
    }
    
    capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1)
    }

    buildDataBooking = (dataTime) => {
        let { language } = this.props
        if (dataTime && !_.isEmpty(dataTime)) {
            let time = language === LANGUAGES.VI ? dataTime.timeTypeData.valueVi : dataTime.timeTypeData.valueEn

            // convert 1 chuoi str sang kieu Date cua js
            let date = language === LANGUAGES.VI ?
            this.capitalizeFirstLetter(moment.unix(+dataTime.date / 1000).format('dddd - DD/MM/YYYY'))
            : 
            moment.unix(+dataTime.date / 1000).locale('en').format('ddd - MM/DD/YYYY')
            return `${time} - ${date}`
        }
        return ''
    }

    buildDoctorName = (dataTime) => {
        let { language } = this.props
        if (dataTime && !_.isEmpty(dataTime)) {
            
            let name = language === LANGUAGES.VI ?
            `${dataTime.doctorData.lastName} ${dataTime.doctorData.firstName}` :
            `${dataTime.doctorData.firstName} ${dataTime.doctorData.lastName}`
            
            return name
        }
        return ''
    }

    handleConfirmBooking = async() => {
        // validate input
        let date = new Date(this.state.birthday).getTime() // convert string to unix
        let timeString =  this.buildDataBooking(this.props.dataTime)
        let doctorName = this.buildDoctorName(this.props.dataTime)

        // console.log("aaaa", this.props.dataTime);
        // return 
        let res = await postPatientBookApointment({
            fullName: this.state.fullName,
            phoneNumber: this.state.phoneNumber, //this.state.fullName
            email: this.state.email,
            address: this.state.address,
            reason: this.state.reason,
            date: this.props.dataTime.date,
            birthday: date,
            selectedGender: this.state.selectedGender.value,
            doctorId: this.state.doctorId,
            timeType: this.state.timeType,
            language: this.props.language,
            timeString: timeString,
            doctorName: doctorName
        })
        if (res && res.errCode === 0) {
            toast.success("Booking a new appointment succeed!")
            this.props.closeBookingModal()
        } else {
            toast.error("Booking a new appointment error!")
        }
        console.log('check state5 ', this.state);
    }


    render() {
        //toggle={} 
        let {isOpenModalBooking, closeBookingModal, dataTime} = this.props
        let doctorId = ''
        if (dataTime && !_.isEmpty(dataTime)) {
            doctorId = dataTime.doctorId
        }
        // fullName: '',
        //     phoneNumber: '',
        //     email: '',
        //     address: '',
        //     reason: '',
        //     birthday: '',
        //     gender: '',
        //     doctorId: '',
        return (
            <Modal
                isOpen={isOpenModalBooking}
                className={"booking-modal-container"}
                size="lg"
                centered
            >
            <div className='booking-modal-content'>
                <div className='booking-modal-header'>
                <span className='left'>
                    <FormattedMessage id="patient.booking-modal.title"/>
                </span>
                    <span 
                        className='right'
                        onClick={closeBookingModal}
                    >
                        <i className='fas fa-times'></i>
                    </span>
                </div>
                <div className='booking-modal-body'>
                    <div className='doctor-infor'>
                        <ProfileDoctor
                            doctorId={doctorId}
                            isShowDescriptionDoctor={false}
                            dataTime={dataTime}
                            isShowLinkDetail={false}
                            isShowPrice={true}
                        />
                    </div>
                    <div className='row'>
                        <div className='col-5 form-group'>
                            <label><FormattedMessage id="patient.booking-modal.fullName"/></label>
                            <input className='form-control'
                                value={this.state.fullName}
                                onChange={(e) => this.handleOnChangeInput(e, 'fullName')}
                            />
                        </div>
                        <div className='col-5 form-group'>
                            <label><FormattedMessage id="patient.booking-modal.phoneNumber"/></label>
                            <input className='form-control'
                                value={this.state.phoneNumber}
                                onChange={(e) => this.handleOnChangeInput(e, 'phoneNumber')}
                            />
                        </div>
                        <div className='col-5 form-group'>
                            <label><FormattedMessage id="patient.booking-modal.email"/></label>
                            <input className='form-control'
                                value={this.state.email}
                                onChange={(e) => this.handleOnChangeInput(e, 'email')}
                            />
                        </div>
                        <div className='col-5 form-group'>
                            <label><FormattedMessage id="patient.booking-modal.address"/></label>
                            <input className='form-control'
                                value={this.state.address}
                                onChange={(e) => this.handleOnChangeInput(e, 'address')}
                            />
                        </div>
                        <div className='col-10 form-group'>
                            <label><FormattedMessage id="patient.booking-modal.reason"/></label>
                            <input className='form-control'
                                value={this.state.reason}
                                onChange={(e) => this.handleOnChangeInput(e, 'reason')}
                            />
                        </div>
                        <div className='col-5 form-group'>
                            <label><FormattedMessage id="patient.booking-modal.birthday"/></label>
                            <DatePicker
                                onChange={this.handleOnChangeDatePicker}
                                className="form-control"
                                value={this.state.birthday}
                                minDate={new Date().setHours(0,0,0,0) }
                            />
                        </div>
                        <div className='col-5 form-group'>
                            <label><FormattedMessage id="patient.booking-modal.gender"/></label>
                            <Select
                                value={this.state.selectedGender}
                                onChange={this.handleChangeSelect}
                                options={this.state.genders} 
                            />
                        </div>
                    </div>
                </div>
                <div className='booking-modal-footer'>
                    <button className='btn-booking-confirm'
                        onClick={() => this.handleConfirmBooking()}
                    >
                    <FormattedMessage id="patient.booking-modal.btnSubmit"/>
                    </button>
                    <button 
                        className='btn-booking-cancel'
                        onClick={closeBookingModal}
                    >
                        <FormattedMessage id="patient.booking-modal.btnCancel"/>
                    </button>
                </div>

            </div>
            </Modal> 
        );
    }
}

const mapStateToProps = state => {
    return {
        language: state.app.language,
        genders: state.admin.genders,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        getGenders: () => dispatch(actions.fetchGenderStart())
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(BookingModal);
