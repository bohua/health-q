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

class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            dataModel: {
                currApp: null,
                kpis: [],
                charts: [],
                variables: [],
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
            profile: localStorage.getItem('profile') || "application"
        };

        this._pageScroller = null;
    }

    goToPage = (eventKey) => {
        this._pageScroller.goToPage(eventKey);
    };

    PageOnChange = (number) => {
        if (this.state.dataModel.layout[number]) {
            this.setState({currentSection: this.state.dataModel.layout[number - 1]});
        }
    };

    handleOnLoaded = (dataModel) => {
        let that = this;
        this.setState({
            dataModel,
            loaded: true
        });
        setTimeout(() => {
            that.setState(({...that.state, showPage: true}));

            dataModel.currApp.getObject('CurrentSelections', 'CurrentSelections');
        }, 500);
    };

    handleFilterOpen = () => {
        this.setState({showFilter: true});
    };

    handleFilterClose = () => {
        this.setState({showFilter: false});
    };

    handleMenuNav = (section) => {
        this.setState({userEl: null, currentSection: section});

        this.goToPage(this.state.dataModel.layout.indexOf(section));
    };

    kpiNav = (number) => {
        this.setState({currentSection: this.state.dataModel.layout[number]});
        this.goToPage(number);
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
                <div className={classes}>
                    <AppBar position="static">
                        <Toolbar className={this.state.profile === "application" ? "top-bar" : "top-bar admin-view"}>
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
                                            } else if (this.state.currentSection) {
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
