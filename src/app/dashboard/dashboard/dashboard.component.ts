import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgChartsModule } from 'ng2-charts';
import { MatCardModule } from '@angular/material/card';
import { ChartOptions, ChartType } from 'chart.js';
import { DashboardService } from '../../services/dashboard.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, NgChartsModule, MatCardModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  stats: any = {};
  loading = false;

  constructor(private dashboardService: DashboardService) {}

  ngOnInit() { this.fetchStats(); }

  fetchStats() {
    this.loading = true;
    this.dashboardService.getSummary().subscribe({
      next: res => { this.stats = res; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }
}
