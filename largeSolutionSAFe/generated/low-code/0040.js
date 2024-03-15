cplace.setLogName('PI Dashboard');
//Configurations
const DASHBOARD = {
    TYPE:'cf.cplace.solution.safe.solutionRoadmapDashboard',
    ATTR:{
      PARENT:'cf.cplace.solution.safe.parent'
    }
  }
  
  let finallink='';
  let link, name;
  let dashboardSearch = new Search()
    .add(Filters.space(embeddingPage.getSpaceId()))
    .add(Filters.type(DASHBOARD.TYPE))
    .add(Filters.customAttributeNonempty(DASHBOARD.ATTR.PARENT))
    .findAllPages();

let result = Iterables.getFirst(dashboardSearch, null);

if (result) {
    link = result.getUrl();
    name = result.getName();
}
  
return '<a href="'+link+'"class="current-color">Open Solution Roadmap Dashboard</a>';