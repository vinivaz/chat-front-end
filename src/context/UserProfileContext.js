import { createStore } from 'redux';

const INITIAL = {
  profile:{},
  other_profile_id:"",
  room: {
    room_id: "",
  },
  current_content: {
    room: false,
    profile: true,
  },
  edit_profile_pic: {
    open: false,
  },
  answering_message: {
    active: false,
    message_id: ''
  },
  deleted_message: null,
  delete_room_window: {
    open: false,
  },
  window:{
    open: false,
    app_options: false,
    profile_data: undefined,
    url: undefined,
    message_action: undefined,
    message_id: undefined,
  },
}

function profile(state = INITIAL, action){
  switch(action.type){
    case 'SET_PROFILE':
      console.log(action)
      return {...state,
        profile: action.data,
        current_content: {
          room: false,
          profile: true
        }
      }
      case 'SET_PROFILE_SECTION':
      console.log(action)
      return {...state,
        other_profile_id: action.data,
        current_content: {
          room: false,
          profile: true
        }
      }
      case 'SET_ROOM':
      console.log("action: ", action, "state: ", state)
      return {
        ...state,
        current_content: {
          room: true,
          profile: false
        },
        room: action.data,
        answering_message:{
          active: false,
          message_id: ''
        }
      }
      case 'SET_WINDOW':
      console.log(action)
      return {
        ...state,
        window: action.data
      }
      case 'UNSET_WINDOW':
      console.log(action)
      return {
        ...state,
        window: INITIAL.window
      }
      case 'SET_ANSWER_MESSAGE':
      console.log("action: ", action, "state: ", state)
      return {
        ...state,
        answering_message: action.data
      }
      case 'SET_DELETED_MESSAGE':
      console.log(action)
      return {
        ...state,
        deleted_message: action.data.deleted_message
      }
      case 'SET_PROFILE_PIC':
      console.log(action)
      return {
        ...state,
        edit_profile_pic: {
          open: action.data.open,
          url_data: action.data.url_data
        }
      }
      case 'SET_INITIAL':
      console.log(action)
      return INITIAL
    default: return state;
  }
}

const store = createStore(profile);

export default store;

/*
    case 'SET_DELETE_ROOM_WINDOW':
      console.log(action)
      return {
        ...state,
        delete_room_window: {
          open: action.data.open,
          room_id: action.data.room_id,
          app_options: false,
        }
      }
-------------------------------------------------------------------


      case 'SET_MESSAGE_OPTIONS_WINDOW':
      console.log(action)
      return {
        ...state,
        windows: {
          open: action.data.open,
          message_action: action.data.message_action,
          message_id: action.data.message_id,
          app_options: false,
        }
      }

      case 'SET_ROOM_OPTIONS_WINDOW':
      console.log(action)
      return {
        ...state,
        windows: {
          open: action.data.open,
          room_id: action.data.room_id,
          //user_id: action.data.user_id,
          app_options: false,
        }
      }
      case 'SET_USER_OPTIONS_WINDOW':
      console.log(action)
      return {
        ...state,
        windows: {
          open: action.data.open,
          user_id: action.data.user_id,
          app_options: false,
        }
      }
      case 'SET_IMAGE_WINDOW':
      console.log(action)
      return {
        ...state,
        windows: {
          open: action.data.open,
          url: action.data.url,
          message_action: action.data.message_action,
          message_id: action.data.message_id,
          app_options: false,
        }
      }
      case 'SET_PROFILE_OPTIONS':
      console.log(action)
      return {
        ...state,
        windows: {
          open: action.data.open,
          profile_data: action.data.profile_data,
          app_options: false,
        }
      }
      case 'SET_APP_OPTIONS_WINDOW':
      console.log(action)
      return {
        ...state,
        windows: {
          open: action.data.open,
          app_options: true,
        }
      }
      */