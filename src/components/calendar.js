import React, {useState} from 'react'
import { StyleSheet, Text, View } from 'react-native'

import DatePicker from 'react-native-datepicker'
import color from 'colors'

const calendar = ({date, setDate}) => {
    const currentDate = `${new Date().getUTCDate()}-${new Date().getUTCMonth()}-${new Date().getUTCFullYear()}`
    const maxDate = `${new Date().getUTCDate()}-${new Date().getUTCMonth()}-${new Date().getUTCFullYear()+1}`
    return (
        <DatePicker
            style={styles.container}
            date={date}
            mode="date"
            placeholder="select date"
            format="DD-MM-YYYY"
            minDate={currentDate}
            maxDate={maxDate}
            confirmBtnText="Confirm"
            cancelBtnText="Cancel"
            customStyles={{       
            dateIcon: {
                position: 'absolute',
                right: 0,
                top:1,
                marginLeft: 0,
            },
            dateInput: {
                marginRight: 55,
                backgroundColor:color.lightDark,
                borderRadius:10,
                borderWidth:0,

            }
            // ... You can check the source to find the other keys.
            }}
            onDateChange={(date) => setDate(date)}
      />
    )
}

export default calendar

const styles = StyleSheet.create({
    container:{
        color:color.white,
        width:'100%',
    }

})
