export class DBTableSchema {
    constructor(columns) {
        this.columns = columns
        this.nameSet = new Set(columns.map(col => col.name))
    }
    getColumnNames() {
        return Array.from(this.nameSet)
    }
    validateNames(names) {
        if (names === '*'){
            return true
        }
        if (Array.isArray(names)) {
            return names.every(name => this.#hasByName(name))
        }
        return this.#hasByName(names)
    }
    #hasByName(name) {
        return this.nameSet.has(name)
    }
    getCreateTableSQL(tableName) {
        const definitions = this.columns.map(column => {
            return `${column.name} ${column.type}`

        }).join(', ');

        return `CREATE TABLE ${tableName} (${definitions})`
    }
}