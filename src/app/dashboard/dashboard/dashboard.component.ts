import { Component, OnInit } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { NgChartsModule } from 'ng2-charts';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';

import { ChartData, ChartOptions, ChartType } from 'chart.js';
import { DashboardService } from '../../services/dashboard.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    NgChartsModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatIconModule,
    DecimalPipe
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  loading = true;

  // Statistiques générales
  summary: any = {};
  lowStockProducts: any[] = [];

  // Graphique 1 : Commandes par mois
  barChartType: 'bar' = 'bar';
  barChartData: ChartData<'bar'> = { labels: [], datasets: [] };
  barChartOptions: ChartOptions<'bar'> = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: { display: true, text: 'Nombre de commandes par mois' }
    },
    scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } }
  };

  // Graphique 2 : Top 5 produits vendus
  doughnutChartType: 'doughnut' = 'doughnut';
  doughnutChartData: ChartData<'doughnut'> = { labels: [], datasets: [] };
  doughnutChartOptions: ChartOptions<'doughnut'> = {
    responsive: true,
    plugins: {
      legend: { position: 'right' },
      title: { display: true, text: 'Top 5 produits les plus vendus (en DT)' }
    }
  };

  // Graphique 3 : Produits en rupture
  horizontalBarChartType: 'bar' = 'bar';
  horizontalBarChartData: ChartData<'bar'> = { labels: [], datasets: [] };
  horizontalBarChartOptions: ChartOptions<'bar'> = {
    indexAxis: 'y',
    responsive: true,
    plugins: {
      legend: { display: false },
      title: { display: true, text: 'Produits en rupture de stock (< 5)' }
    },
    scales: { x: { beginAtZero: true, ticks: { stepSize: 1 } } }
  };

  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {
    this.loadAllData();
  }

  loadAllData(): void {
    this.loading = true;

    this.dashboardService.getSummary().subscribe(summary => this.summary = summary);
    this.dashboardService.getMonthlyOrders().subscribe(data => this.setupMonthlyOrdersChart(data));
    this.dashboardService.getProductSales().subscribe(data => this.setupProductSalesChart(data));
    this.dashboardService.getLowStockProducts().subscribe(data => {
      this.lowStockProducts = data;
      this.setupLowStockChart(data);
      this.loading = false;
    });
  }

  setupMonthlyOrdersChart(data: { [key: string]: number }): void {
    const labels = Object.keys(data).sort();
    const values = labels.map(key => data[key]);
    this.barChartData = {
      labels,
      datasets: [{
        data: values,
        label: 'Commandes',
        backgroundColor: 'rgba(54, 162, 235, 0.8)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1
      }]
    };
  }

  setupProductSalesChart(data: { [key: string]: number }): void {
    const sorted = Object.entries(data).sort(([, a], [, b]) => b - a).slice(0, 5);
    const labels = sorted.map(([name]) => name);
    const values = sorted.map(([, amount]) => amount);
    const colors = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'];

    this.doughnutChartData = {
      labels,
      datasets: [{
        data: values,
        backgroundColor: colors,
        hoverBackgroundColor: colors.map(c => c + 'CC')
      }]
    };
  }

  setupLowStockChart(products: any[]): void {
    if (products.length === 0) {
      this.horizontalBarChartData = { labels: ['Aucun'], datasets: [{ data: [0] }] };
      return;
    }
    const labels = products.map(p => p.name);
    const stocks = products.map(p => p.stock);
    this.horizontalBarChartData = {
      labels,
      datasets: [{
        data: stocks,
        label: 'Stock restant',
        backgroundColor: 'rgba(255, 99, 132, 0.8)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1
      }]
    };
  }
}
