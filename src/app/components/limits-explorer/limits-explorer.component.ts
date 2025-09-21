import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import * as math from 'mathjs';
import * as Plotly from 'plotly.js-dist-min';

interface FunctionData {
  key: string;
  label: string;
  expression: string;
}

@Component({
  selector: 'app-limits-explorer',
  templateUrl: './limits-explorer.component.html',
  standalone: true,
  imports: [CommonModule,FormsModule],
  styleUrls: ['./limits-explorer.component.scss'],
})
export class LimitsExplorerComponent implements OnInit {
  functions: FunctionData[] = [
    { key: 'fn1', label: 'f(x) = x^2', expression: 'x^2' },
    {
      key: 'fn2',
      label: 'f(x) = (x^2 - 4) / (x - 2)',
      expression: '(x^2 - 4) / (x - 2)',
    },
    { key: 'fn3', label: 'f(x) = sin(x) / x', expression: 'sin(x) / x' },
    { key: 'fn4', label: 'f(x) = |x| / x', expression: 'abs(x) / x' },
  ];

  selectedFunctionKey: string = 'fn2';
  customFunctionExpression: string = '';
  pointOfApproach: number = 2;
  compiledFunction: any;

  limitLeft: number | string = 'Calculando...';
  limitRight: number | string = 'Calculando...';
  finalLimit: number | string = 'Não definido';

  constructor() {}

  ngOnInit(): void {
    this.compileAndDraw();
  }

  onFunctionChange(): void {
    if (this.selectedFunctionKey !== 'custom') {
      this.recalculateAndDraw();
    }
  }

  recalculateAndDraw(): void {
    let expressionToCompile: string;

    if (this.selectedFunctionKey === 'custom') {
      expressionToCompile = this.customFunctionExpression;
    } else {
      const selectedFunction = this.functions.find(
        (fn) => fn.key === this.selectedFunctionKey
      );
      expressionToCompile = selectedFunction ? selectedFunction.expression : '';
    }

    if (!expressionToCompile) {
      this.finalLimit = this.limitLeft = this.limitRight = 'Expressão vazia';
      return;
    }

    try {
      this.compiledFunction = math.compile(expressionToCompile);
      const epsilon = 0.000001;
      this.limitLeft = this.compiledFunction.evaluate({
        x: this.pointOfApproach - epsilon,
      });
      this.limitRight = this.compiledFunction.evaluate({
        x: this.pointOfApproach + epsilon,
      });

      if (
        Math.abs(Number(this.limitLeft) - Number(this.limitRight)) < epsilon
      ) {
        this.finalLimit = Number(this.limitLeft).toFixed(4);
      } else {
        this.finalLimit = 'Não existe';
      }

      this.drawGraph();
    } catch (e) {
      this.finalLimit = this.limitLeft = this.limitRight = 'Erro na expressão';
      console.error('Erro na expressão:', e);
    }
  }

  drawGraph(): void {
    if (!this.compiledFunction) {
      return;
    }

    const xValues = math
      .range(this.pointOfApproach - 5, this.pointOfApproach + 5, 0.1)
      .toArray();
    const yValues = xValues.map((x: any) => {
      try {
        return this.compiledFunction.evaluate({ x });
      } catch (e) {
        return NaN;
      }
    });

    const trace1 = {
      x: xValues,
      y: yValues,
      type: 'scatter',
      mode: 'lines',
      name:
        this.selectedFunctionKey === 'custom'
          ? this.customFunctionExpression
          : this.functions.find((fn) => fn.key === this.selectedFunctionKey)
              ?.label,
    };

    const data: any = [trace1];
    const layout: any = {
      title: 'Gráfico de f(x)',
      xaxis: { title: 'Eixo X' },
      yaxis: { title: 'Eixo Y' },
    };

    Plotly.newPlot('graph-container', data, layout);
  }

  compileAndDraw(): void {
    let expressionToCompile: string;

    if (this.selectedFunctionKey === 'custom') {
      expressionToCompile = this.customFunctionExpression;
    } else {
      const selectedFunction = this.functions.find(
        (fn) => fn.key === this.selectedFunctionKey
      );
      expressionToCompile = selectedFunction ? selectedFunction.expression : '';
    }

    if (!expressionToCompile) {
      this.finalLimit = this.limitLeft = this.limitRight = 'Expressão vazia';
      return;
    }

    try {
      this.compiledFunction = math.compile(expressionToCompile);
      this.recalculateAndDraw();
    } catch (e) {
      this.finalLimit = this.limitLeft = this.limitRight = 'Erro na expressão';
      console.error('Erro na expressão:', e);
    }
  }
}
