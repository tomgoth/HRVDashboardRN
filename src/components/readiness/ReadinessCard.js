import React from 'react'
import { Text } from 'react-native'
import moment from 'moment'
import { AnimatedCircularProgress } from 'react-native-circular-progress';


export default function ReadinessCard(props) {
    const { percentile, label, currentValue, createdAt } = props.item
    return (
        <>
            <Text>{`${label}:`}</Text>
            <AnimatedCircularProgress
                size={50}
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
                        <Text>
                            {`${currentValue.toFixed(0)}`}
                        </Text>
                    )
                }
            </AnimatedCircularProgress>
            <Text>{`${moment(createdAt).fromNow()}`}</Text>
            <Text></Text>
        </>
    )

}