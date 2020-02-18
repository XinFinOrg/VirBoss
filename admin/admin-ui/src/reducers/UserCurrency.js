import { FETCH_ALL_USER_CURRENCY } from "../actions/types";

export default function(state = null, action) {
  console.log(action);
  switch (action.type) {
    case FETCH_ALL_USER_CURRENCY: {
      return action.payload;
    }
    default:
      return state;
  }
}
