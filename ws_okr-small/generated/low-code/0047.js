const ATTRIBUTES = {
    MEETING: {
        TYPE: 'cf.cplace.solution.okr.meeting',
        ATTR: {
            MEETING_TYPE: 'cf.cplace.solution.okr.meetingType'
        },
        MEETING_TYPE: {
            ONE_ON_ONE: '#15 - 1on1',
            LEADERASHIP: '#25 - leadership',
            WORKSHOP: '#35 - workshop'
        }
    },
    LAYOUTS: {
        ONE_ON_ONE: 'cf.cplace.solution.okr.layout.1on1',
        LEADERASHIP: 'cf.cplace.solution.okr.layout.leadership',
        WORKSHOP: 'cf.cplace.solution.okr.layout.workshop',
        FILES: 'cf.cplace.solution.okr.layout.files'
    }
}




let layouts = [];
let meetingType = page.get(ATTRIBUTES.MEETING.ATTR.MEETING_TYPE);

switch (meetingType) {
    case ATTRIBUTES.MEETING.MEETING_TYPE.ONE_ON_ONE:
        layouts.push(ATTRIBUTES.LAYOUTS.ONE_ON_ONE);
        break;
    case ATTRIBUTES.MEETING.MEETING_TYPE.LEADERASHIP:
        layouts.push(ATTRIBUTES.LAYOUTS.LEADERASHIP);
        break;
        case ATTRIBUTES.MEETING.MEETING_TYPE.WORKSHOP:
            layouts.push(ATTRIBUTES.LAYOUTS.WORKSHOP);
        break;
    default:
  }

  layouts.push(ATTRIBUTES.LAYOUTS.FILES);


let layoutConfig = {
    layouts: layouts,
    active: layouts[0],
  }
  
  return layoutConfig;