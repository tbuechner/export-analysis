/*
 * Copyright 2019, collaboration Factory AG. All rights reserved.
 */

package cf.cplace.platform.frontend.handler.group.overview.groupUserMatrix;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.google.common.collect.HashMultimap;
import com.google.common.collect.Lists;
import com.google.common.collect.SetMultimap;
import com.google.common.collect.Sets;

import cf.cplace.platform.core.application.principal.Person;
import cf.cplace.platform.core.datamodel.search.filter.Filters;
import cf.cplace.platform.core.datamodel.search.filter.Operator;
import cf.cplace.platform.core.datamodel.search.Search;
import cf.cplace.platform.core.datamodel.search.filter.SearchFilter;
import cf.cplace.platform.core.datamodel.search.indexing.SearchIndexFields;
import cf.cplace.platform.core.datamodel.search.result.SearchableIndex;
import cf.cplace.platform.frontend.handler.flexigrid.FlexiComponentUtils;
import cf.cplace.platform.core.datamodel.builtin.BooleanAttribute;
import cf.cplace.platform.core.datamodel.builtin.Schema;
import cf.cplace.platform.core.datamodel.search.elasticsearch.EsClient;
import cf.cplace.platform.core.datamodel.search.elasticsearch.EsClientHolder;

/**
 * Search to be utilized to find users and group memberships of users according to filters set in the group user matrix.
 */
public class CandidateUserSearch {
    private static final Logger log = LoggerFactory.getLogger(CandidateUserSearch.class);

    private final JSONObject userFilters;

    public CandidateUserSearch(JSONObject userFilters) {
        this.userFilters = userFilters;
    }

    /**
     * Finds users and users group memberships according to filters set in the group user matrix.
     *
     * @param candidateGroups     filter for users who are member in at least one of these groups.
     * @param onlyUnassignedUsers filter for users that are not member in any group.
     * @return resulting users and group memberships of the users stored in a {@link CandidateUsersAndGroups}.
     */
    public CandidateUsersAndGroups getCandidateUsers(Set<String> candidateGroups, boolean onlyUnassignedUsers) {
        Set<String> filteredGroups = Sets.newLinkedHashSet();
        Set<String> filteredUsers = Sets.newLinkedHashSet();
        SetMultimap<String, String> userMemberships = HashMultimap.create();
        Search search = new Search();
        search.add(Filters.entityClass(Person.class));
        FlexiComponentUtils.applyColumnFilters(userFilters, search);
        search.addAlphabeticalSort();

        if (candidateGroups != null && !candidateGroups.isEmpty()) {
            List<SearchFilter> filterGroups = Lists.newArrayList();
            for (String groupId : candidateGroups) {
                filterGroups.add(Filters.builtinAttribute(Person.SCHEMA.prototype()._groupMembershipIds().getName(), Operator.equals, groupId));
            }
            search.add(Filters.or(filterGroups));
        } else if (onlyUnassignedUsers) {
            search.add(Filters.builtinAttribute(Person.SCHEMA.prototype()._isMemberOfAnyGroup().getName(), Operator.equals, BooleanAttribute.EXACT_FALSE));
        }

        final String membershipIdsFieldName = SearchIndexFields.getBuiltinAttributeExactValuesFieldName(Person.SCHEMA.prototype()._groupMembershipIds().getName());
        final var searchScanConfig = new EsClient.SearchScanConfig(600_000, 1000);
        EsClientHolder.getClient().searchScan(SearchableIndex.getIndexName(), search.getElasticSearchCriterion(),
                searchScanConfig, hits -> {
                    for (final var hit : hits) {
                        String userId = Schema.id(hit.getUid());
                        final List<String> values = hit.getStringList(membershipIdsFieldName);
                        if (!values.isEmpty()) {
                            filteredUsers.add(userId);
                            final Set<String> groupIds = new HashSet<>(values);
                            groupIds.remove(userId);
                            filteredGroups.addAll(groupIds);
                            userMemberships.putAll(userId, groupIds);
                        } else {
                            log.warn("A user with id: {} does not have any memberships", userId);
                        }
                    }
                }, new String[]{ SearchIndexFields.FIELD_UID, membershipIdsFieldName }, search.getSortBuilders());

        return new CandidateUsersAndGroups(filteredUsers, filteredGroups, userMemberships);
    }
}
