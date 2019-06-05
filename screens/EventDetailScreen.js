import React from "react";
import EventListCard from "../components/EventListCard"

class EventDetailScreen extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <EventListCard event={this.props.navigation.state.params.event}
    );
  }
}

export default EventDetailScreen;
