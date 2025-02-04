import { getMultipleValuesInput } from "../../../common/utils";
export const checkUserInclusive = (name: string) => {
    return !getMultipleValuesInput('EXCLUDE_USERS').includes(name) ;
};