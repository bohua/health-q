import React, {Component} from 'react';
import ChartBlock from './ChartBlock';
import placeHolder from "../images/placeholder.png";
import Icon from '@material-ui/core/Icon'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import DownloadDialog from './DownloadDialog'
import Chip from '@material-ui/core/Chip'

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
        const {id, charts, clearAll, measure, dimension, dataModel, changeVariable} = this.props;
        const {anchorEl} = this.state;
        let exportBtn = charts.length > 0 ? (
            <a color="secondary" aria-label="Export" className="chart-func-btn"
               aria-owns={anchorEl ? 'export-menu' : null}
               aria-haspopup="true" onClick={this.handleExportOpen}><Icon>archive</Icon></a>
        ) : null;

        return (
            <section id={id} className="chart-section">
                <div className="chart-section-title">
                    <div className="chart-selection-bar">

                        {(dimension && dimension.length > 0) ?
                            <div className="dimension">
                                <a>Dimension: </a>
                                {dimension.map(chip => {
                                    const dim = dataModel.variables["selectionDimension"];

                                    return (
                                        <Chip label={chip.label} variant="outlined"
                                              className={dim === chip.value ? "active dim-chip" : "dim-chip"}
                                              onClick={() => changeVariable("selectionDimension", chip.value)}
                                              key={chip.label}
                                        ></Chip>
                                    )
                                })}
                            </div> : null
                        }

                        {(measure && measure.length > 0) ?
                            <div className="measure">
                                <a>Measure: </a>
                                {measure.map(chip => {
                                    const msr = dataModel.variables["selectionMeasure"];
                                    return (
                                        <Chip label={chip.label} variant="outlined"
                                              className={msr === chip.value ? "active msr-chip" : "msr-chip"}
                                              onClick={() => changeVariable("selectionMeasure", chip.value)}
                                              key={chip.label}
                                        ></Chip>
                                    )
                                })}
                            </div> : null
                        }

                    </div>
                    <a color="secondary" aria-label="Back To Top" className="chart-func-btn"
                       onClick={this.props.backToHome}><Icon>reply</Icon></a>
                    <a color="secondary" aria-label="Refresh" className="chart-func-btn"
                       onClick={clearAll}><Icon>cached</Icon></a>
                    {exportBtn}


                    <Menu id="export-menu"
                          anchorEl={anchorEl}
                          open={Boolean(anchorEl)}
                          onClose={this.handleExportClose}>

                        {charts.map((chart) => (
                            <MenuItem key={chart.id}
                                      onClick={() => this.handleExport(chart.id)}>{this.props.dataModel.charts[chart.id].model.layout.title}</MenuItem>
                        ))}

                    </Menu>
                </div>
                <div className="chart-section-body" style={{height: window.innerHeight - 154}}>
                    {charts.map((chart) => (
                        <ChartBlock {...chart} key={chart.id} handler={this.props.dataModel.charts[chart.id]}/>
                    ))}

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