import React, {Component} from 'react';
import Icon from '@material-ui/core/Icon';

class KpiTile extends Component {
    constructor(props) {
        super(props);

        this.handleClick = this.handleClick.bind(this);
    }

    handleClick() {
        if (!!this.props.href) {
            this.props.goToPage(this.props.href);
            return;
        }

        if (!!this.props.action) {
            this.props.action();
            return;
        }
    }

    render() {
        const classes = "kpi-slider-tile-inner " + this.props.colorScheme;

        return (
            <div className="kpi-slider-tile" onClick={this.handleClick}>
                <div className={classes}>
                    <Icon className="kpi-slider-tile-icon">{this.props.icon}</Icon>
                    <div className="kpi-slider-tile-prefix">{this.props.prefix}</div>
                    <div className="kpi-slider-tile-value">{this.props.value}</div>
                    <div className="kpi-slider-tile-title">{this.props.title}</div>
                    <div className="kpi-slider-tile-subtitle">{this.props.subtitle}</div>
                </div>
            </div>
        );
    }
}

export default KpiTile;