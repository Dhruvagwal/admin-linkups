import React from 'react'
import { StyleSheet} from 'react-native'
import StepIndicator from 'react-native-step-indicator';
import moment from 'moment';
import DateFormat from 'hooks/DateFormat'
import color from 'colors'


const StatusTracker = ({data}) => {
    var currentPosition, labels
    if (data.status==='inprogress'){
        currentPosition = 0
        labels = [
            `Inprogress\n${DateFormat(data.startsOn)}\n${moment(data.startsOn).format('LT')}`,
            `Completed`,
            `Paid`
        ];
    }
    else if (data.status==='completed'){
        currentPosition = 1
        labels = [
            `Inprogress\n${DateFormat(data.startsOn)}\n${moment(data.startsOn).format('LT')}`,
            `Completed\n${DateFormat(data.endsOn)}\n${moment(data.endsOn).format('LT')}`,
            `Paid`
        ];
    }
    else if (data.status==='paid'){
        currentPosition = 2
        labels = [
            `Inprogress\n${DateFormat(data.startsOn)}\n${moment(data.startsOn).format('LT')}`,
            `Completed\n${DateFormat(data.endsOn)}\n${moment(data.endsOn).format('LT')}`,
            `Paid\n${DateFormat(data.paidOn)}\n${moment(data.paidOn).format('LT')}`
        ];
    }
    return (
        <StepIndicator
            customStyles={customStyles}
            currentPosition={currentPosition}
            stepCount={3}
            labels={labels}
        />
    )
}

export default StatusTracker

const styles = StyleSheet.create({})


const customStyles = {
    stepIndicatorSize: 25,
    currentStepIndicatorSize:30,
    separatorStrokeWidth: 2,
    currentStepStrokeWidth: 0,
    stepStrokeCurrentColor: color.blue,
    stepStrokeWidth: 0,
    stepStrokeFinishedColor: color.blue,
    stepStrokeUnFinishedColor: color.lightDark,
    separatorFinishedColor: color.blue,
    separatorUnFinishedColor: color.lightDark,
    stepIndicatorFinishedColor: color.blue,
    stepIndicatorUnFinishedColor: color.lightDark,
    stepIndicatorCurrentColor:color.blue,
    stepIndicatorLabelFontSize: 13,
    currentStepIndicatorLabelFontSize: 13,
    stepIndicatorLabelCurrentColor: color.white,
    stepIndicatorLabelFinishedColor: color.white,
    stepIndicatorLabelUnFinishedColor: color.inActive,
    labelColor: color.inActive,
    labelSize: 10,
    currentStepLabelColor: color.blue,
    labelFontFamily:'Montserrat-Regular'
  }