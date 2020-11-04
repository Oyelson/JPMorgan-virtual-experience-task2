import React, { Component } from 'react';
import DataStreamer, { ServerRespond } from './DataStreamer';
import Graph from './Graph';
import './App.css';

/**
 * State declaration for <App />
 */
interface IState {
  data: ServerRespond[],
  /** Checks if the user clicks the "Start Streaming Data" button */
  showGraph: boolean,
  /** To show loading icon if graph is not loaded yet */
  loading: boolean,
}

/**
 * The parent element of the react app.
 * It renders title, button and Graph react element.
 */
class App extends Component<{}, IState> {
  constructor(props: {}) {
    super(props);

    this.state = {
      // data saves the server responds.
      // We use this state to parse data down to the child element (Graph) as element property
      data: [],
      showGraph: false,
      loading: false,
    };
  }

  /**
   * Render Graph react component with state.data parse as property data
   */
  renderGraph() {
    /** Only renders the Graph when the user clicks the "Start Streaming Data" button */
    if(this.state.showGraph) {
      return (<Graph data={this.state.data}/>)
    } else {
      /** Show loading icon if the Graph is not displayed yet
       * but the user has clicked the "Start Streaming Data" button
       */
      if(this.state.loading) {
        return (<div className="loading"></div>)
      }
    }
  }

  /**
   * Get new data from server and update the state with the new data
   */
  getDataFromServer() {
    /** 
     * Update the graph every 100 milliseconds for a period of 1minutes 40seconds
     * i.e. (max(x) * 100)/1000 = 100seconds = 1mins 40secs
     * Note: max(x) = 1000 (Line 62)
     */
    let x: number = 0;
    const interval = setInterval(() => {
      DataStreamer.getData((serverResponds: ServerRespond[]) => {
        // Update the state by creating a new array of data that consists of
        // Previous data in the state and the new data from server
        this.setState({
          data: serverResponds,
          showGraph: true,
          loading: false, // Removes loading icon since we now have the Graph data to display
        });
      });
      x += 1;
      if(x > 1000) {
        clearInterval(interval);
      }
    }, 100);
  }

  /**
   * Render the App react component
   */
  render() {
    return (
      <div className="App">
        <header className="App-header">
          Bank & Merge Co Task 2
        </header>
        <div className="App-content">
          <button className="btn btn-primary Stream-button"
            // when button is click, our react app tries to request
            // new data from the server.
            // As part of your task, update the getDataFromServer() function
            // to keep requesting the data every 100ms until the app is closed
            // or the server does not return anymore data.
            onClick={() => {this.setState({ loading: true }); this.getDataFromServer();}}>
            Start Streaming Data
          </button>
          <div className="Graph">
            {this.renderGraph()}
          </div>
        </div>
      </div>
    )
  }
}

export default App;
