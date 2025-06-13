import { CommonModule } from '@angular/common';
import { Component, AfterViewInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import * as Plotly from 'plotly.js-dist-min';

// THIS IS THE KEY CHANGE: Declare MathJax as a global constant
// This tells TypeScript that a 'MathJax' object will exist on the global window scope.
declare const MathJax: any; // Using 'const' is slightly better than 'var' here as it's not reassignable.

@Component({
  selector: 'app-linear-checker',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './linear-checker.component.html',
  styleUrls: ['./linear-checker.component.scss'],
})
export class LinearCheckerComponent implements AfterViewInit {
  vectors = [
    { x: 0, y: 0, z: 0 },
    { x: 0, y: 0, z: 0 },
    { x: 0, y: 0, z: 0 },
  ];

  result = '';

  matrixLatex: string = `\\begin{pmatrix} x1 & y1 & z1 \\\\ x2 & y2 & z2 \\\\ x3 & y3 & z3 \\end{pmatrix}`;
  determinantLatex: string = `det(M) = m_{00}(m_{11}m_{22} - m_{12}m_{21}) - m_{01}(m_{10}m_{22} - m_{12}m_{20}) + m_{02}(m_{10}m_{21} - m_{11}m_{20})`;
  inlineLatex: string = `m_{ij}`;

  ngAfterViewInit() {
    this.renderLatex();
  }

  renderLatex() {
    // Access MathJax directly, as TypeScript now knows it exists globally
    if (typeof MathJax !== 'undefined') {
      // Use typesetPromise for MathJax v3 for better async handling
      MathJax.typesetPromise().then(() => {
        // console.log('MathJax typeset complete!');
      }).catch((err: any) => console.error('MathJax rendering error:', err));
    } else {
      console.warn('MathJax not loaded or not ready. LaTeX will not be rendered.');
    }
  }


  // ... rest of your component methods ...
  determinant3x3(m: number[][]): number {
    return (
      m[0][0] * (m[1][1] * m[2][2] - m[1][2] * m[2][1]) -
      m[0][1] * (m[1][0] * m[2][2] - m[1][2] * m[2][0]) +
      m[0][2] * (m[1][0] * m[2][1] - m[1][1] * m[2][0])
    );
  }

  verify() {
    const m = this.vectors.map((v) => [v.x, v.y, v.z]);
    const det = this.determinant3x3(m);
    this.result =
      det === 0
        ? 'LD (Linearmente Dependentes)'
        : 'LI (Linearmente Independentes)';
    this.plotVectors();
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