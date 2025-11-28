import fs from 'fs';

function createIpDatabase() {
    const data = fs.readFileSync('GeoLite2-Country-Blocks-IPv4.csv', 'utf8');
    const rows = data.split('\n');
    rows.splice(0, 1);
    rows.splice(-1);
    const parsed: [number, string, number][] = [];
    for (const row of rows) {
        const lineData = row.trim().split(',');
        parsed.push([
            parseInt(lineData[0].split('.')[0]),
            lineData[0],
            parseInt(lineData[1] || '0')
        ]);
    }
    fs.writeFileSync('../dist/ipv4-db.json', JSON.stringify(parsed));

}

function createCountryDatabase() {
    const data = fs.readFileSync('GeoLite2-Country-Locations-en.csv', 'utf8');
    const rows = data.split('\n');
    rows.splice(0, 1);
    rows.splice(-1);
    const parsed: [number, string, string][] = [];
    for (const row of rows) {
        const lineData = row.trim().split(',');
        parsed.push([parseInt(lineData[0]), lineData[2], lineData[4]]);
    }
    fs.writeFileSync('../dist/countries-db.json', JSON.stringify(parsed));

}


// createIpDatabaseCities();
// createIpDatabase();



fs.copyFileSync('./GeoLite2-City.mmdb', '../dist/cities.mmdb');