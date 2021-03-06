import React, {Component} from 'react';
import Slider from 'react-slick';
import KpiTile from "./KpiTile";

class KpiSlider extends Component {
    render() {
        const settings = {
            dots: false,
            infinite: false,
            speed: 300,
            slidesToShow: 5,
            slidesToScroll: 1,
            responsive: [
                {
                    breakpoint: 1920,
                    settings: {
                        slidesToShow: 7
                    }
                },
                {
                    breakpoint: 1280,
                    settings: {
                        slidesToShow: 5
                    }
                },
                {
                    breakpoint: 960,
                    settings: {
                        slidesToShow: 3
                    }
                },
                {
                    breakpoint: 480,
                    settings: {
                        slidesToShow: 1
                    }
                }
            ]
        };

        const kpis = [...this.props.dataModel.layout[0].kpis];
        const adminTile = kpis.filter((kpi) => kpi.id === "Admin");
        // adminTile.action = () => {
        //     localStorage.setItem('profile', 'admin');
        //     window.location.reload();
        // }
        //

        if (!this.props.dataModel.isAdmin) {
            let index = kpis.indexOf(adminTile);
            if (index > -1) {
                kpis.splice(index, 1);
            }
        }

        return (
            <Slider {...settings}>
                {kpis.map((kpi) => (
                    <KpiTile
                        {...kpi}
                        handler={this.props.dataModel.kpis[kpi.id]}
                        //dataModel={this.props.dataModel}
                        //value={kpi.value || numeral(this.props.dataModel.kpis[kpi.id]).format(kpi.format)}
                        goToPage={this.props.goToPage}
                        key={kpi.id}/>
                ))}
            </Slider>
        );
    }
}

export default KpiSlider