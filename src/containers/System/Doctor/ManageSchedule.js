import React, { Component } from 'react';
import { connect } from "react-redux";
import './ManageSchedule.scss';
import { FormattedMessage } from 'react-intl';
import Select from 'react-select';
import * as actions from '../../../store/actions';
import { CRUD_ACTIONS, LANGUAGES, dateFormat } from '../../../utils';
import DatePicker from '../../../components/Input/DatePicker';
import moment from 'moment'; // format date
import { toast } from "react-toastify"
import _ from 'lodash';
import { saveBulkScheduleDoctor } from '../../../services/userService'

class ManageSchedule extends Component {

    constructor(props) {
        super(props);
        // const currDate = new Date()
        // currDate.setHours(0, 0, 0, 0)
        this.state = {
            listDoctors: [],
            selectedOptionDoctor: {},
            currDate: '',
            rangeTime: []
        }
    }

    componentDidMount() { // ham chay dau tien sau khi ung dung chay
        this.props.fetchAllDoctors()
        this.props.fetchAllScheduleTime()
    }

    componentDidUpdate(prevProps, prevState) { // chay sau khi ham render xay ra
        if (prevProps.allDoctors !== this.props.allDoctors) {
            let dataSelect = this.buildDataInputSelect(this.props.allDoctors)
            this.setState({
                listDoctors: dataSelect
            })
        }
        if (prevProps.allScheduleTime !== this.props.allScheduleTime) {
            let data = this.props.allScheduleTime
            if (data && data.length > 0) {
                // data = data.map(item => {
                //     item.isSelected = false
                //     return item
                // })

                data = data.map(item => ({...item, isSelected: false}))
            }

            this.setState({
                rangeTime: data
            })
        }
    }

    buildDataInputSelect = (inputData) => {
        let result = []
        let { language } = this.props
        if (inputData && inputData.length > 0) {
            inputData.map((item, index) => {
                let object = {}
                let labelVi = `${item.lastName} ${item.firstName}`
                let labelEn = `${item.firstName} ${item.lastName}`

                object.label = language === LANGUAGES.VI ? labelVi : labelEn
                object.value = item.id
                result.push(object)
            })
        }
    return result
    }
    
    handleChangeSelect = async (selectedDoctor) => {
        this.setState({ selectedOptionDoctor: selectedDoctor })
    };

    handleOnChangeDatePicker = (date) => {
        this.setState({ 
            currDate: date[0]
        })
    }

    handleClickBtnTime = (time) => {
        let { rangeTime } = this.state
        if (rangeTime && rangeTime.length > 0) {
            rangeTime = rangeTime.map(item => {
                if (item.id === time.id) item.isSelected = !item.isSelected
                return item
            })
            this.setState({
                rangeTime: rangeTime
            })
        }
    }

    handleSaveSchedule = async () => {
        let { rangeTime, selectedOptionDoctor, currDate } = this.state
        let result = []

        if (!currDate) {
            toast.error("Invalid date!")
            return
        }

        if (selectedOptionDoctor && _.isEmpty(selectedOptionDoctor)) {
            toast.error("Invalid selected doctor!")
            return
        }

        // let formattedDate = moment(currDate).format(dateFormat.SEND_TO_SERVER)
        // let formattedDate = moment(currDate).unix()
        let formattedDate = new Date(currDate).getTime()

        console.log('check state', this.state);

        if (rangeTime && rangeTime.length > 0) {
            let selectedTime = rangeTime.filter(item => item.isSelected === true)

            if (selectedTime && selectedTime.length > 0) {
                selectedTime.map((schedule, index) => {
                    // console.log('check schedule', schedule,index,selectedOptionDoctor)
                    let object = {}
                    object.doctorId = selectedOptionDoctor.value
                    object.date = formattedDate
                    object.timeType = schedule.keyMap
                    result.push(object)
                })
            } else {
                toast.error("Invalid selected time!")
                return
            }
        }

        let res = await saveBulkScheduleDoctor({
            arrSchedule: result,
            doctorId: selectedOptionDoctor.value,
            formattedDate: formattedDate
        })
        
        if (res && res.errCode === 0) {
            toast.success("Save information succeed!")
        } else {
            toast.error("Error saveBulkScheduleDoctor")
            // console.log("Error saveBulkScheduleDoctor >> res: ", res);
        }

    }

    render() {
        let { rangeTime } = this.state
        let { language } = this.props
        return ( 
            <div className='manage-schedule-container'>
                <div className='m-s-title'>
                    <FormattedMessage id="manage-schedule.title"/>
                </div>
                <div className='container'>
                    <div className='row'>
                        <div className='col-4 form-group'>
                            <label><FormattedMessage id="manage-schedule.choose-doctor"/></label>
                            <Select
                            value={this.state.selectedOptionDoctor}
                            onChange={this.handleChangeSelect}
                            options={this.state.listDoctors}
                            />
                        </div>
                        <div className='col-4 form-group'>
                        <label><FormattedMessage id="manage-schedule.choose-date"/></label>
                            <DatePicker
                                onChange={this.handleOnChangeDatePicker}
                                className="form-control"
                                value={this.state.currDate}
                                minDate={new Date().setHours(0,0,0,0) }
                            />
                        </div>
                        <div className='col-12 pick-hour-container'>
                            {rangeTime && rangeTime.length > 0 &&
                                rangeTime.map((item, i) => {
                                    return (
                                        <button 
                                        className={item.isSelected === true ? 
                                        "btn btn-schedule active" : "btn btn-schedule"
                                        }
                                        key={i}
                                        onClick={() => this.handleClickBtnTime(item)}
                                        >
                                        {language === LANGUAGES.VI ? item.valueVi : item.valueEn}
                                        </button>
                                    )
                                })
                            }
                        </div>
                        <div className='col-12'>
                            <button className='btn btn-primary btn-save-schedule'
                            onClick={ ()=> this.handleSaveSchedule()}
                            >
                                <FormattedMessage id="manage-schedule.save"/>
                            </button>
                        </div>
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
        // hung kq
        allDoctors: state.admin.allDoctors,
        allScheduleTime: state.admin.allScheduleTime,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        fetchAllDoctors: () => dispatch(actions.fetchAllDoctors()),
        fetchAllScheduleTime: () => dispatch(actions.fetchAllScheduleTime()),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ManageSchedule);
