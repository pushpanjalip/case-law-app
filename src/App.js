import React from 'react';
import './App.css';

import Network from './components/Network';
import AttributesPane from './components/AttributesPane';
import FilterPane from './components/FilterPane';
import LoadData from './components/LoadData';


class App extends React.Component {

    constructor(props) {
        super(props);
        this.handleActiveNodeChange = this.handleActiveNodeChange.bind(this);
        this.handleFilterChange = this.handleFilterChange.bind(this);
        this.setFilterValues = this.setFilterValues.bind(this);
        this.setDefaultStateValues = this.setDefaultStateValues.bind(this);
        this.handleLoadData = this.handleLoadData.bind(this);
        this.doneLoading = this.doneLoading.bind(this);
        this.doneRemounting = this.doneRemounting.bind(this);
        this.resetFilterValues.bind(this);
        const data = require('./data/data.json')
        this.state = {
            data: data,
            loading: false,
            mountLayout: true,
            activeNode: {},
            filterState: {
                sizeAttributeValue: "degree",
                colorAttributeValue: "degree",
                adjustLayout: false
            },
            graphProps: {},
        };
    }

    handleActiveNodeChange(activeNode) {
        this.setState({
            activeNode
        });
    }

    handleFilterChange(newFilterState) {
        // If the layout needs to be adjust, unmount the layout
        if (newFilterState.minYearValue || newFilterState.maxYearValue) {
            if (this.state.filterState.adjustLayout) {
                this.setState({
                    "mountLayout": false
                });
            }
        }

        // Merge the new filter state into the old one
        this.setState((prevState, props) => {
            const mergedFilterState = {};
            const prevFilterState = prevState.filterState;
            for (let attrname in prevFilterState) {
                if ({}.hasOwnProperty.call(prevFilterState, attrname)) {
                    mergedFilterState[attrname] = prevFilterState[attrname];
                }
            }
            for (let attrname in newFilterState) {
                if ({}.hasOwnProperty.call(newFilterState, attrname)) {
                    mergedFilterState[attrname] = newFilterState[attrname];
                }
            }
            return {
                filterState: mergedFilterState
            };
        });
    }

    setFilterValues(graphProps) {
        this.setState({
            graphProps: graphProps
        });
        this.setDefaultStateValues();

    }

    setDefaultStateValues() {
        this.setState((prevState, props) => {
            const filterState = prevState.filterState;
            filterState.minYearValue = filterState.minYearValue || prevState.graphProps.minYear;
            filterState.maxYearValue = filterState.maxYearValue || prevState.graphProps.maxYear;
            filterState.inDegreeValue = filterState.inDegreeValue || 0;
            filterState.subjectValue = filterState.subjectValue || "all";
            filterState.sizeAttributeValue = filterState.sizeAttributeValue || "degree";
            filterState.colorAttributeValue = filterState.sizeAttributeValue || "color";
            return {
                filterState: filterState
            };
        });
    }

    resetFilterValues() {
        this.setState({
            filterState: {}
        });
    }

    handleLoadData(data) {
        console.log("Load new data");
        this.resetFilterValues();
        this.setState({
            data: data,
            loading: true
        });
    }

    doneLoading() {
        this.setState({
            loading: false
        });
    }

    doneRemounting() {
        this.setState({
            mountLayout: true
        });
    }

    render() {
        const {
            activeNode,
            filterState,
            graphProps,
            data,
            loading,
            mountLayout
        } = this.state;
        const title = data.title || "Network";
        return (
            <div className="App">
                <div className="App-header">
                  <h2>Case Law Analytics - {title}</h2>
                </div>
                <div className="App-filter-pane">
                    <div className="App-form">
                        <LoadData
                          onClick={this.handleLoadData}
                        />
                    </div>

                    <FilterPane onChange={this.handleFilterChange}
                                filterState={filterState}
                                graphProps={graphProps} />
                </div>
                <div className="App-network">
                    <Network onChange={this.handleActiveNodeChange} filterState={filterState} selectedNode={activeNode}
                            onInitialization={this.setFilterValues} loading={loading} doneLoading={this.doneLoading}
                            doneRemounting = {this.doneRemounting}
                            mountLayout={mountLayout}
                            data={data}/>
                </div>
                <div className="App-attribute-pane">
                    <AttributesPane activeNode={activeNode}/>
                </div>
            </div>
        );
    }
}

export default App;
