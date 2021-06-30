function createTable(name, dataType) {
  const tableQuery = `
    DROP table IF EXISTS ${name}Table cascade;
    create table ${name}Table(
      ${name}_id SERIAL Primary Key,
      ${name} ${dataType} unique
    )`;
  return tableQuery;
}

async function insertIntoTable(tableName, columnName, tableArray, dataColumn, matchesData, client) {
  for (const match of matchesData) {
    const data = match[dataColumn];
    if (!tableArray.includes(data)) {
      tableArray.push(data);
      await client.query(`Insert into public.${tableName}(${columnName}) values('${data}')`);
    }
  }
  console.log(`${tableName} complete`);
}

module.exports = { createTable, insertIntoTable };
