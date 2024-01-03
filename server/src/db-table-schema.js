export class DBTableSchema {
    constructor(columns) {
        this.columns = columns
    }
    getCreateTableSQL(tableName) {
        const definitions = this.columns.map(column => {
            return `${column.name} ${column.type}`

        }).join(', ');

        return `CREATE TABLE ${tableName} (${definitions})`;
    }
}