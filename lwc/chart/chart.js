import { LightningElement,wire,track } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { loadScript, loadStyle } from 'lightning/platformResourceLoader';
import chartjs from '@salesforce/resourceUrl/chartJs';
import getAccountList from '@salesforce/apex/ChartsController.getAccountList';

export default class LibsChartjs extends LightningElement {
error;
chart;
array;

@track labels = [];
@track values = [];
@track colors = [];
xAxis = "";
yAxis = "";
@track query = "";
@track chartType = "";

    getQuery(event){
        this.query = event.target.value;
    }

    getX_Axis(event){
        this.xAxis = event.target.value;
    }

    getY_Axis(event){
        this.yAxis = event.target.value;
    }

    getChartType(event){
        this.chartType = event.target.value;
    }

    showToast(title,msg,variant) {
        const event = new ShowToastEvent({
            title: title,
            message: msg,
            variant: variant,
            mode: 'dismissable'
        });
        this.dispatchEvent(event);
    }


    get options() {
        return [
            { label: 'Select a Type', value: 'none' },
            { label: 'Pie', value: 'pie' },
            { label: 'Bar', value: 'bar' },
            { label: 'Line', value: 'line' },
            { label: 'PolarArea', value: 'polarArea' },
            { label: 'Radar', value: 'radar' },
            { label: 'Bubble', value: 'bubble' },
            { label: 'Doughnut', value: 'doughnut' },
            { label: 'Scatter', value: 'scatter' },
            
        ];
    }

    handleSelection(event) {
        console.log('type selected '+this.chartType );
        console.log('X '+this.xAxis);
        console.log('Y '+this.yAxis );
        console.log('query '+this.query);
        if(this.chartType == 'none' || this.xAxis == "" || this.yAxis == "" || this.query == ""){
            this.showToast('Error','Fill all the necessary details','error');
            console.log('error : Fill all the necessary details');
            return;
        }
        this.config.type = this.chartType;
        this.xAxis = this.xAxis.trim();
        this.yAxis = this.yAxis.trim();
        this.query = this.query.trim();
        this.refreshData();
    }

config = {
  
    data: {
        datasets: [
            {
                data: this.values,
                backgroundColor: this.colors
            }
        ],
        labels: this.labels
    },
    options: {
        responsive: true,
        legend: {
            position: 'right'
        },
        animation: {
            animateScale: true,
            animateRotate: true
        }
    }
};

connectedCallback(){
    this.loadUI();
}

refreshData(){
   
    getAccountList({query:this.query})
    .then(result => {
        // eslint-disable-next-line no-console

        this.array = result;
        
        for (var index = 0; index < this.array.length; index++) {
        
        const element = this.array[index];
        console.log(element + ' this.xAxis '+this.xAxis + ' this.yAxis '+this.yAxis);
        this.labels.push(element[this.xAxis]);
        this.values.push(parseInt(element[this.yAxis]));
        this.colors.push('rgb('+((1+index)*2)+', '+((1+index)*5)+', '+ ((1+index)*10) +')');
        }
        console.log('data loaded');
        this.printDashBoard();
        this.initData();
    })
    .catch(error => {
        this.error = error;
        console.log(this.error);
        this.showToast('Error',this.error,'error');
    });

}

loadUI() {
    
        
    Promise.all([
        loadScript(this, chartjs + '/Chart.min.js'),
        loadStyle(this, chartjs + '/Chart.min.css')
    ])
        .then(() => {
            // disable Chart.js CSS injection
            window.Chart.platform.disableCSSInjection = true;
            console.log('scripts loaded');

        })
        .catch((error) => {
            this.error = error;
            console.log('this.error '+this.error);
            this.showToast('Error',this.error,'error');
        });
}


    printDashBoard(){
        console.log('printing dashboard '+this.config.type);
        const canvas = this.template.querySelector('canvas');
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        this.chart = new window.Chart(ctx, this.config);
    }

    initData(){
        
        this.labels = [];
        this.colors = [];
        this.values = [];
    }
}
