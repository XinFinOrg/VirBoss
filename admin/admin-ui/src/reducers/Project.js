import { FETCH_ALL_PROJECT } from "../actions/types";


export default function(state = null, action) {
  console.log(action);
  switch (action.type) {
    case FETCH_ALL_PROJECT: {
      return action.payload;
    }
    default:
      return state;
  }
}