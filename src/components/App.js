import React, {Component, Fragment} from 'react'
import Loader from './Loader'
import {classNames} from '../utils/helper'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Drawer from '@material-ui/core/Drawer'
import Divider from '@material-ui/core/Divider'
import IconButton from '@material-ui/core/IconButton'
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft'
import FilterIcon from '@material-ui/icons/FilterList'
import Fade from '@material-ui/core/Fade'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import logo from "../images/logo.svg"
import ChartSection from "./ChartSection"
import ChartBlock from "./ChartBlock"
import Button from "@material-ui/core/Button"
import MenuIcon from "@material-ui/icons/Menu"
import withWidth from '@material-ui/core/withWidth'
import ReactPageScroller from 'react-page-scroller'
import Dashboard from "./Dashboard"
import ChartSingle from "./ChartSingle"

class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            dataModel: {
                currApp: null,
                kpis: [],
                charts: [],
                variables: [],
                conditions: [],
                user: null,
                dict: null,
                layout: [],
                qlikObjService: null
            },
            loaded: false,
            showPage: false,
            showFilter: false,
            userEl: null,
            currentSection: null,
            profile: localStorage.getItem('profile') || "application",
            showChartSingle: null
        };

        window.numeral.register('locale', 'fr', {
            delimiters: {
                thousands: ' ',
                decimal: ','
            },
            abbreviations: {
                thousand: 'k',
                million: 'm',
                billion: 'b',
                trillion: 't'
            },
            ordinal: function (number) {
                return number === 1 ? 'er' : 'ème';
            },
            currency: {
                symbol: '$'
            }
        });

        window.numeral.locale('fr');

        this._pageScroller = null;
    }

    goToPage = (eventKey) => {
        this._pageScroller.goToPage(eventKey);
    };

    PageOnChange = (number) => {
        if (this.state.dataModel.layout[number - 1]) {
            const currentSection = this.state.dataModel.layout[number - 1];
            this.setState({currentSection});

            console.log(currentSection);

            this.reRenderCharts(currentSection, this.state.conditions);
        }
    };

    reRenderCharts = (currentSection, conditions) => {
        if (currentSection.charts) {
            console.log(this.state.dataModel)

            setTimeout(() => {
                currentSection.charts.map((chart) => {
                    if (chart.condition) {
                        let {variable, value} = chart.condition;

                        if (conditions[variable] === value) {

                            if (!!this.state.dataModel.charts[chart.id]) {
                                this.state.dataModel.charts[chart.id].show(chart.id);
                            } else {
                                this.state.dataModel.loadChart(chart.id).then(vis => {
                                    this.state.dataModel.charts[chart.id] = vis;
                                    vis.show(chart.id)
                                });
                            }
                        }
                    } else {
                        if (!!this.state.dataModel.charts[chart.id]) {
                            this.state.dataModel.charts[chart.id].show(chart.id);
                        } else {
                            this.state.dataModel.loadChart(chart.id).then(vis => {
                                this.state.dataModel.charts[chart.id] = vis;
                                vis.show(chart.id)
                            });
                        }
                    }

                    return null;
                });
            }, 500);
        }
    };

    handleOnLoaded = (dataModel) => {
        let that = this;
        this.setState({
            dataModel,
            loaded: true,
            // conditions: {"EtallonageCase": dataModel.variables["EtallonageCase"]}
            conditions: {"EtallonageCase": "A"}
        });
        setTimeout(() => {
            that.setState({...that.state, showPage: true});

            dataModel.currApp.getObject('CurrentSelections', 'CurrentSelections');
        }, 500);

        console.log(dataModel.triggers);
        Object.keys(dataModel.triggers).map((triggerName) => {
            let trigger = dataModel.triggers[triggerName];

            let field = trigger.config.state? dataModel.currApp.field(trigger.config.field, trigger.config.state) :  dataModel.currApp.field(trigger.config.field);

            field.selectValues(trigger.data.split(","), false, true);
        });


        //let vis = dataModel.conditions["EtallonageCase"];


        // vis.table.OnData.bind(() => {
        //     let value = vis.model.layout.qHyperCube.qGrandTotalRow["0"].qText;
        //
        //     console.log("ondata:", value);
        //     //
        //     // that.setState({conditions: {"EtallonageCase": value}});
        //     //
        //     // that.reRenderCharts(this.state.currentSection, {conditions: {"EtallonageCase": value}})
        // });



        // let selState = dataModel.currApp.selectionState();
        // let listener = function () {
        //
        //     dataModel.qlikObjService.getVariable("EtallonageCase").then((variable) => {
        //         console.log(variable);
        //
        //         if (variable.value !== that.state.conditions["EtallonageCase"]) {
        //             that.setState({conditions: {"EtallonageCase": variable.value}});
        //             console.log(variable);
        //
        //             if (that.state.currentSection) {
        //                 that.reRenderCharts(that.state.currentSection, {"EtallonageCase": variable.value});
        //             }
        //         }
        //
        //
        //     });
        // };
        // //bind the listener
        // selState.OnData.bind(listener);
    };

    handleFilterOpen = () => {
        this.setState({showFilter: true});
    };

    handleFilterClose = () => {
        this.setState({showFilter: false});
    };

    handleMenuNav = (section) => {
        //this.setState({userEl: null, currentSection: section});

        this.goToPage(this.state.dataModel.layout.indexOf(section));
    };

    handleShowChartSingle = (id) => {
        this.setState({showChartSingle: id});
    };

    handleCloseChartSingle = () => {
        this.setState({showChartSingle: null});
    };

    kpiNav = (number) => {
        //this.setState({currentSection: this.state.dataModel.layout[number]});
        this.goToPage(this.state.dataModel.layout.indexOf(this.state.dataModel.layout[number]));

        //
        // var that = this;
        //
        // setTimeout(()=>{
        //
        // });

    };

    handleUserOpen = event => {
        this.setState({userEl: event.currentTarget});
    };

    handleUserClose = () => {
        this.setState({userEl: null});
    };

    handleUserNav = (action) => {
        switch (action) {
            case "admin":
                localStorage.setItem('profile', 'admin');
                window.location.reload();
                break;

            case "user":
                localStorage.setItem('profile', 'application');
                window.location.reload();
                break;

            default:
                return;
        }
    };

    handleClearAll = () => {
        this.state.dataModel.currApp.clearAll();
    };

    changeVariable = (name, value) => {
        let state = {...this.state};

        state.dataModel.variables[name] = value;

        this.state.dataModel.qlikObjService.setVariable(name, value);
        this.setState(state);
    };

    render() {
        const classes = classNames({
            loader: true,
            done: this.state.loaded
        });

        const charts = this.state.dataModel.charts;

        const filterPane = (
            <Drawer
                variant="persistent"
                anchor="left"
                open={this.state.showFilter}>
                <div className="filter-panel-header">
                    <IconButton onClick={this.handleFilterClose}>
                        <ChevronLeftIcon/>
                    </IconButton>
                    <span
                        className="filter-panel-title">{this.state.dataModel.dict ? this.state.dataModel.dict.filters : "Filters"}</span>
                </div>
                <Divider/>
                <div className="filter-panel-body">
                    {this.state.showFilter ? (
                        <ChartBlock title="" id="Filter"
                                    handler={charts["Filter"]}
                                    key="Filter"
                                    top="0" left="0"
                                    width="100%" height="100%"
                                    toRender={true}
                                    dataModel={this.state.dataModel}
                        />
                    ) : null}
                </div>
                <Divider/>

            </Drawer>
        );

        let userMenu;
        if (this.state.profile === "application") {
            userMenu = (
                <Menu
                    id="user-menu"
                    anchorEl={this.state.userEl}
                    open={Boolean(this.state.userEl)}
                    onClose={this.handleUserClose}
                >
                    {
                        this.state.dataModel.layout.map((section) => (
                            <MenuItem
                                key={section.id}
                                onClick={() => this.handleMenuNav(section)}>{section.title}</MenuItem>
                        ))
                    }
                    <Divider/>
                    {this.state.dataModel.dict ?
                        <MenuItem
                            onClick={() => this.handleUserNav("admin")}>{this.state.dataModel.dict.adminView}</MenuItem> : null
                    }
                </Menu>
            );
        } else {
            userMenu = (
                <Menu
                    id="user-menu"
                    anchorEl={this.state.userEl}
                    open={Boolean(this.state.userEl)}
                    onClose={this.handleUserClose}
                >
                    {this.state.dataModel.dict ?
                        <MenuItem
                            onClick={() => this.handleUserNav("user")}>{this.state.dataModel.dict.clientView}</MenuItem> : null
                    }

                </Menu>
            );
        }

        return (
            <div className="main-page" style={{marginLeft: this.state.showFilter ? "301px" : 0}}>
                <ChartSingle dataModel={this.state.dataModel} open={this.state.showChartSingle}
                             handleClose={this.handleCloseChartSingle}/>
                <div className={classes}>
                    <AppBar position="static">
                        <Toolbar
                            className={this.state.profile === "application" ? "top-bar" : "top-bar admin-view"}>
                            {(this.state.showPage & !this.state.showFilter) ?
                                <IconButton
                                    color="inherit"
                                    aria-label="Open Filter"
                                    onClick={this.handleFilterOpen}
                                    className="top-bar-filter-btn"
                                >
                                    <FilterIcon/>
                                </IconButton> : null
                            }

                            <div className="logo-wrapper">
                                <img src={logo} className="logo" alt="logo" onClick={() => {
                                    this.setState({currentSection: null});
                                    this.goToPage(0)
                                }}/>
                            </div>

                            {
                                this.state.showPage ?
                                    <Fragment>
                                        <div className="top-bar-nav">
                                            {this.state.dataModel.layout.map((section, index) => {
                                                //Don't need nav button for dashboard
                                                if (index === 0) return null;

                                                let cstring = "top-bar-nav-btn";
                                                if (this.state.currentSection && section) {
                                                    if (this.state.currentSection.id === section.id)
                                                        cstring += " active";
                                                }

                                                return (
                                                    <Button
                                                        className={cstring}
                                                        onClick={() => this.handleMenuNav(section)}
                                                        key={index}
                                                    >
                                                        {section.title}
                                                    </Button>
                                                )
                                            })}
                                        </div>
                                        <Button color="inherit" aria-label="User"
                                                aria-owns={this.state.menuEl ? 'user-menu' : null}
                                                aria-haspopup="true"
                                                onClick={this.handleUserOpen}
                                                className="user-avatar">
                                            <MenuIcon fontSize="small"/>
                                            <span className="user-id">{this.state.dataModel.user}</span>
                                        </Button>
                                    </Fragment>
                                    : null
                            }
                        </Toolbar>
                    </AppBar>
                    <Loader inLoading={true}
                            onLoaded={this.handleOnLoaded}
                            profile={this.state.profile}

                    />
                </div>
                {userMenu}
                {filterPane}
                {this.state.loaded ? (
                    <Fade in={this.state.showPage}>
                        <div className="view-wrapper">
                            <div className="main-viewport">
                                <ReactPageScroller ref={c => this._pageScroller = c}
                                                   pageOnChange={this.PageOnChange}
                                                   containerWidth={window.innerWidth}
                                                   containerHeight={window.innerHeight - 102}
                                                   animationTimer={500}>

                                    {this.state.dataModel.layout.map((section) => {
                                            if (section.id === "dashboard-section") {
                                                return (
                                                    <Dashboard
                                                        goToPage={this.kpiNav.bind(this)}
                                                        dataModel={this.state.dataModel}
                                                        key={section.id}
                                                    />
                                                );
                                            }

                                            let toRender = false;
                                            if (this.state.profile === "admin") {
                                                toRender = true;
                                            }
                                            else if (this.state.currentSection) {
                                                toRender = this.state.currentSection.id === section.id;
                                            }

                                            return (
                                                <ChartSection {...section}
                                                              key={section.id}
                                                              clearAll={this.handleClearAll}
                                                              backToHome={() => this.kpiNav(0)}
                                                              dataModel={this.state.dataModel}
                                                              changeVariable={this.changeVariable.bind(this)}
                                                              toRender={toRender}
                                                              conditions={this.state.conditions}
                                                              handleShowChartSingle={this.handleShowChartSingle}
                                                />
                                            )
                                        }
                                    )}
                                </ReactPageScroller>
                            </div>
                            <div id="CurrentSelections" className="qvobjects"></div>
                        </div>
                    </Fade>
                ) : null}
            </div>
        );
    }

}

export default withWidth()(App);
