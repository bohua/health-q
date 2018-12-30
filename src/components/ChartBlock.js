import React, {Component} from 'react'

class ChartBlock extends Component {
    // constructor(props) {
    //     super(props);
    //
    //     this.state = {
    //         rendered: false
    //     }
    // }

    // componentDidUpdate() {
    //     const {dataModel, id} = this.props;
    //
    //     if (!this.state.rendered && this.props.toRender) {
    //         if (!!dataModel[id]) {
    //             dataModel[id].show(id);
    //         } else {
    //             dataModel.loadChart(id).then(chart => chart.show(id));
    //         }
    //
    //         this.setState({rendered: true});
    //     }
    // }

    render() {
        const {id, width, top, left, height, extraClass, hasMaxBtn} = this.props;

        return (
            this.props.toRender ?
                <div className="chart-block"
                     style={{
                         // display: this.props.toRender ? 'block' : "none",
                         width: isNaN(width) ? width : (window.innerWidth) * (width || 0.5),
                         height: isNaN(height) ? height : (window.innerHeight - 156) * (height || 0.5),
                         top: isNaN(top) ? top : (window.innerHeight - 156) * (top || 0.5),
                         left: isNaN(left) ? left : (window.innerWidth) * (left || 0.5)
                     }}>
                    <div className="chart-block-header">
                        {/*<Button className="chart-block-max-btn" variant="outlined" size="small" aria-label="Add">*/}
                        {/*<AddIcon onClick={()=> this.props.handleShowChartSingle(id)}/>*/}
                        {/*</Button>*/}
                        {hasMaxBtn ?
                            <button className="lui-overlay-button">
                                <span className="lui-overlay-button__icon  lui-icon  lui-icon--expand"
                                      onClick={() => this.props.handleShowChartSingle(id)}></span>
                            </button> : null
                        }
                    </div>
                    <div className={extraClass ? "chart-block-body " + extraClass : "chart-block-body"} id={id}></div>
                </div> : null
        );
    }
}

export default ChartBlock;