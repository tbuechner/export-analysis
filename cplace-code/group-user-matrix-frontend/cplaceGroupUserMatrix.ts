import { IAugmentedJQuery, IDirective, IScope } from 'angular';
import { GroupUserMatrixCtrl, IGroupUserMatrixState } from '../../controllers/groupUserMatrix/GroupUserMatrixCtrl';

export const CPLACE_GROUP_USER_MATRIX = 'cplaceGroupUserMatrix';

export function cplaceGroupUserMatrix(): IDirective {
    return {
        restrict: 'A',
        require: CPLACE_GROUP_USER_MATRIX,
        controller: GroupUserMatrixCtrl.CTRL_NAME,
        controllerAs: 'matrixCtrl',
        compile: () => {
            return {
                pre: (scope: IScope, element: IAugmentedJQuery, attrs: any, ctrl: GroupUserMatrixCtrl) => {
                    const state: IGroupUserMatrixState = JSON.parse(attrs[CPLACE_GROUP_USER_MATRIX]);
                    ctrl.initialize(state);
                }
            };
        }
    };
}
