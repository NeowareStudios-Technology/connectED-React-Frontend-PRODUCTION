import React from "react";
import EventListCard from "../components/EventListCard";
import EventDetails from "../components/EventDetails";

export default class EventDetailScreen extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    console.log(this.props.navigation.state.params)
  }
  render() {
    let renderThis
    if(this.props.navigation.state.params.event){
      renderThis = <EventDetails event={this.props.navigation.state.params.event} />
    }
    return (
      <>
      {renderThis}
      </>
    );
  }
}