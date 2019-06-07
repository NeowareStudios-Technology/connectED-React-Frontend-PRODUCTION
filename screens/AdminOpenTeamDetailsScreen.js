import React, { Component } from 'react';
import { Text, StyleSheet, View, FlatList, TouchableOpacity, Image, LayoutAnimation, Button } from "react-native";
import User from "../components/User";

export default class AdminEventDetails extends Component {

    componentDidMount() {
        console.warn(this.props.navigation.state.params)
    }


    
    acceptOrDenyEventAttendee = async (organizer, title, status) =>{
        let token = await User.firebase.getIdToken();
        if (token) {
        let url =
        `https://connected-dev-214119.appspot.com/_ah/api/connected/v1/teams/${title}/${status}`;
        // status should either be "approve" or "deny"
        fetch(url, {
            method: "PUT",
            headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token
            }
        })
            .then(response => {

                // console.warn(response)

            if (response.ok) {
                alert("Success!")
            }
            })
            .catch(error => {
            console.warn("Error", error);
            });
        }
    }

    render() {
        let item = this.props.navigation.state.params
        return (
            <View style={styles.container}>
                    <Text style={styles.title}>{item.t_name}</Text>
                    <Text style={styles.header}>General Info</Text>
                    <Text style={styles.sub}>{item.t_city}, {item.t_state}</Text>
                    <Text>{item.t_desc}</Text>
                    <Text style={styles.header}>Team Roster Info</Text>
                    <Text style={styles.sub}>Registered: {item.t_member_num}</Text>
                    <Text style={styles.sub}>Pending: {item.t_pending_member_num}</Text>
                    {item.t_member_num > 0 ?
                    <View>
                        <Text style={styles.header}>Current Members</Text>
                        {item.t_members.map((a, index)=>(
                            <View key={index} style={{flexDirection: "row"}}>
                                <Text>{a}</Text>
                            </View>

                        ))}

                    </View>
                    :null}
                    {item.t_pending_member_num > 0 ? 
                    <View>
                        <Text style={styles.header}>Pending Members</Text>
                        {item.t_pending_members.map((a, index)=>(
                            <View key={index} style={{flexDirection: "row"}}>
                                <Text style={styles.sub}>{a}</Text>
                                <Button
                                    onPress={()=>this.acceptOrDenyEventAttendee(item.t_organizer, item.t_orig_name, "approve")}
                                    title="Accept"
                                    color="green"
                                    accessibilityLabel="Accept Member to this Team"
                                />
                                <Button
                                    onPress={()=>this.acceptOrDenyEventAttendee(item.t_organizer, item.t_orig_name, "deny")}
                                    title="Deny"
                                    color="blue"
                                    accessibilityLabel="Deny Member to this Team"
                                />
                            </View>
                        ))}
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