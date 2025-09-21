import { Routes } from '@angular/router';
import { LinearCheckerComponent } from './components/linear-checker/linear-checker.component';
import { LimitsExplorerComponent } from './components/limits-explorer/limits-explorer.component';

export const routes: Routes = [
  {
    path: '',
    component: LinearCheckerComponent,
  },
  {
    path: 'limites',
    component: LimitsExplorerComponent,
  },
];
