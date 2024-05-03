import type { SpaceID } from "@soulmate/validators";

import type { GetRowsWTableName } from "./types";
import { globalCVD } from "./global";
import { chatCVD } from "./chat";

export type SpaceRecordGetterType = {
	[K in SpaceID]: GetRowsWTableName;
};
export const SpaceRecordGetter: SpaceRecordGetterType = {
	global: globalCVD,
	chat: chatCVD,
};
