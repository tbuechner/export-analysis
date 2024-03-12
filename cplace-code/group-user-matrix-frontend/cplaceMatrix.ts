import { IDirective } from 'angular';
import { AbstractMatrixCtrl } from './AbstractMatrixCtrl';
import * as _ from 'underscore';

/**
 * "name" property allows us to bind a dynamic controller. Generally when angular creates a controller instance it is named after directive,
 * since we change the name explicitly, internally, name of the controller becomes the value of "name" property in this case "theMatrix".
 * When requiring this directive(controller) in sibling/child directives this directive will be referred using the value of name property.
 *
 */
export function cplaceMatrix(): IDirective {
    return {
        restrict: 'E',
        templateUrl: '/cf.cplace.platform.matrix/matrix',
        name: 'theMatrix',
        controller: '@',
        controllerAs: 'matrixCtrl',
        transclude: true,
        priority: 1500,
        bindToController: true,
        link: ($scope, $element, $attrs, $ctrl: AbstractMatrixCtrl) => {
            $ctrl.initialize(JSON.parse($attrs.state));
        }
    };
}

export function cplaceMatrixInfo(): IDirective {
    return {
        require: '^theMatrix',
        restrict: 'A',
        link: (scope, element, attrs, matrixCtrl: AbstractMatrixCtrl) => {
            const throttledResizeHandler = _.throttle(() => {
                infoWidthChangeHandler(infoElm.children().width());
            }, 100);
            let infoElm = element.find('.cf-cplace-matrix-info');
            const detachRowWidthChangeHandler: Function = matrixCtrl.addRowWidthChangeHandler(rowsWidthChangeHandler);
            let infoWidth: number = infoElm.children().width(), rowsWidth: number = 0;
            infoElm.children().resize(throttledResizeHandler);
            scope.$on('$destroy', () => {
                infoElm.children().off('resize', throttledResizeHandler);
                detachRowWidthChangeHandler();
            });

            function updateWidthIfNecessary(newVal: number, oldVal: number) {
                if (newVal > oldVal) {
                    infoElm.css('width', newVal);
                }
            }

            function infoWidthChangeHandler(width: number): void {
                infoWidth = width;
                updateWidthIfNecessary(infoWidth, rowsWidth);
            }

            function rowsWidthChangeHandler(width: number) {
                rowsWidth = width;
                updateWidthIfNecessary(rowsWidth, infoWidth);
            }
        }
    };
}

export function cplaceMatrixRows(): IDirective {
    return {
        require: '^theMatrix',
        restrict: 'A'
    };
}

export function cplaceMatrixColumns(): IDirective {
    return {
        require: '^theMatrix',
        restrict: 'A'
    };
}

export function cplaceMatrixGrid() {
    return {
        require: '^theMatrix',
        restrict: 'A',
        link: (scope, element, attrs, ctrl: AbstractMatrixCtrl) => {
            const gridTableElm = element.find('.cf-cplace-matrix-data');
            const busyIndicator = element.find('.busy-indicator');
            gridTableElm.on('click', 'td', handleMatrixGridClick);
            gridTableElm.on('mouseenter', 'td', function() {
                const colIndex = jQuery(this).index();
                const rowIndex = angular.element(this).parent().index();
                ctrl.highlightRowColumn(rowIndex, colIndex);
            });
            gridTableElm.on('mouseleave', 'td', function() {
                const colIndex = jQuery(this).index();
                const rowIndex = angular.element(this).parent().index();
                ctrl.unhighlightRowColumn(rowIndex, colIndex);
            });

            function handleMatrixGridClick(event) {
                const cell = angular.element(event.currentTarget);
                const rowId = cell.attr('row-id');
                const columnId = cell.attr('column-id');
                ctrl.toggleEdge(rowId, columnId);
            }

            scope.$watch(() => {
                return ctrl.loading;
            }, (newVal, oldVal) => {
                let width = !!gridTableElm.width() ? gridTableElm.width() : '200px';
                let height = !!gridTableElm.height() ? gridTableElm.height() : '200px';
                busyIndicator.css({
                    width: width,
                    height: height,
                    left: gridTableElm.position().left,
                    top: gridTableElm.position().top
                });
            });
            scope.$on('$destroy', () => {
                gridTableElm.off('click', handleMatrixGridClick);
            });
        }
    };
}
