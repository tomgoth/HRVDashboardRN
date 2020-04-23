import React from "react";
import { StyleSheet, View } from "react-native";
import { VictoryBar, VictoryChart } from "victory-native";

const data = [
  { quarter: 1, earnings: 13000 },
  { quarter: 2, earnings: 16500 },
  { quarter: 3, earnings: 14250 },
  { quarter: 4, earnings: 19000 },
  { quarter: 4.5, earnings: 20000 },
];

export default class VictoryTest extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <VictoryChart width={350} >
          <VictoryBar data={data} x="quarter" y="earnings" />
        </VictoryChart>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5fcff"
  }
});

