import React from 'react'
import {StyleSheet, View} from 'react-native'
import { LineChart, Grid } from 'react-native-svg-charts'

import {Text} from 'styles'
import color from 'colors'
 
const LineChartView= ()=>{
    const data = [50, 10, 40, 95, -4, -24, 85, 91, 35, 53, -53, 24, 50, -20, -80]

    return (
        <LineChart
            style={{ height: 200 }}
            data={data}
            svg={{ stroke: color.blue }}
            showGrid={false}
            contentInset={{top:10}}
        >
            <Grid />
        </LineChart>
    )
}

export default LineChartView

const styles = StyleSheet.create({
})