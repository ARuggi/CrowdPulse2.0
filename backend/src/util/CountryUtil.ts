import fs from 'fs';

const ITALIAN_CITIES_JSON_FILE = 'src/resources/italian_cities.json'

/**
 * Enum of supported countries.
 */
export enum Country {
    ITALY='Italy'
}

export type City = {
    name: string,    // City name
    region: string[] // a region name can be "Emilia Romagna"
    type?: string    // Primary (eg. Rome), admin (eg. Firenze) or minor (eg. Pisa)
}

export const loadCities = (country: Country): City[] => {
    let file;

    switch (country) {
        case Country.ITALY: file = ITALIAN_CITIES_JSON_FILE; break;
        default: return [];
    }

    const read = fs.readFileSync(file, 'utf-8');
    const result = JSON.parse(read) as [];

    return result
        .map((current: {city: string, admin_name: string, capital: string}) => {

            return {
                name: current.city,
                region: typeof(current.admin_name) === 'object' ? current.admin_name as unknown as string[] : [current.admin_name],
                type: current.capital && current.capital.length > 0 ? current.capital.toLowerCase() : undefined
            }
        })
        .sort((c1: City, c2: City) => {
            return c1.region.join(' ').localeCompare(c2.region.join(' '))
        })
}