cplace.setLogName('Current PI');
//Configurations
const TIMELINE_DASHBOARD = {
    TYPE:'cf.cplace.solution.safe.timelineDashboard',
    ATTR:{
      PARENT:'cf.cplace.solution.safe.parent'
    }
  }
  
  let finallink='';
  let link, name;
  let piDashboardSearch = new Search()
    .add(Filters.space(embeddingPage.getSpaceId()))
    .add(Filters.type(TIMELINE_DASHBOARD.TYPE))
    .add(Filters.customAttributeNonempty(TIMELINE_DASHBOARD.ATTR.PARENT))
    .findAllPages();

let result = Iterables.getFirst(piDashboardSearch, null);

if (result) {
    link = result.getUrl();
    name = result.getName();
}
  
return '<a href="'+link+'"class="current-color">Open Timeline Dashboard</a>';