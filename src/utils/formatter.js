import { pick } from "lodash";

export const pickUser = (user) => {
  if (!user) return {};
  return pick(user, [
    "_id",
    "email",
    "fullName",
    "phone",
    "roleId",
    "parentId",
    "createdAt",
    "updatedAt",
  ]);
};
