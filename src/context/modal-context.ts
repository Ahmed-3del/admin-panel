/* eslint-disable import/no-cycle */
import { createContext } from "react";

import { ModalContextType } from "./modal-context-provider";

export const ModalContext = createContext<ModalContextType | undefined>(
  undefined
);
