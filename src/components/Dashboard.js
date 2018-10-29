import React, {Component} from 'react';
import KpiSlider from "./KpiSlider";

class Dashboard extends Component {
    render() {
        return (
            <section id="dashboard-section">
                <div className="banner" style={{height: window.innerHeight - 408}}>
                    {/*<img id="page-header" src={banner} alt="banner"/>*/}
                    <div className="banner-text">
                        {this.props.dataModel.dict.appName}
                    </div>
                </div>

                <div className="kpi-slider-wrapper">
                    <KpiSlider dataModel={this.props.dataModel} goToPage={this.props.goToPage}/>
                </div>
            </section>
        );
    }
}

export default Dashboard;