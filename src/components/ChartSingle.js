import React, {Component} from 'react'
import ClearIcon from "@material-ui/icons/Clear";
import Button from "@material-ui/core/Button/Button";

class ChartSingle extends Component {

    componentDidUpdate() {
        if (this.props.open !== null) {
            const {dataModel, open} = this.props;
            dataModel.loadChart(open).then(chart => chart.show("chart-single-previewer"));
            // dataModel[open].show(open);
        }
    }

    render() {
        return (
            <div className={this.props.open ? "chart-single show" : "chart-single hide"}>
                <div className="chart-single-inner">
                    <div className="chart-single-header">
                        <Button size="small" aria-label="Close" className="chart-single-close-btn">
                            <ClearIcon onClick={this.props.handleClose}/>
                        </Button>
                    </div>
                    <div className="chart-single-body">
                        <div id="chart-single-previewer"></div>
                    </div>
                </div>
            </div>
        );
    }
}

export default ChartSingle;