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

    async getCondition(chartName){
        let objectId = this.objectMap.conditions[chartName];
        let vis = await this.app.visualization.get(objectId);

        vis.show(`condition-${chartName}`)

        return{
            name: chartName,
            value: vis,
            type: "condition"
        }
    }

    async getTrigger(triggerName){
        let objectId = this.objectMap.triggers[triggerName].value.id;
        let vis = await this.app.visualization.get(objectId);
        let data = vis.model.layout.qHyperCube.qGrandTotalRow["0"].qText;

        return{
            name: triggerName,
            value: {
                config: this.objectMap.triggers[triggerName],
                data
            },
            type: "trigger"
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