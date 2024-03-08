import { IAngularEvent, IAugmentedJQuery, IHttpPromiseCallbackArg, IHttpService, IScope } from 'angular';
import { EVENT_RESIZE_FIXED_PANE_SCROLL_CONTAINERS } from '../cplaceFixedPaneScroll';
import { ColumnFiltersDialogCtrl, IFiltersDialogSavedEventData } from '../../flexigrid/controllers/ColumnFiltersDialogCtrl';
import * as _ from 'underscore';
import { PostHeadersService } from '../../services/PostHeadersService';

export interface IMatrixState {
  loadDataUrl: string;
  filterRowsDialogUrl?: string;
  filterColumnsDialogUrl?: string;
  toggleUrl?: string;
  matrixCustomInlineStyles: IMatrixCustomInlineStyle;
  additionalData: any;
}

export interface IEdge {
  rowId: string;
  columnId: string;
  iconClass: string;
  tooltip: string;
  edgeClass: string;

  [name: string]: string;
}

export interface INode {
  id: string;
  name: string;
  url: string;
}

export interface IMatrixData {
  rowPage: number;
  columnPage: number;
  rows: Array<INode>;
  columns: Array<INode>;
  edges: {
    [rowId: string]: {
      [columnId: string]: IEdge;
    };
  };
  excessiveDataColumns: boolean;
  excessiveDataRows: boolean;
}

export interface IMatrixCustomInlineStyle {
  columnHeadlineStyles: string;
  rowHeadlineStyles: string;
  wrappingTableStyles: string;
  matrixInfoStyles: string;
}

export abstract class AbstractMatrixCtrl {
  state: IMatrixState;
  data: IMatrixData;
  afterRenderEvent = EVENT_RESIZE_FIXED_PANE_SCROLL_CONTAINERS;
  loading = false;
  private filterForRows: boolean;
  private rowFilters: Object;
  private columnFilters: Object;
  private rowPage: number;
  private columnPage: number;

  constructor(protected $scope: IScope, protected $element: IAugmentedJQuery, protected $http: IHttpService, protected postHeadersService: PostHeadersService) {
    $scope.$on(ColumnFiltersDialogCtrl.EVENT_SAVED, (e: IAngularEvent, data: IFiltersDialogSavedEventData) => {
      e.stopPropagation();
      if (this.filterForRows) {
        this.rowFilters = data.filters;
      } else {
        this.columnFilters = data.filters;
      }
      this.loadData();
    });
    $scope.$on(ColumnFiltersDialogCtrl.EVENT_RESTORE, (e: IAngularEvent) => {
      e.stopPropagation();
      if (this.filterForRows) {
        this.rowFilters = null;
      } else {
        this.columnFilters = null;
      }
      this.loadData();
    });
  }

  /**
   * Do NOT override this method. Override doInitialize to setup stuff. doInitialize is called at the end of initialize method
   */
  initialize(state: IMatrixState) {
    this.state = state;
    this.doInitialize();
    this.loadData();
  }

  /**
   * class names returned by this will be added to the top level element of matrix for custom styling
   */
  abstract getMatrixClass(): string;

  filterRows() {
    this.filterForRows = true;
    presentURLinModal(this.state.filterRowsDialogUrl, {
      data: {
        filters: this.rowFilters ? JSON.stringify(this.rowFilters) : null
      },
      isLarge: true,
      angularScope: this.$scope
    });
  }

  filterColumns() {
    this.filterForRows = false;
    presentURLinModal(this.state.filterColumnsDialogUrl, {
      data: {
        filters: this.columnFilters ? JSON.stringify(this.columnFilters) : null
      },
      isLarge: true,
      angularScope: this.$scope
    });
  }

  hasRowFilters() {
    return this.rowFilters && !!Object.keys(this.rowFilters).length;
  }

  hasColumnFilters() {
    return this.columnFilters && !!Object.keys(this.columnFilters).length;
  }

  /**
   * return an object containing data that will be set to toggle handler
   * rowId and columnId are added later
   */
  getDataForToggleHandler(): object {
    return {};
  }

  /**
   * handle click event on grid, this method will be passed rowId and columnId
   */
  toggleEdge(rowId: string, columnId: string) {
    if (!this.canBeToggled(rowId, columnId)) {
      return;
    }
    if (!this.state.toggleUrl) {
      throw new Error('No url provided to handle toggle action');
    }
    this.doToggle(rowId, columnId);
  }

