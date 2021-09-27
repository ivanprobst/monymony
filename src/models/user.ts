// Import: libs
import { types, Instance } from "mobx-state-tree";

// MODEL
export const UserAccount = types
  .model("UserAccount", {
    userLoggedIn: types.optional(types.boolean, false),
    email: types.optional(types.string, ""),
  })
  .actions((self) => ({
    logUserIn(email: string) {
      self.email = email;
      self.userLoggedIn = true;
    },
    logUserOut() {
      self.email = "";
      self.userLoggedIn = false;
    },
  }));
export interface IUserAccount extends Instance<typeof UserAccount> {}
