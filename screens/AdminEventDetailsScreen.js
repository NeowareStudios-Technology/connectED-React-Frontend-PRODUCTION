import React, { Component } from 'react';
import { Text, StyleSheet, View, FlatList, TouchableOpacity, Image, LayoutAnimation, Button } from "react-native";

export default class AdminEventDetails extends Component {
    render() {
        const { item } = this.props.navigation.state.params
        console.warn(this.props.navigation.state.params.item)
        return (
            <View>
                {item ? 
                <View style={styles.container}>
                    <Text style={styles.title}>{item.e_title}</Text>
                    <Text style={styles.header}>General Info</Text>
                    <Text>{item.date[0]} {item.start[0]}</Text>
                    <Text>{item.street} {`\n`}{item.city}, {item.state} {item.zip_code}</Text>
                    <Text style={styles.header}>Event Roster Info</Text>
                    <Text style={styles.sub}>Event Capacity: {item.capacity}</Text>
                    <Text style={styles.sub}>Registered: {item.num_attendees}</Text>
                    <Text style={styles.sub}>Pending: {item.num_pending_attendees}</Text>
                    {item.num_attendees > 0 ?
                    <View>
                        <Text style={styles.header}>Attending Volunteers</Text>
                        {item.attendees.map((a, index)=>(
                            <View key={index} style={{flexDirection: "row"}}>
                                <Text>{a}</Text>
                            </View>

                        ))}

                    </View>
                    :null}
                    {item.num_pending_attendees > 0 ? 
                    <View>
                        <Text style={styles.header}>Pending Volunteers</Text>
                        {item.pending_attendees.map((a, index)=>(
                            <View key={index} style={{flexDirection: "row"}}>
                                <Text>{a}</Text>
                                <Button
                                    onPress={()=>alert(`TODO: accept ${a} to Event`)}
                                    title="Accept"
                                    color="green"
                                    accessibilityLabel="Accept volunteer to this Event"
                                />
                                <Button
                                    onPress={()=>alert(`TODO: deny ${a} to Event`)}
                                    title="Deny"
                                    color="red"
                                    accessibilityLabel="Deny volunteer to this Event"
                                />
                            </View>
                        ))}
                    </View>
                :null}
                </View>
                :null}
            </View>
        );
    }
}
styles={
    container: {
        paddingLeft: 20,
        paddingRight: 20,
        paddingTop:20,
        paddingBottom: 20,
        fontSize: 16
    },
    title: {
        fontSize: 26,
        fontWeight: 'bold',
        paddingBottom: 5
    },
    sub: {
        fontSize: 16,
        fontWeight: "bold",
        paddingBottom: 5,
        paddingTop: 5,
    },
    header: {
        backgroundColor: "#eee", 
        paddingTop:5, 
        paddingBottom: 5, 
        textAlign: "center"
    }

}