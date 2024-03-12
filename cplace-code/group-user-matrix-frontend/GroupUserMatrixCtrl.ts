import { IAngularEvent, IAugmentedJQuery, IHttpService, IScope } from 'angular';
import { EVENT_RESIZE_FIXED_PANE_SCROLL_CONTAINERS } from '../../directives/cplaceFixedPaneScroll';
import { PostHeadersService } from '../../services/PostHeadersService';
import { ColumnFiltersDialogCtrl, IFiltersDialogSavedEventData } from '../../flexigrid/controllers/ColumnFiltersDialogCtrl';

export interface IGroupUserMatrixState {
    toggleMembershipUrl: string;
    filterUsersDialogUrl: string;
    filterGroupsDialogUrl: string;
    loadDataUrl: string;
    exportDataUrl: string;
    mayExportGroupMemberships: boolean;
    userFiltersEnabled: boolean;
    data: IData;
}

export interface IData {
    excessiveData: boolean;
    excessiveDataUsers: boolean;
    excessiveDataGroups: boolean;
    userId2groupId2edge: {
        [userId: string]: {
            [groupId: string]: IEdge;
        };
    };
    users: Array<INode>;
    groups: Array<INode>;
    userPage: number;
    groupPage: number;
}

export interface IEdge {
    userId: string;
    groupId: string;
    directMembership: boolean;
    iconClass: string;
    tooltip: string;
}

export interface INode {
    id: string;
    name: string;
    url: string;
}

export class GroupUserMatrixCtrl {
    static CTRL_NAME = 'cf.cplace.platform.controllers.GroupUserMatrixCtrl';
    afterRenderEvent = EVENT_RESIZE_FIXED_PANE_SCROLL_CONTAINERS;
    state: IGroupUserMatrixState;
    onlyUnassignedUsers = false;
    private userFilters: Object;
    private groupFilters: Object;
    private filterForUsers = false;
    private filterUsersByGroups = false;
    private filterGroupsByUsers = false;
    private userPage: number;
    private groupPage: number;

    constructor(private $scope: IScope, $element: IAugmentedJQuery, private $http: IHttpService, private postHeadersService: PostHeadersService) {
        $scope.$on(ColumnFiltersDialogCtrl.EVENT_SAVED, (e: IAngularEvent, data: IFiltersDialogSavedEventData) => {
            e.stopPropagation();
            if (this.filterForUsers) {
                this.userFilters = data.filters;
            }
            else {
                this.groupFilters = data.filters;
            }
            this.reloadData();
        });
        $scope.$on(ColumnFiltersDialogCtrl.EVENT_RESTORE, (e: IAngularEvent) => {
            e.stopPropagation();
            if (this.filterForUsers) {
                this.userFilters = null;
            }
            else {
                this.groupFilters = null;
            }
            this.reloadData();
        });
        $element.on('mouseenter', '.matrix-data tr', function() {
            const index = jQuery(this).index();
            $element.find('.row-headers tr').eq(index).addClass('hovered');
        });
        $element.on('mouseleave', '.matrix-data tr', function() {
            const index = jQuery(this).index();
            $element.find('.row-headers tr').eq(index).removeClass('hovered');
        });
        $element.on('mouseenter', '.matrix-data td.edge-container', function() {
            const index = jQuery(this).index();
            $element.find('.column-headers th').eq(index).addClass('hovered');
        });
        $element.on('mouseleave', '.matrix-data td.edge-container', function() {
            const index = jQuery(this).index();
            $element.find('.column-headers th').eq(index).removeClass('hovered');
        });
    }

    initialize(matrix: IGroupUserMatrixState) {
        this.state = matrix;
        this.reloadData();
    }

    hasUserFilters() {
        return this.state.userFiltersEnabled && this.userFilters && !!Object.keys(this.userFilters).length;
    }

    hasGroupFilters() {
        return this.groupFilters && !!Object.keys(this.groupFilters).length;
    }

    filterUsers() {
        this.filterForUsers = true;
        presentURLinModal(this.state.filterUsersDialogUrl, {
            data: {
                filters: this.userFilters ? JSON.stringify(this.userFilters) : null
            },
            isLarge: true,
            angularScope: this.$scope
        });
    }

