import api from "@/modules/common/libs/axios";
import { SignInType } from "./schema";

export const login = (data: SignInType) => {
  return api.post('/user/login', data);
};