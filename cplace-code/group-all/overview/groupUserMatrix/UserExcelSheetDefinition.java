/*
 * Copyright 2019, collaboration Factory AG. All rights reserved.
 */

package cf.cplace.platform.frontend.handler.group.overview.groupUserMatrix;

import java.util.Arrays;
import java.util.function.Function;

import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;

import com.google.common.annotations.VisibleForTesting;
import com.google.common.base.Strings;

import cf.cplace.platform.commonlib.apiannotation.CplaceInternal;
import cf.cplace.platform.core.application.principal.Person;
import cf.cplace.platform.commonlib.internationalization.Message;
import cf.cplace.platform.frontend.handler.group.overview.groupUserMatrix.exporting.Export2ExcelJob;

/**
 * Allows to configure the excel to be created by the {@link Export2ExcelJob}
 * and provides utility functions for the creation of the excel.
 */
public class UserExcelSheetDefinition {

    public static final Message nameLabel = new Message() {
    };
    @VisibleForTesting
    @CplaceInternal
    public static final Message ldapLabel = new Message() {
    };
    @VisibleForTesting
    @CplaceInternal
    public static final Message emailLabel = new Message() {
    };

    enum UserExcelSheetColumn {
        NAME(0, nameLabel, p -> Strings.nullToEmpty(p._name().get())),
        LDAP(1, ldapLabel, p -> Strings.nullToEmpty(p._externalId().get())),
        EMAIL(2, emailLabel, p -> Strings.nullToEmpty(p._login().get()));

        public final int index;
        public final Message label;
        public final Function<Person, String> informationMapper;

        UserExcelSheetColumn(int index, Message label, Function<Person, String> informationMapper) {
            this.index = index;
            this.label = label;
            this.informationMapper = informationMapper;
        }
    }

    /**
     * Sets the width of all columns containing information about a user e.g. name, LDAP and email (excluding columns that contain group membership information).
     * @param sheet the sheet in the excel that contains the respective user information columns.
     */
    public void setUserInfoColumnWidth(Sheet sheet) {
        Arrays.stream(UserExcelSheetColumn.values())
                .forEach(column -> sheet.setColumnWidth(column.index, 10000));
    }

    /**
     * Creates the header cells of all columns containing information about a user e.g. name, LDAP and email (excluding columns that contain group membership information).
     * @param row the row to contain the header cells.
     * @param cellStyle the style of the header cells.
     */
    public void createHeaderCells(Row row, CellStyle cellStyle) {
        Arrays.stream(UserExcelSheetColumn.values())
            .forEach(column -> createHeaderCellFor(row, cellStyle, column));
    }

    /**
     * For a given user creates the cells in all columns containing information about the user e.g. name, LDAP and email (excluding columns that contain group membership information).
     * @param row the row to contain the user information cells.
     * @param cellStyle the style of the user information cells.
     * @param person the user for which the user information cells shall be created.
     */
    public void createUserCells(Row row, CellStyle cellStyle, Person person) {
        Arrays.stream(UserExcelSheetColumn.values())
            .forEach(column -> createUserCellFor(row, cellStyle, person, column));
    }

    /**
     * Returns the index of the last column that contains information about the user e.g. name, LDAP and email.
     * @return the index of the last column that contains information about the user.
     */
    public int getLastColumnIndex(){
        return UserExcelSheetColumn.values()[UserExcelSheetColumn.values().length - 1].index;
    }

    private void createHeaderCellFor(Row row, CellStyle cellStyle, UserExcelSheetColumn column) {
        final Cell userNameCell = row.createCell(column.index);
        userNameCell.setCellStyle(cellStyle);
        userNameCell.setCellValue(column.label.get());
    }

    private void createUserCellFor(Row row, CellStyle cellStyle, Person person, UserExcelSheetColumn column) {
        final Cell userNameCell = row.createCell(column.index);
        userNameCell.setCellStyle(cellStyle);
        userNameCell.setCellValue(column.informationMapper.apply(person));
    }
}
