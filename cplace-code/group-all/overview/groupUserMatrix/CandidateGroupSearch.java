/*
 * Copyright 2019, collaboration Factory AG. All rights reserved.
 */

package cf.cplace.platform.frontend.handler.group.overview.groupUserMatrix;

import java.util.Collections;
import java.util.Set;

import javax.annotation.Nonnull;

import org.json.JSONObject;

import com.google.common.collect.HashMultimap;
import com.google.common.collect.Sets;

import cf.cplace.platform.core.application.principal.Group;
import cf.cplace.platform.core.application.principal.MembershipVisibility;
import cf.cplace.platform.core.datamodel.search.filter.Filters;
import cf.cplace.platform.core.datamodel.search.filter.Operator;
import cf.cplace.platform.core.datamodel.search.Search;
import cf.cplace.platform.core.datamodel.search.filter.SearchFilter;
import cf.cplace.platform.core.server.session.SessionLocal;
import cf.cplace.platform.frontend.handler.flexigrid.FlexiComponentUtils;
import cf.cplace.platform.core.datamodel.builtin.Schema;

/**
 * Search to be utilized to find groups according to filters set in the group user matrix.
 */
public class CandidateGroupSearch {

    private JSONObject groupFilters;

    public CandidateGroupSearch() {
    }

    public CandidateGroupSearch(JSONObject groupFilters) {
        this.groupFilters = groupFilters;
    }

    /**
     * Finds groups according to filters set in the group user matrix.
     *
     * @return resulting groups stored in a set.
     */
    public Set<String> findAll() {
        Search search = getGroupSearch();
        return doWithElasticSearch(search);
    }

    /**
     * Finds groups according to filters set in the group user matrix.
     *
     * @return resulting groups stored in a {@link CandidateUsersAndGroups}.
     */
    public CandidateUsersAndGroups getCandidateGroups() {
        return new CandidateUsersAndGroups(Collections.emptySet(), findAll(), HashMultimap.create());
    }

    @Nonnull
    private Search getGroupSearch() {
        Search search = new Search();
        search.add(Filters.entityClass(Group.class));
        FlexiComponentUtils.applyColumnFilters(groupFilters, search);
        search.addAlphabeticalSort();

        // membership visibility filter
        final Set<String> accessTokens = SessionLocal.getAccessTokens();
        final Group group = Group.SCHEMA.prototype();
        final SearchFilter groupVisibleFilter = Filters.and(
                Filters.builtinAttribute(group._membershipVisibility().getName(), Operator.equals, MembershipVisibility.thisGroup.getKey()),
                Filters.or(
                        Filters.builtinAttributeIn(group._administrators().getName(), accessTokens),
                        Filters.builtinAttributeIn(group._id().getName(), accessTokens)
                )
        );

        final SearchFilter allVisible = Filters.or(
                Filters.builtinAttribute(group._membershipVisibility().getName(), Operator.equals, MembershipVisibility.allUsers.getKey()),
                Filters.builtinAttribute(group._membershipVisibility().getName(), Operator.equals, MembershipVisibility.everybody.getKey())
        );
        search.add(Filters.or(allVisible, groupVisibleFilter));
        return search;
    }

    private Set<String> doWithElasticSearch(Search search) {
        Set<String> candidateGroups = Sets.newLinkedHashSet();
        search.findAllUids().forEach(uid -> candidateGroups.add(Schema.id(uid)));
        return candidateGroups;
    }
}
