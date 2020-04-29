import React from 'react'
import { Text } from 'react-native'
import moment from 'moment'
import { AnimatedCircularProgress } from 'react-native-circular-progress';


export default function ReadinessCard(props) {
    props = props.props
    return (
        <>
            <Text>{`${props.label}:`}</Text>
            <AnimatedCircularProgress
                size={50}
                width={3}
                fill={props.percentile*100}
                rotation={0}
                tintColor={ 
                    (props.percentile < .33) ? "#FE4A49" :
                    (props.percentile >= .33 && props.percentile < .66) ? "#F3DE2C" :
                    '#74C365'
                }
                backgroundColor="#29335C">
                {
                    (fill) => (
                        <Text>
                            {`${props.currentValue.toFixed(0)}`}
                        </Text>
                    )
                }
            </AnimatedCircularProgress>
            <Text>{`${moment(props.createdAt).fromNow()}`}</Text>
            <Text></Text>
        </>
    )

}