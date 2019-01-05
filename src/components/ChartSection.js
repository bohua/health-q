import React, {Component} from 'react';
import ChartBlock from './ChartBlock';
import placeHolder from "../images/placeholder.png";
import Icon from '@material-ui/core/Icon'
// import Menu from '@material-ui/core/Menu'
// import MenuItem from '@material-ui/core/MenuItem'
import DownloadDialog from './DownloadDialog'
import SelectionChip from './SelectionChip';

class ChartSection extends Component {
    constructor(props) {
        super(props);

        this.state = {
            anchorEl: null,
            downloadLink: null
        };
    }

    handleExportOpen = event => {
        this.setState({anchorEl: event.currentTarget});
    };

    handleExportClose = () => {
        this.setState({anchorEl: null});
    };

    handleExport = (id) => {
        let that = this;
        let handler = this.props.dataModel.charts[id];
        handler.model.exportData().then(function (reply) {
            that.setState({downloadLink: reply.qUrl});
        });

        this.setState({anchorEl: null});
    };

    handleDownloadDialogClose = () => {
        this.setState({downloadLink: null});
    };

    handleBackToTop = () => {
        const anchor = document.getElementById("page-header");

        if (anchor) {
            anchor.scrollIntoView({behavior: "smooth", block: "start", inline: "nearest"});
        }
    };

    componentDidMount() {
        // if (!!this.props.chartHandler) {
        //     this.props.chartHandler.show(this.props.chartId);
        // }
    }

    render() {
        const {id, charts, clearAll, variable, measure, dimension, filter, dataModel, changeVariable, conditions} = this.props;
        // const {anchorEl} = this.state;
        // let exportBtn = charts.length > 0 ? (
        //     <a color="secondary" aria-label="Export" className="chart-func-btn"
        //        aria-owns={anchorEl ? 'export-menu' : null}
        //        aria-haspopup="true" onClick={this.handleExportOpen}><Icon>archive</Icon></a>
        // ) : null;

        return (
            <section id={id} className="chart-section">
                <div className="chart-section-title">
                    <div className="chart-selection-bar">
                        {(variable && variable.length > 0) ?

                            variable.map((v) => {
                                return (
                                    <div className={v.style} key={v.id}>
                                        <a>{v.label}: </a>
                                        {v.options.map(chip => {
                                            const model = dataModel.variables[v.id];
                                            return (
                                                <SelectionChip
                                                    data={chip}
                                                    onChange={changeVariable}
                                                    variable={{name: v.id, value: model}}
                                                    key={chip.label}
                                                ></SelectionChip>
                                            )
                                        })}
                                    </div>
                                );
                            }) : null

                        }

                        {(filter && filter.length > 0) ?
                            <div className="filter">
                                <a className="selection-title">Filter: </a>
                                {
                                    filter.map(flt => {
                                        const dataModel = this.props.dataModel,
                                            id = flt.id;

                                        if (this.props.toRender) {


                                            if (!!dataModel[id]) {
                                                dataModel[id].show(id);
                                            } else {
                                                dataModel.loadChart(id).then(chart => chart.show(id));
                                            }
                                        }

                                        return (<div id={id} key={id} className="selection-chip"></div>);
                                    })
                                }
                            </div> : null
                        }
                    </div>
                    <a color="secondary" aria-label="Back To Top" className="chart-func-btn"
                       onClick={this.props.backToHome}><Icon>reply</Icon></a>
                    <a color="secondary" aria-label="Refresh" className="chart-func-btn"
                       onClick={clearAll}><Icon>cached</Icon></a>
                    {/*{exportBtn}*/}


                    {/*<Menu id="export-menu"
                          anchorEl={anchorEl}
                          open={Boolean(anchorEl)}
                          onClose={this.handleExportClose}>

                        {charts.map(
                            (chart) => {
                                let dataModel = this.props.dataModel.charts[chart.id];

                                if (dataModel) {
                                    return (
                                        <MenuItem key={chart.id}
                                                  onClick={() => this.handleExport(chart.id)}>{this.props.dataModel.charts[chart.id].model.layout.title}</MenuItem>
                                    )
                                }

                                return null;

                            }
                        )}

                    </Menu>*/}
                </div>
                <div className="chart-section-body" style={{height: window.innerHeight - 154}}>
                    {charts.map(
                        (chart) => {
                            if (chart.condition) {
                                let {variable, value} = chart.condition;

                                if (conditions[variable] === value) {
                                    return (<ChartBlock {...chart} key={chart.id} dataModel={this.props.dataModel}
                                                        toRender={this.props.toRender}
                                                        handleShowChartSingle={this.props.handleShowChartSingle}/>);
                                } else {
                                    return (<ChartBlock {...chart} key={chart.id} dataModel={this.props.dataModel}
                                                        toRender={false}
                                                        handleShowChartSingle={this.props.handleShowChartSingle}/>);
                                }
                            } else {
                                return (<ChartBlock {...chart} key={chart.id} dataModel={this.props.dataModel}
                                                    toRender={this.props.toRender}
                                                    handleShowChartSingle={this.props.handleShowChartSingle}/>);
                            }
                        }
                    )}

                    {charts.length < 1 ? <img className="placeholder" src={placeHolder} alt="placeholder"
                                              style={{height: window.innerHeight - 156}}/> : null}
                    <DownloadDialog open={!!this.state.downloadLink} link={this.state.downloadLink}
                                    close={this.handleDownloadDialogClose}/>
                </div>
            </section>
        );
    }
}

export default ChartSection;