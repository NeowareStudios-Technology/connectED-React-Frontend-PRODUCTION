import React, { Component } from 'react';
import { Text, StyleSheet, View, FlatList, TouchableOpacity, Image, LayoutAnimation, Button } from "react-native";

export default class AdminEventDetails extends Component {
    render() {
        const { item } = this.props.navigation.state.params
        console.warn(this.props.navigation.state.params.item)
        return (
            <View>
                {item ? 
                <View>
                    <Text>{item.e_title}</Text>
                    <Text>{item.date[0]}</Text>
                    <Text>Team Capacity: {item.capacity}</Text>
                    <Text>Registered: {item.num_attendees}</Text>
                    <Text>Pending: {item.num_pending_attendees}</Text>
                    {item.num_pending_attendees > 0 ? 
                    <View>
                        {item.pending_attendees.map((a, index)=>(
                            <View key={index}>
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