  loadMore(type: 'row' | 'column') {
    if (type == 'row') {
      this.rowPage = this.data.rowPage + 1;
    }
    if (type == 'column') {
      this.columnPage = this.data.columnPage + 1;
    }
    this.loadData();
  }

  highlightRowColumn(rowIndex, columnIndex) {
    this.$element.find('.cf-cplace-matrix-rows tr').eq(rowIndex).addClass('hovered');
    this.$element.find('.cf-cplace-matrix-columns th').eq(columnIndex).addClass('hovered');
  }

  unhighlightRowColumn(rowIndex, columnIndex) {
    this.$element.find('.cf-cplace-matrix-rows tr').eq(rowIndex).removeClass('hovered');
    this.$element.find('.cf-cplace-matrix-columns th').eq(columnIndex).removeClass('hovered');
  }

  addRowWidthChangeHandler(handler: Function): Function {
    let $matrixRowsElement: JQuery = this.$element.find('.matrix-rows');
    let unwatchMatrixRows: Function = angular.noop;
    const throttledResizeHandler = _.throttle(() => {
      handler($matrixRowsElement.width());
    }, 100);
    const addResizeHandler = (): void => {
      $matrixRowsElement.resize(throttledResizeHandler);
    };
    const removeResizeHandler = () => {
      unwatchMatrixRows();
      $matrixRowsElement.off('resize', throttledResizeHandler);
    };
    if ($matrixRowsElement.length) {
      addResizeHandler();
    } else {
      unwatchMatrixRows = this.$scope.$watch(() => {
        return this.$element.find('.matrix-rows')[0];
      }, (newValue) => {
        if (newValue instanceof HTMLElement) {
          $matrixRowsElement = angular.element(newValue);
          addResizeHandler();
          unwatchMatrixRows();
        }
      });
    }
    return removeResizeHandler;
  }

  getStylesObject(styles: string): { [key: string]: string } {
    let stylesObject = {};

    if (styles) {
      styles.split(';')
        .filter(item => item.length > 0)
        .map(style => style.trim().split(':'))
        .forEach(stylePair => stylesObject[stylePair[0]] = stylePair[1]);
    }

    return stylesObject;
  }

  protected doInitialize() {
  }

  protected getEdge(rowId: string, columnId: string) {
    let edges = this.data.edges[rowId];
    if (edges) {
      return edges[columnId];
    } else {
      return null;
    }
  }

  /**
   * Override this function to return a custom CSS class, which will be added to each grid cell.
   */
  protected getCustomCellClass(rowId: string, columnId: string){
  }

  /**
   * Determines if the grid cell can be clicked.
   * sub classes should implement this method to provide their own logic to decide
   */
  protected canBeToggled(rowId: string, columnId: string): boolean {
    return true;
  }

  /**
   * may be overridden to customize the behaviour when toggling
   * e.g. open a modal confirmation dialog prior to toggling
   */
  protected doToggle(rowId: string, columnId: string) {
    let data: any = angular.extend({}, this.getDataForToggleHandler(), {
      rowId: rowId,
      columnId: columnId
    });
    this.loading = true;
    this.$http
      .post(this.state.toggleUrl, data, this.postHeadersService.postHeaders())
      .then((result: ng.IHttpPromiseCallbackArg<any>) => {
        this.processToggleResult(rowId, columnId, result);
      }).finally(() => {
      this.loading = false;
    });
  }

  /**
   * may be overriden for additional/alternative processing of the toggle result
   * e.g. open a modal window
   */
  protected processToggleResult(rowId: string, columnId: string, result: IHttpPromiseCallbackArg<any>) {
    if (result.data.rowEdges) {
      this.data.edges[rowId] = result.data.rowEdges;
    }
  }

  private loadData() {
    if (!this.state.loadDataUrl) {
      throw new Error('Cannot load data, no url provided');
    }
    this.loading = true;
    this.$http
      .post(this.state.loadDataUrl, {
        rowFilters: this.rowFilters ? JSON.stringify(this.rowFilters) : null,
        columnFilters: this.columnFilters ? JSON.stringify(this.columnFilters) : null,
        rowPage: this.rowPage,
        columnPage: this.columnPage
      }, this.postHeadersService.postHeaders())
      .then((result: ng.IHttpPromiseCallbackArg<any>) => {
        this.data = result.data;
      }).finally(() => {
      this.loading = false;
    });
  }
}
