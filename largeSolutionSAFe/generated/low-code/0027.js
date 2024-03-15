/**
 * Solution -> Solution Train Engineer [0..1]
 * Solution -> Solution Train Architect [0..1]
 * Solution -> Solution Management [0..1]
 * 
 */

const SOLUTION = {
    TYPE: 'cf.cplace.solution.safe.solution',
    ATTR: {
        ST_ENGINEER: 'cf.cplace.solution.safe.solutionTrainEngineer',
        ST_ARCHITECT: 'cf.cplace.solution.safe.solutionTrainArchitect',
        SOL_MANAGEMENT: 'cf.cplace.solution.safe.solutionManagement'
    }
}

const THUMBNAIL_SIZE = '60px';


//find all relevant roles / responsibles

let solution = embeddingPage;

let users = [];

let ste = solution.get(SOLUTION.ATTR.ST_ENGINEER);
let sta = solution.get(SOLUTION.ATTR.ST_ARCHITECT);
let solMan = solution.get(SOLUTION.ATTR.SOL_MANAGEMENT);


if (ste) {
    addUser(ste, "Solution Train Engineer")
}
if (sta) {
    addUser(sta, "Solution Train Architect")
}
if (solMan) {
    addUser(solMan, "Solution Management")
}

//users.sort((user1, user2) => user1.name > user2.name ? 1 : -1);


let output = '';


for (let i = 0; i < users.length; i++) {
  output += generateUserMarkupNew(users[i]);
}

return '<div style="display:flex;flex-flow:row wrap;">' + output + '</div>';


function addUser(member, title) {
    users.push({
        name: member.getName(),
        id: member.getId().split('/').pop(),
        url: member.getUrl(),
        title: title
    })
}

function getTenantName(page){
 let url=embeddingPage.getUrl().split('/pages/')[0];
 let tenantName= url.split('/')[3];
  return tenantName;
}

function generateUserMarkup (user) {
    return '<div style="margin:8px;text-align: center;">'
        + '<img class="cplace-person__image" style="margin: 5px" src="/person/downloadThumbnail?id=' + user.id + '" width="' + THUMBNAIL_SIZE + '" height="' + THUMBNAIL_SIZE + '" title="' + user.name + '"/>'
        + '<div style="font-size: 9pt;margin:3px;">' + user.name + '</div>'
        + '<div style="font-size: 8pt;margin:3px;">' + user.title + '</div>'
      + '</div>';
  }

//<img class="custom-profile-image" src='+ tenantUrl +'person/downloadThumbnail?id=' + userHref + '>'

function generateUserMarkupNew (user) {
    return '<div style="margin:8px;text-align: center;">'
        + '<img class="cplace-person__image" style="margin: 5px;height:60px;width:60px" src="/'+getTenantName(embeddingPage)+'/person/downloadThumbnail?id=' + user.id + '" width="' + THUMBNAIL_SIZE + '" height="' + THUMBNAIL_SIZE + '" title="' + user.name + '"/>'
        + '<div style="font-size: 10pt;margin:3px;">' + user.name + '</div>'
        + '<div style="font-size: 9pt;margin:3px;">' + user.title + '</div>'
      + '</div>';
  }