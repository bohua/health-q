import React, {Component} from 'react'
// import Card from "@material-ui/core/Card"
// import CardContent from "@material-ui/core/CardContent"

class ChartBlock extends Component {

    componentDidUpdate() {
        const {dataModel, id} = this.props;

        if (this.props.toRender) {
            if (!!dataModel[id]) {
                dataModel[id].show(id);
            } else {
                dataModel.loadChart(id).then(chart => chart.show(id));
            }
        }
    }

    render() {
        const {id, width, top, left, height, extraClass} = this.props;

        return (
            <div className="chart-block"
                 style={{
                     width: isNaN(width) ? width : (window.innerWidth) * (width || 0.5),
                     height: isNaN(height) ? height : (window.innerHeight - 156) * (height || 0.5),
                     top: isNaN(top) ? top : (window.innerHeight - 156) * (top || 0.5),
                     left: isNaN(left) ? left : (window.innerWidth) * (left || 0.5)
                 }}>
                <div className={extraClass ? "chart-block-body " + extraClass : "chart-block-body"} id={id}></div>
            </div>
        );
    }
}

export default ChartBlock;