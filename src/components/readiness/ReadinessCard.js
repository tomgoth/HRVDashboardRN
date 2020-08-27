import React from 'react'
import { Text, View, StyleSheet } from 'react-native'
import moment from 'moment'
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import { faCalculator } from '@fortawesome/free-solid-svg-icons';


export default function ReadinessCard(props) {
    const { percentile, label, currentValue, createdAt } = props.item
    const { domain } = props
    return (
        <View style={styles.subChartsContainer}>
                    
                    <AnimatedCircularProgress
                        style={styles.subCharts}
                        size={75}
                        width={5}
                        fill={percentile*100}
                        rotation={0}
                        tintColor={ 
                            (percentile < .33) ? "#FE4A49" :
                            (percentile >= .33 && percentile < .66) ? "#F3DE2C" :
                            '#74C365'
                        }
                        backgroundColor="#29335C">
                        {
                            (fill) => (
                                <Text style={styles.subChartValues}>
                                    {`${currentValue.toFixed(0)}`}
                                </Text>
                            )
                        }
                    </AnimatedCircularProgress>
                    <Text style={styles.subChartTitle}>{`${label}`}</Text>
                    {(domain === 0) ? 
                    <Text style={styles.subChartTime}>{`${moment(createdAt).fromNow()}`}</Text> :
                    <Text style={styles.subChartTime}>{`${domain} hour average`}</Text>}  
        </View>
    )

}

const styles = StyleSheet.create({
    subChartsContainer: {
        width: '50%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    subCharts: {
        marginBottom: 5
    },
    subChartTitle: {
        color: '#fff',
        textAlign: 'center',
        marginTop: 10,
        width: 150,
        justifyContent: 'center'
    },
    subChartTime: {
        color: '#fff',
        textAlign: 'center',
        marginTop: 8,
        marginBottom: 15,
        fontSize: 12
    },
    subChartValues: {
        color: '#fff',
        fontSize: 20,
        
    }

})