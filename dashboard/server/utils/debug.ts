

export function getPrettyAggregation(aggregation: any[], indent: number = 0) {
    const text = JSON.stringify(aggregation, null, indent);
    const result = text.replace(
        /"(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z)"/g,
        (match, date) => `ISODate("${date}")`
    ).replace(
        /"([a-fA-F0-9]{24})"/g,
        (match, objectId) => `ObjectId("${objectId}")`
    );
    return result;
}