    filterGroups() {
        this.filterForUsers = false;
        presentURLinModal(this.state.filterGroupsDialogUrl, {
            data: {
                filters: this.groupFilters ? JSON.stringify(this.groupFilters) : null
            },
            isLarge: true,
            angularScope: this.$scope
        });
    }

    toggleOnlyUnassignedUsers() {
        this.onlyUnassignedUsers = !this.onlyUnassignedUsers;
        this.reloadData();
    }

    filterUsersForSelectedGroups() {
        this.userPage = 1;
        this.filterUsersByGroups = !this.filterUsersByGroups;
        this.onlyUnassignedUsers = false;
        this.reloadData();
    }

    filterGroupsForSelectedUsers() {
        this.groupPage = 1;
        this.filterGroupsByUsers = !this.filterGroupsByUsers;
        this.reloadData();
    }

    loadMore(type: string) {
        if (type == 'user') {
            this.userPage = this.state.data.userPage + 1;
        }
        if (type == 'group') {
            this.groupPage = this.state.data.groupPage + 1;
        }
        this.reloadData();
    }

    getEdge(user, group) {
        let edges = this.state.data.userId2groupId2edge[user.id];
        if (edges) {
            return edges[group.id];
        }
        else {
            return null;
        }
    }

    toggleEdge(user, group) {
        this.$http
            .post(this.state.toggleMembershipUrl, {
                userId: user.id,
                groupId: group.id
            }, this.postHeadersService.postHeaders())
            .then((result: any) => {
                const data = result.data;
                if (data.success) {
                    this.state.data.userId2groupId2edge[user.id] = data.groupId2edge;
                }
                else if (data.errorMessage) {
                    jQuery.bootstrapGrowl(data.errorMessage, {
                        ele: 'body',
                        type: 'danger',
                        delay: 4000,
                        allow_dismiss: true,
                        stackup_spacing: 10 // spacing between consecutively stacked growls.
                    });
                }
            });
    }

    canBeToggledClass(user, group) {
        var edge = this.getEdge(user, group);
        if ((edge && edge.directMembership) || edge == null) {
            return 'cell-edge-can-be-toggled';
        }
        else {
            return '';
        }
    }

    private reloadData() {
        this.state.data = null;
        this.$http
            .post(this.state.loadDataUrl, {
                userFilters: this.userFilters ? JSON.stringify(this.userFilters) : null,
                groupFilters: this.groupFilters ? JSON.stringify(this.groupFilters) : null,
                onlyUnassignedUsers: this.onlyUnassignedUsers,
                filterUsersByGroups: this.filterUsersByGroups,
                filterGroupsByUsers: this.filterGroupsByUsers,
                groupPage: this.groupPage,
                userPage: this.userPage
            }, this.postHeadersService.postHeaders())
            .then((result: any) => {
                this.state.data = result.data;
            });
    }

    exportData() {
        presentURLinModal(this.state.exportDataUrl, {
            data: {
                userFilters: this.userFilters ? JSON.stringify(this.userFilters) : null,
                groupFilters: this.groupFilters ? JSON.stringify(this.groupFilters) : null,
                onlyUnassignedUsers: this.onlyUnassignedUsers,
                filterUsersByGroups: this.filterUsersByGroups,
                filterGroupsByUsers: this.filterGroupsByUsers,
                groupPage: this.groupPage,
                userPage: this.userPage,
                mayExportGroupMemberships: this.state.mayExportGroupMemberships
            },
            angularScope: this.$scope
        });
    }

    /**
     * Checks whether the export group memberships button should be shown in the group user matrix.
     * @returns {boolean} true if the export group memberships button in the matrix should be shown.
     */
    showExportMembershipsButton(): boolean {
        return this.state.mayExportGroupMemberships &&
        (this.hasUserFilters() || this.hasGroupFilters() || this.onlyUnassignedUsers || this.filterUsersByGroups || this.filterGroupsByUsers);
    }
}
