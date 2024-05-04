import { Context } from "effect";

import type { Db, TableNameToTableMap, Transaction } from "@soulmate/db";

class Database extends Context.Tag("Database")<
	Database,
	{
		readonly manager: Transaction | Db;
		readonly tableNameToTableMap?: TableNameToTableMap;
		readonly userID: string;
		readonly serverURL: string;
		readonly GOOGLE_API_KEY: string;
	}
>() {}

export { Database };
