import React, {Component} from 'react';
import LinearProgress from '@material-ui/core/LinearProgress';
import Fade from '@material-ui/core/Fade';
import qlikObjService from "../utils/qlikObjService";

function init(that, config, objectMap) {
    //Connect Qlik Sense Server
    const requireJs = window.requirejs;

    const qlikConfig = {
        appId: objectMap.appid
    };


    let requireJsConfig = config.requireJsConfig;

    if (config.localRequireJsHosting) {
        requireJsConfig = {
            host: window.location.hostname,
            prefix: window.location.pathname.substr(0, window.location.pathname.toLowerCase().lastIndexOf("/extensions") + 1),
            port: window.location.port,
            isSecure: window.location.protocol === "https:"
        };
    }

    requireJs.config({
        baseUrl: (requireJsConfig.isSecure ? 'https://' : 'http://') + requireJsConfig.host + (requireJsConfig.port ? ':' + requireJsConfig.port : '') + requireJsConfig.prefix + 'resources'
    });

    requireJs(['js/qlik'], (qlik) => {
        let {onLoaded} = that.props;

        qlik.setOnError(function (error) {
                //contains code, message
                console.log(error);
            },
            function (warning) {
                console.log(warning);
            });

        let currApp = qlik.openApp(qlikConfig.appId, requireJsConfig);

        let service = new qlikObjService({currApp, objectMap});

        let promises = [];

        //Get User Info
        let global = qlik.getGlobal(requireJsConfig);
        global.getAuthenticatedUser(function (reply) {
            let user = reply.qReturn;
            if (user && user.split('UserId=').length > 0) {
                user = user.split('UserId=')[1];
            } else {
                user = 'Anonymous'
            }

            //Get all kpi tile values
            Object.keys(objectMap.kpis).map((name) => {
                return promises.push(service.getKpi(name));
            });


            //Get all chart handlers
            // Object.keys(objectMap.charts).map((name) => {
            //     return promises.push(service.getChart(name));
            // });

            //promises.push(service.getChart("Filter"));

            //Get all variables
            Object.keys(objectMap.variables).map((name) => {
                return promises.push(service.getVariable(name));
            });

            Object.keys(objectMap.conditions).map((name) => {
                return promises.push(service.getCondition(name));
            });

            Object.keys(objectMap.triggers).map((name) => {
                return promises.push(service.getTrigger(name));
            });

            Promise.all(promises).then((values) => {
                that.setState({inLoading: false});

                let kpis = {},
                    charts = {},
                    variables = {},
                    conditions = {},
                    triggers = {};

                values.forEach((v) => {
                    if (v.type === "kpi")
                        kpis[v.name] = v.value;
                    else if (v.type === "chart")
                        charts[v.name] = v.value;
                    else if (v.type === "variable")
                        variables[v.name] = v.value;
                    else if (v.type === "condition")
                        conditions[v.name] = v.value;
                    else if (v.type === "trigger")
                        triggers[v.name] = v.value;
                });

                qlik.getAppList((list) => {
                    //Check if the user can see Monitoring app
                    const hits = list.filter(app => app.qDocId === objectMap.adminid);

                    onLoaded({
                        currApp,
                        kpis,
                        charts,
                        variables,
                        conditions,
                        triggers,
                        user,
                        dict: objectMap.dict,
                        layout: objectMap.layout,
                        qlikObjService: service,
                        isAdmin: hits.length > 0,
                        loadChart: async function (id) {
                            //let objId = objectMap.charts[id];
                            let chart = await service.getChart(id);

                            return chart.value
                        }
                    });

                }, requireJsConfig);
            });
        });

        if (objectMap.bookmark) {
            currApp.bookmark.apply(objectMap.bookmark);
        }
    });
}

class Loader extends Component {
    constructor(props) {
        super(props);

        this.state = {
            inLoading: true
        }
    }

    componentDidMount() {
        let jQuery = window.jQuery;
        let systemProfile = "../../config/system.json";
        let applicationProfile = "../../config/" + this.props.profile + ".json";

        jQuery.getJSON(systemProfile, (config) => {
            jQuery.getJSON(applicationProfile, (objectMap) => {
                init(this, config, objectMap);
            });
        });
    }

    render() {
        return (
            <Fade in={this.state.inLoading} timeout={{exit: 300}}>
                <LinearProgress className="loading-bar"/>
            </Fade>
        );
    }
}


export default Loader;