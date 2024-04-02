/**
 * Set to false to suspend logging
 * @type {Boolean}
 */
 const DEBUG = true;

 /**
  * Get millisecond starting time of the script
  * @type {Number}
  */
 const START_TIME = new Date().getTime()
 
 /** @type {Number} */
 let LAST_TIME = START_TIME;
 
 /**
  * Hint: set a declarative name for all of your logs
  */
 cplace.setLogName('Roadmap: Solution Roadmap');
 
 //--------------------------------------------------------------------------------------//
 //                                       CONFIGURATION                                  //
 //--------------------------------------------------------------------------------------//
 
 const CUSTOM_SETTINGS = {
   UNDEFINED_GROUP_TITLE: 'No Portfolio Epics defined', // if the ROADMAP_STRUCTURE.BASEITEM.GROUP value is changed, adjust this title
   UNDEFINED_SWIMLANE_TITLE: '',
   UNDEFINED_SUBSWIMLANE_TITLE: ''
 }
 const ROADMAP_STRUCTURE = {
   CONFIGURATION: {
     TYPE: 'de.visualistik.visualRoadmap.visualRoadmapConfiguration',
     TYPE_MAP: 'de.visualistik.visualRoadmap.configurationTypeMap',
     ITEM_TYPE: 'de.visualistik.visualRoadmap.itemType',
     DISPLAYED_VALUE: 'de.visualistik.visualRoadmap.displayedValue',
     ATTRIBUTE: 'de.visualistik.visualRoadmap.propertyKey',
     PROPERTY_KEY_VALUES: 'de.visualistik.visualRoadmap.propertyKeyValues'
   },
   BASEITEM: {
     TYPE: 'cf.cplace.solution.safe.capability',
     GROUP: 'cf.cplace.solution.safe.portfolioEpic',
     LABEL_PREFIX: 'cf.cplace.solution.safe.progressOfFeatures',
     LABEL: 'cf.cplace.solution.safe.title', // not used
     SWIMLANE: 'cf.cplace.solution.safe.solution.reference',
 
     START_DATE: 'cf.cplace.solution.safe.plannedStart',
     END_DATE: 'cf.cplace.solution.safe.plannedEnd',
 
     STATE: 'cf.cplace.solution.safe.state',
 
     // state values
     IMPLEMENTING: '#45 - Implementing',
     FUNNEL: '#15 - Funnel',
     
   },
   SUBITEM: {
     TYPE: 'cf.cplace.solution.safe.feature',
     SWIMLANE: 'cf.cplace.solution.safe.program',
     LABEL: 'cf.cplace.solution.roadmap.title',
     PART_OF: 'cf.cplace.solution.safe.capability',
     START_DATE: 'cf.cplace.solution.safe.plannedStart',
     END_DATE: 'cf.cplace.solution.safe.plannedEnd',
 
     //STATE: 'cf.cplace.solution.roadmap.workflow',
   },
   QUALITY_LINES: {
     TYPE: 'cf.cplace.solution.safe.safeMilestone',
     DATE: 'cf.cplace.solution.safe.date',
     IS_ROADMAP_RELEVANT : 'cf.cplace.solution.safe.isRoadmapRelevant'
   }
 }
 
 //--------------------------------------------------------------------------------------//
 //                                       INITIALIZATION                                  //
 //--------------------------------------------------------------------------------------//
 
 const enableLinks = true; // enable links on items and subitems
 const branding = true; // display branding visualistik
 const allGroupsOpen = true; // true if all groups are open on default
 
 /**
  * @type {import("../templates/data-model").Configuration}
  */
 let config = null;
 
 /**
  * @type {Object}
  */
 let groups = {}
 
 /** @type {import("../templates/data-model").QualityLine[]} */
 let qualityLines = null;
 
 //--------------------------------------------------------------------------------------//
 //                                       OUTPUT                                         //
 //--------------------------------------------------------------------------------------//
 
 cplace.each(pages, function (page) {
   if (page.getBuiltinFeatureValue('customType') !== ROADMAP_STRUCTURE.BASEITEM.TYPE || page.get(ROADMAP_STRUCTURE.BASEITEM.START_DATE) == null || page.get(ROADMAP_STRUCTURE.BASEITEM.END_DATE) == null) {
     return;
   }
 
   if (config === null) {
     config = loadConfiguration(enableLinks, branding, page);
   }
 
   if (qualityLines === null) {
     qualityLines = createQualityLines(page);
   }
 
   let groupPages = preparePages(page, ROADMAP_STRUCTURE.BASEITEM.GROUP);
   
   cplace.each(groupPages, function(groupPage) {
     cplace.log('groupPages'+groupPage)
     let group = null;
     let groupName = CUSTOM_SETTINGS.UNDEFINED_GROUP_TITLE;
     let groupId = CUSTOM_SETTINGS.UNDEFINED_GROUP_TITLE;
 
     if (groupPage != null) {
       groupName = groupPage.getName();
       groupId = groupPage.getId();
     }
 
     if (groups.hasOwnProperty(groupId)) {
       group = groups[groupId]
     } else {
       group = {
         name: groupName,
         id: groupId,
         swimlanes: [],
         swimlaneObject: {}
       }
       if (allGroupsOpen) {
         config.groupsOpen.push(groupId);
       }
 
       groups[groupId] = group;
     }
 
     let swimlanePages = preparePages(page, ROADMAP_STRUCTURE.BASEITEM.SWIMLANE);
     cplace.log('swimlanePages'+swimlanePages)
 
     cplace.each(swimlanePages, function (swimlanePage) {
       cplace.log('swimlanePage'+swimlanePage)
       let swimlane = null;
       let swimlaneId = CUSTOM_SETTINGS.UNDEFINED_SWIMLANE_TITLE;
       let swimlaneName = CUSTOM_SETTINGS.UNDEFINED_SWIMLANE_TITLE;
 
       if (swimlanePage != null) { // using !== null does not work for some reason.
         swimlaneId = swimlanePage.getId();
         swimlaneName = swimlanePage.getName();
       }
 
       if (group.swimlaneObject.hasOwnProperty(swimlaneId)) {
         swimlane = group.swimlaneObject[swimlaneId]
       } else {
         swimlane = {
           name: '', //swimlaneName,
           baseItemElements: []
         }
         group.swimlaneObject[swimlaneId] = swimlane;
       }
 
       let baseItem = baseItemElement(page);
       if (baseItem === null) {
         return;
       }
 
       let subItemPages = page.getIncomingPagesFromAllSpaces(ROADMAP_STRUCTURE.SUBITEM.TYPE, ROADMAP_STRUCTURE.SUBITEM.PART_OF);
       cplace.log('subItemPages'+subItemPages);
       cplace.log('pageName'+page.getName());
       let features = page.get('cf.cplace.solution.safe.features');
       cplace.log('features'+features)
       buildSubItems(baseItem, subItemPages);
 
       swimlane.baseItemElements.push(baseItem);
     });
   })
 
 });
 
 return roadmap(config, qualityLines, groups);
 
 //--------------------------------------------------------------------------------------//
 //                                       BUSINESS FUNCTIONS                             //
 //--------------------------------------------------------------------------------------//
 
 /**
  * prepare pages for swimlane creation
  * @param {Page} page
  * @param {Attribute} attribute
  * @returns {Page[]}
  */
 function preparePages(page, attribute) {
   let result = [];
   let value = page.get(attribute, false);
 
   if (value == null || value.length === 0) {
     return [null];
   }
 
   const className = typeof value === 'object' ? String(value.getClass()) : 'String'
   switch (className) {
     case 'class cf.cplace.platform.scripting.api.wrapper.entity.WrappedPage':
     case 'class cf.cplace.platform.scripting.api.wrapper.entity.WrappedPerson':
       result.push(page.get(attribute));
       break;
     case 'class com.google.common.collect.SingletonImmutableList':
     case 'class com.google.common.collect.RegularImmutableList':
       result = page.get(attribute);
       break;
     default:
       cplace.log('Class of ' + value + ' is "' + value.class + '"');
       cplace.log(typeof value.class);
       cplace.log(typeof value);
   }
 
   return result;
 }
 
 /**
  * create subItems for base items
  * @param {Object} baseItem
  * @param {Page[]} subItems
  */
 function buildSubItems(baseItem, subItems) {
 
   // iterate through all sub items
   cplace.each(subItems, function (subItem) {
     if (subItem === null) {
       return;
     }
 
     /**
      * Show only certain sub items
      */
     /*if ([ROADMAP_STRUCTURE.BASEITEM.PLANNED,ROADMAP_STRUCTURE.BASEITEM.DEVELOPMENT,ROADMAP_STRUCTURE.BASEITEM.LAUNCHED].indexOf(subItem.get(ROADMAP_STRUCTURE.SUBITEM.STATE)) === -1) {
       return;
     }*/
 
     let subSwimlane = null;
     let subItemCategory = null;
     let subItemCategoryName = CUSTOM_SETTINGS.UNDEFINED_SUBSWIMLANE_TITLE;
     let subItemCategoryId = CUSTOM_SETTINGS.UNDEFINED_SUBSWIMLANE_TITLE;
     
     // get swimlane of subitem
     subItemCategory = subItem.get(ROADMAP_STRUCTURE.SUBITEM.SWIMLANE);
     // if not null save id. If null, a fallback subSwimlane should be used
     if (subItemCategory) {
       subItemCategoryId = subItemCategory.getId();
       subItemCategoryName = subItemCategory.getName();
     }
 
     if (baseItem.subSwimlaneObject.hasOwnProperty(subItemCategoryId)) {
       // if the subSwimlane for subItem exist get this subSwimlane
       subSwimlane = baseItem.subSwimlaneObject[subItemCategoryId];
     } else {
       // if there is no subSwimlane -> create the subSwimlane
       subSwimlane = {
         name: subItemCategoryName,
         subItemElements: []
       }
       baseItem.subSwimlaneObject[subItemCategoryId] = subSwimlane;
     }
     // create the subItem object and push to subSwimlane
     let createdSubItem = subItemElement(subItem);
 
     if (createdSubItem === null) {
       return;
     }
 
     subSwimlane.subItemElements.push(createdSubItem);
   });
 }
 
 /**
  * create roadmap output
  * @param {import("../templates/data-model").Configuration} config
  * @param {import("../templates/data-model").QualityLine[]} qualityLines
  * @param {Object} groups
  * @returns
  */
 function roadmap(config, qualityLines, groups) {
   let groupArray = [];
   for (let key in groups) {
     for (let keys in groups[key].swimlaneObject) {
 
       cplace.each(groups[key].swimlaneObject[keys].baseItemElements, function (baseItemElement) {
         for (let subSwimlaneKey in baseItemElement.subSwimlaneObject) {
           let subSwimlane = JSON.stringify(baseItemElement.subSwimlaneObject[subSwimlaneKey]);
           baseItemElement.subSwimlanes.push(JSON.parse(subSwimlane));
         }
       });
 
       let swimlane = JSON.stringify(groups[key].swimlaneObject[keys]);
       groups[key].swimlanes.push(JSON.parse(swimlane));
     }
     groupArray.push(groups[key])
   }
   return {
     configuration: config,
     qualityLines: qualityLines,
     groups: groupArray
   }
 }
 
 /**
  * create baseItemElement
  * @param {Page} page
  */
 function baseItemElement(page) {
   if (page === null) {
     return null;
   }
 
   let startDate = null;
   let endDate = null;
 
   startDate = page.get(ROADMAP_STRUCTURE.BASEITEM.START_DATE);
   endDate = page.get(ROADMAP_STRUCTURE.BASEITEM.END_DATE);
 
   // if start or end date not set -> nothing to do
   if (startDate === null || endDate === null) {
     return null;
   }
 
   const labelPrefix = page.get(ROADMAP_STRUCTURE.BASEITEM.LABEL_PREFIX);
   let baseItem = {
     name:page.getName(),
     id: page.getId(),
     url: page.getUrl(),
     startDate: startDate.toString('MM-dd-yyyy'),
     endDate: endDate.toString('MM-dd-yyyy'),
     subSwimlanes: [],
     subSwimlaneObject: {}
   }
 
   if (config !== null) {
 
     if (config.colorMap !== null && config.colorMap.baseItem !== null && config.colorMap.baseItem.length > 0) {
       const attribute = config.colorMap.baseItem[0].attribute;
       // baseItem.color = page.get(attribute).get('cf.cplace.solution.roadmap.color');
       baseItem.color = page.get(attribute);
     }
     if (config.hatchingMap !== null && config.hatchingMap.baseItem !== null && config.hatchingMap.baseItem.length > 0) {
       const attribute = config.hatchingMap.baseItem[0].attribute;
       baseItem.hatching = page.get(attribute);
     }
 
     if (config.iconMap !== null && config.iconMap.baseItem !== null && config.iconMap.baseItem.length > 0) {
       const attribute = config.iconMap.baseItem[0].attribute;
       baseItem.icon = page.get(attribute);
     }
   }
 
   return baseItem;
 }
 
 /**
  * create subItemElement
  * @param {Page} page
  */
 function subItemElement(page) {
   cplace.log('subItemElement'+page)
   if (page === null) {
     return null;
   }
 
   let startDate = page.get(ROADMAP_STRUCTURE.SUBITEM.START_DATE);
   let endDate = page.get(ROADMAP_STRUCTURE.SUBITEM.END_DATE);
 
   // if start or end date not set -> nothing to do
   if (startDate === null || endDate === null) {
     return null;
   }
 
   let subItem = {
     name: page.getName(),
     id: page.getId(),
     url: page.getUrl(),
     startDate: startDate.toString('MM-dd-yyyy'),
     endDate: endDate.toString('MM-dd-yyyy'),
   }
 
   if (config !== null) {
 
     if (config.colorMap !== null && config.colorMap.subItem !== null && config.colorMap.subItem.length > 0) {
       const attribute = config.colorMap.subItem[0].attribute;
       subItem.color = page.get(attribute);
     }
     if (config.hatchingMap !== null && config.hatchingMap.subItem !== null && config.hatchingMap.subItem.length > 0) {
       const attribute = config.hatchingMap.subItem[0].attribute;
       subItem.hatching = page.get(attribute);
     }
     if (config.iconMap !== null && config.iconMap.subItem !== null && config.iconMap.subItem.length > 0) {
       const attribute = config.iconMap.subItem[0].attribute;
       subItem.icon = page.get(attribute);
     }
   }
   cplace.log('subItem'+subItem)
   return subItem;
 }
 
 //--------------------------------------------------------------------------------------//
 //                                       QUALITY LINES.                                 //
 //--------------------------------------------------------------------------------------//
 
 function createQualityLines(page) {
   let result = [];
 
   cplace.each(getPages(ROADMAP_STRUCTURE.QUALITY_LINES.TYPE, page), function (event) {
     let date = event.get(ROADMAP_STRUCTURE.QUALITY_LINES.DATE);
     let isRoadmapRelevant = true //!!event.get(ROADMAP_STRUCTURE.QUALITY_LINES.IS_ROADMAP_RELEVANT)
 
     if (date === null || !isRoadmapRelevant) {
       return;
     }
 
     result.push({
       name: event.getName(),
       date: date.toString('MM-dd-yyyy')
     });
   });
 
   return result;
 }
 
 //--------------------------------------------------------------------------------------//
 //                                       CONFIGURATION.                                 //
 //--------------------------------------------------------------------------------------//
 
 function loadConfiguration(enableLinks, branding, page) {
   let result = {
     hatchingMap: {
       baseItem: [],
       subItem: []
     },
     colorMap: {
       baseItem: [],
       subItem: []
     },
     iconMap: {
       baseItem: [],
       subItem: []
     },
     groupsOpen: [],
     enableLinks: enableLinks,
     branding: branding
   };
 
   cplace.each(getPages(ROADMAP_STRUCTURE.CONFIGURATION.TYPE, page), function (configurationPage) {
     let configurationType = configurationPage.get(ROADMAP_STRUCTURE.CONFIGURATION.TYPE_MAP);
     let itemType = configurationPage.get(ROADMAP_STRUCTURE.CONFIGURATION.ITEM_TYPE);
     let displayedValue = configurationPage.get(ROADMAP_STRUCTURE.CONFIGURATION.DISPLAYED_VALUE);
     let attribute = configurationPage.get(ROADMAP_STRUCTURE.CONFIGURATION.ATTRIBUTE);
     let values = configurationPage.get(ROADMAP_STRUCTURE.CONFIGURATION.PROPERTY_KEY_VALUES);
 
     result[configurationType][itemType].push({
       key: displayedValue,
       value: values,
       attribute: attribute
     });
   });
 
   return result;
 }
 
 //--------------------------------------------------------------------------------------//
 //                                       HELPER FUNCTIONS                               //
 //--------------------------------------------------------------------------------------//
 
 function getPages(type, page) {
   return new Search()
     .setEmbeddingEntity(page)
     .add(Filters.embeddingSpace())
     .add(Filters.type(type))
     .findAllPages();
 }
 
 /**
  * Log to cplace
  * @param {any} text
  */
 function log(text) {
   if (!DEBUG) {
     return
   }
   let logOutput = (typeof text !== 'string') ? JSON.stringify(text) : text;
 
   cplace.log(logOutput);
 }
 
 
 function timeSinceStart(msg) {
   if (!DEBUG) {
     return
   }
   let now = new Date().getTime();
   cplace.log([(now - START_TIME) + 'ms', (now - LAST_TIME) + 'ms', msg].join(' -- '))
   LAST_TIME = now;
 }