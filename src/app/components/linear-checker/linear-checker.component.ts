import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import * as Plotly from 'plotly.js-dist-min';

@Component({
  selector: 'app-linear-checker',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './linear-checker.component.html',
  styleUrls: ['./linear-checker.component.scss'],
})
export class LinearCheckerComponent {
  vectors = [
    { x: 0, y: 0, z: 0 },
    { x: 0, y: 0, z: 0 },
    { x: 0, y: 0, z: 0 },
  ];

  result = '';

  verify() {
    const m = this.vectors.map((v) => [v.x, v.y, v.z]);
    const det = this.determinant3x3(m);
    this.result =
      det === 0
        ? 'LD (Linearmente Dependentes)'
        : 'LI (Linearmente Independentes)';
    this.plotVectors();
  }

  determinant3x3(m: number[][]): number {
    return (
      m[0][0] * (m[1][1] * m[2][2] - m[1][2] * m[2][1]) -
      m[0][1] * (m[1][0] * m[2][2] - m[1][2] * m[2][0]) +
      m[0][2] * (m[1][0] * m[2][1] - m[1][1] * m[2][0])
    );
  }

  plotVectors() {
    const traces: any = this.vectors.map((v, i) => ({
      type: 'scatter3d',
      mode: 'lines+markers',
      name: `v${i + 1}`,
      line: { width: 6 },
      marker: { size: 3 },
      x: [0, v.x],
      y: [0, v.y],
      z: [0, v.z],
    }));

    Plotly.newPlot('plot', traces, {
      margin: { t: 0 },
      scene: {
        xaxis: { title: { text: 'X' } },
        yaxis: { title: { text: 'Y' } },
        zaxis: { title: { text: 'Z' } },
      },
    });
  }
}
