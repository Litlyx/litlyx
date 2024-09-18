import fs from 'fs';

const ipsData = JSON.parse(fs.readFileSync('./dist/ipv4-db.json', 'utf8'));
const countriesData = JSON.parse(fs.readFileSync('./dist/countries-db.json', 'utf8'));

function inRange(ip: string, cidr: string) {
    const [subnet, mask] = cidr.split('/');
    const ipBytes = ip.split('.').map(Number);
    const subnetBytes = subnet.split('.').map(Number);

    const ipInt = (ipBytes[0] << 24) | (ipBytes[1] << 16) | (ipBytes[2] << 8) | ipBytes[3];
    const subnetInt = (subnetBytes[0] << 24) | (subnetBytes[1] << 16) | (subnetBytes[2] << 8) | subnetBytes[3];

    const maskInt = 0xffffffff << (32 - parseInt(mask));

    return (ipInt & maskInt) === (subnetInt & maskInt);
}

function getCountryFromId(id: number) {
    for (const country of countriesData) {
        if (country[0] == id) {
            return country;
        }
    }
}

export function lookup(ip: string) {
    try {
        const startPiece = parseInt(ip.split('.')[0]);
        for (const target of ipsData) {
            const matchingStartPiece = target[0] == startPiece;
            if (!matchingStartPiece) continue;
            if (!inRange(ip, target[1])) continue;
            const country = getCountryFromId(target[2]);
            return [country[1], country[2]];
        }
        return ['??', '??'];
    } catch (ex) {
        console.error('ERROR DURING LOOKUP', ex);
        return ['??', '??'];
    }
}