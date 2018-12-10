import React, {Component} from 'react'
// import Card from "@material-ui/core/Card"
// import CardContent from "@material-ui/core/CardContent"

class ChartBlock extends Component {
    constructor(props){
        super(props);

        this.state = {
            rendered: false
        }
    }

    componentDidUpdate() {
        const {dataModel, id} = this.props;

        console.log(id);

        console.log("rendered:", this.state.rendered);
        console.log("toRender:", this.props.toRender);

        if (!this.state.rendered && this.props.toRender) {
            console.log("update!")

            if (!!dataModel[id]) {
                dataModel[id].show(id);
            } else {
                dataModel.loadChart(id).then(chart => chart.show(id));
            }

            this.setState({rendered: true});
        }

        console.log("nope!")
    }

    render() {
        const {id, width, top, left, height, extraClass} = this.props;

        return (
            <div className="chart-block"
                 style={{
                     display: this.props.toRender ? 'block' : "none",
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