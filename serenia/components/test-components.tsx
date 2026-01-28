import React from 'react'
import {View, Text, StyleSheet} from 'react-native'
import { green } from 'react-native-reanimated/lib/typescript/Colors'

class test extends React.Component {
    render() {
        const title = "Ceci est un test"

        return (
            <View style={styles.container}>
                <Text>{title}</Text>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container : {backgroundColor:"green"}
})

export default test