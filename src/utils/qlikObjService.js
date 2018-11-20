export default class qlikObjService {
    constructor(props){
        this.app = props.currApp;
        this.objectMap = props.objectMap;
    }

    async getKpi(objectName){
        let objectId = this.objectMap.kpis[objectName];
        let vis = await this.app.visualization.get(objectId);

        return {
            name: objectName,
            //value: vis.model.layout.qHyperCube.qGrandTotalRow[0].qText,
            value: vis,
            type: "kpi"
        };
    }

    async getChart(chartName){
        let objectId = this.objectMap.charts[chartName];
        let vis = await this.app.visualization.get(objectId);

        return{
            name: chartName,
            value: vis,
            type: "chart"
        }
    }

    async getVariable(varName){
        let varId = this.objectMap.variables[varName];
        let variable = await this.app.variable.getContent(varId);

        return {
            name: varName,
            value: variable ? variable.qContent.qString : null,
            type: "variable"
        }
    }

    async setVariable(varName, varValue){
        let varId = this.objectMap.variables[varName];
        let result = await this.app.variable.setStringValue(varId, varValue);

        return result;
    }
}