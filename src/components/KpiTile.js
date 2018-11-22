import React, {Component} from 'react';
import Icon from '@material-ui/core/Icon';

class KpiTile extends Component {
    constructor(props) {
        super(props);

        this.handleClick = this.handleClick.bind(this);
        this.getKpiValue = this.getKpiValue.bind(this);

        this.state = {
            value: this.getKpiValue()
        };


    }

    handleClick() {
        if (!!this.props.href) {
            this.props.goToPage(this.props.href);
            return;
        }

        if (!!this.props.action) {
            switch(this.props.action){
                case 'admin':
                    localStorage.setItem('profile', 'admin');
                    window.location.reload();
                    break;

                default:
                    return;
            }
        }
    }

    getKpiValue(){
        const numeral = window.numeral;

        let value = null;
        if(this.props.handler){
            value = this.props.handler.model.layout.qHyperCube.qGrandTotalRow[0].qText;

            if(this.props.format){
                value = numeral(value).format(this.props.format);
            }

                // "format": "(0.00 a)",
        }

        return value;
    }

    componentDidMount(){
        if(this.props.handler){
            this.props.handler.show(`KPI_${this.props.id}`);
            this.props.handler.table.OnData.bind(()=>{
                this.setState({value: this.getKpiValue()})
            });
        }
    }

    render() {
        const classes = "kpi-slider-tile-inner " + this.props.colorScheme;

        return (
            <div className="kpi-slider-tile" onClick={this.handleClick}>
                <div className={classes}>
                    <Icon className="kpi-slider-tile-icon">{this.props.icon}</Icon>
                    <div className="kpi-slider-tile-prefix">{this.props.prefix}</div>
                    <div className="kpi-slider-tile-value">{this.state.value}</div>
                    <div className="kpi-slider-tile-title">{this.props.title}</div>
                    <div className="kpi-slider-tile-subtitle">{this.props.subtitle}</div>
                </div>
                <div className="phantom-kpi" id={`KPI_${this.props.id}`}></div>
            </div>
        );
    }
}

export default KpiTile;