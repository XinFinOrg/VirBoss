import { FETCH_TOKEN_TRANSFER_BUY_PACK } from "../actions/types";
export default function(state = null, action) {
  console.log(action);
  switch (action.type) {
    case FETCH_TOKEN_TRANSFER_BUY_PACK: {
      return action.payload;
    }
    default:
      return state;
  }
}
