import { FETCH_PROJECT_CONFIG } from "../actions/types";


export default function(state = null, action) {
  console.log(action);
  switch (action.type) {
    case FETCH_PROJECT_CONFIG: {
      return action.payload;
    }
    default:
      return state;
  }
}