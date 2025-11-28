import { Reader, CityResponse } from 'mmdb-lib';
import fs from 'fs';

const dbPath =
    fs.existsSync('./cities.mmdb') ? './cities.mmdb' :
        fs.existsSync('./script/GeoLite2-City.mmdb') ? './script/GeoLite2-City.mmdb' :
            fs.existsSync('./dist/cities.mmdb') ? './dist/cities.mmdb' : ''

const citiesBuffer = fs.readFileSync(dbPath);

const reader = new Reader<CityResponse>(citiesBuffer);

export function lookupIP(address: string) {
    const res = reader.get(address);
    return res;
}