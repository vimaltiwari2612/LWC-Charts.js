import { LightningElement,wire,track } from 'lwc';
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

    get options() {
        return [
            { label: 'Select a Type', value: 'none' },
            { label: 'pie', value: 'pie' },
            { label: 'bar', value: 'bar' },
            { label: 'line', value: 'line' },
            { label: 'polarArea', value: 'polarArea' },
            { label: 'radar', value: 'radar' },
            { label: 'bubble', value: 'bubble' },
            { label: 'Doughnut', value: 'doughnut' },
            { label: 'scatter', value: 'scatter' },
            
        ];
    }

    handleSeletion(event) {
        if(event.detail.value == 'none') return;
        this.config.type = event.detail.value;
        console.log('type selected '+this.config.type );
        this.handleClick();
    }

config = {
  
    data: {
        datasets: [
            {
                data: this.values,
                backgroundColor: this.colors,
                label: 'Organization Name Vs Number of Employees'
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

handleClick(){
    this.refreshData();
}

connectedCallback(){
    this.loadUI();
}

refreshData(){
   
    getAccountList()
    .then(result => {
        // eslint-disable-next-line no-console

        this.array = result;
       
        for (var index = 0; index < this.array.length; index++) {
        
        const element = this.array[index];
        
        this.labels.push(element['Name']);
        this.values.push(parseInt(element['NumberOfEmployees']));
        this.colors.push('rgb('+((1+index)*2)+', '+((1+index)*5)+', '+ ((1+index)*10) +')');
        }
        console.log('data loaded');
        this.printDashBoard();
        this.initData();
    })
    .catch(error => {
        this.error = error;
        console.log(this.error);
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