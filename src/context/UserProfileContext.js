import { createStore } from 'redux';

const INITIAL = {
  profile:{},
  other_profile:"",
  online_users: undefined,
  room: {
    room_id: "",
    room_data: undefined
  },
  current_content: {
    room: false,
    profile: true,
  },
  edit_profile_pic: {
    open: false,
  },
  new_message: {
    active: false,
    message_data: undefined,
  },
  answering_message: {
    active: false,
    message_id: ''
  },
  deleted_message: null,
  hidden_message: null,
  delete_room_window: {
    open: false,
  },
  navigation: {
    show_users: false,
    show_sidebar: false,
    expanded_sidebar: false,
  },
  window:{
    open: false,
    app_options: false,
    user_data: undefined,
    profile_data: undefined,
    url: undefined,
    message_action: undefined,
    message_id: undefined,
    message_data: undefined,
    room_data: undefined,
    delete_account: undefined
  },
}

function appState(state = INITIAL, action){
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
        other_profile: action.data,
        current_content: {
          room: false,
          profile: true
        },
        room: INITIAL.room
      }
      case 'SET_ONLINE_USERS':
      console.log(action)
      return {
        ...state,
        online_users: action.data
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
      case 'TOGGLE_USERS':
      console.log(action)
      return {
        ...state,
        navigation:{
          ...state.navigation,
          show_users: !state.navigation.show_users
        }
      }
      case 'SHRINK_SIDEBAR':
      console.log(action)
      return {
        ...state,
        navigation:{
          ...state.navigation,
          expanded_sidebar: false,
          show_sidebar: true
        }
      }
      case 'EXPAND_SIDEBAR':
      console.log(action)
      return {
        ...state,
        navigation:{
          ...state.navigation,
          expanded_sidebar: true,
          show_sidebar: true
        }
      }
      case 'HIDE_SIDEBAR':
      console.log(action)
      return {
        ...state,
        navigation:{
          ...state.navigation,
          show_sidebar: false,
          expanded_sidebar: false,
        }
      }
      case 'SET_NEW_MESSAGE':
      console.log("action: ", action, "state: ", state)
      return {
        ...state,
        new_message: action.data
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
      case 'HIDE_MSG_TO_ONE':
      console.log(action)
      return {
        ...state,
        hidden_message: action.data.hidden_message
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

const store = createStore(appState);

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