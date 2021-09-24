// Import: libs
import * as React from "react";
import { User } from "firebase/auth";

// Context init
export const UserContext = React.createContext<User | null>(null);
